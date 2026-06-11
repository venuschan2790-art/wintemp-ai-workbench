import { NextResponse } from "next/server";
import { ProxyAgent, request as undiciRequest } from "undici";

type GenerateRequest = {
  agentTitle?: string;
  prompt?: string;
};

const extractOutputText = (data: any) => {
  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  const textParts =
    data.output?.flatMap((item: any) =>
      item.content
        ?.map((content: any) => content.text)
        .filter((text: unknown) => typeof text === "string")
    ) ?? [];

  return textParts.join("\n").trim();
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const baseURL =
    process.env.OPENAI_BASE_URL?.trim().replace(/\/$/, "") ||
    "https://api.openai.com/v1";
  const proxyURL = process.env.OPENAI_PROXY_URL?.trim();

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "缺少 OPENAI_API_KEY。请在项目根目录创建 .env.local 并填写 OPENAI_API_KEY。"
      },
      { status: 500 }
    );
  }

  let body: GenerateRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求内容不是有效 JSON。" }, { status: 400 });
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "缺少 prompt 内容。" }, { status: 400 });
  }

  let responseStatus = 0;
  let raw = "";

  try {
    const apiResponse = await undiciRequest(`${baseURL}/responses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "你是 WINTEMP 品牌运营部内部 AI 工作台助手。请严格根据用户提供的结构化 Prompt 输出结果，不要编造不存在的平台后台数据或真实业务数据。"
          },
          {
            role: "user",
            content: body.prompt
          }
        ],
        max_output_tokens: 6000
      }),
      dispatcher: proxyURL ? new ProxyAgent(proxyURL) : undefined
    });

    responseStatus = apiResponse.statusCode;
    raw = await apiResponse.body.text();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `无法连接 OpenAI API：${error.message}${
                (error as Error & { cause?: { message?: string } }).cause
                  ?.message
                  ? `；原因：${
                      (error as Error & { cause?: { message?: string } }).cause
                        ?.message
                    }`
                  : ""
              }`
            : "无法连接 OpenAI API。"
      },
      { status: 500 }
    );
  }

  let data: any;

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json(
      {
        error: `OpenAI API 返回了无法解析的内容，状态码：${responseStatus}`,
        detail: raw.slice(0, 500)
      },
      { status: responseStatus || 500 }
    );
  }

  if (responseStatus < 200 || responseStatus >= 300) {
    return NextResponse.json(
      {
        error:
          data.error?.message ||
          `OpenAI API 调用失败，状态码：${responseStatus}`
      },
      { status: responseStatus }
    );
  }

  const output = extractOutputText(data);

  return NextResponse.json({
    output,
    model,
    agentTitle: body.agentTitle ?? ""
  });
}
