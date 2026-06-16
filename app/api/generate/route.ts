import { NextResponse } from "next/server";
import { ProxyAgent, request as undiciRequest } from "undici";

type GenerateRequest = {
  agentTitle?: string;
  prompt?: string;
};

type ProviderConfig = {
  apiKey?: string;
  apiFormat: "responses" | "chat";
  baseURL: string;
  endpointPath: string;
  model: string;
  name: string;
  proxyURL?: string;
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

  const responsesText = textParts.join("\n").trim();

  if (responsesText) {
    return responsesText;
  }

  const chatContent = data.choices?.[0]?.message?.content;

  if (typeof chatContent === "string") {
    return chatContent;
  }

  if (Array.isArray(chatContent)) {
    return chatContent
      .map((content) => content.text)
      .filter((text) => typeof text === "string")
      .join("\n")
      .trim();
  }

  return "";
};

const getProviderConfig = (): ProviderConfig => {
  const provider =
    process.env.AI_PROVIDER?.trim().toLowerCase() ||
    (process.env.MOYU_API_KEY ? "moyu" : "openai");

  if (provider === "moyu") {
    const apiFormat =
      process.env.MOYU_API_FORMAT?.trim() === "responses"
        ? "responses"
        : "chat";
    const baseURL =
      process.env.MOYU_BASE_URL?.trim().replace(/\/$/, "") ||
      process.env.AI_BASE_URL?.trim().replace(/\/$/, "") ||
      "";

    return {
      apiKey: process.env.MOYU_API_KEY?.trim() || process.env.AI_API_KEY?.trim(),
      apiFormat,
      baseURL,
      endpointPath:
        process.env.MOYU_API_PATH?.trim() ||
        (apiFormat === "responses" ? "/responses" : "/chat/completions"),
      model:
        process.env.MOYU_MODEL?.trim() ||
        process.env.AI_MODEL?.trim() ||
        "gpt-4o-mini",
      name: "魔芋 API",
      proxyURL:
        process.env.MOYU_PROXY_URL?.trim() || process.env.AI_PROXY_URL?.trim()
    };
  }

  const apiFormat =
    process.env.OPENAI_API_FORMAT?.trim() === "chat" ? "chat" : "responses";
  const baseURL =
    process.env.OPENAI_BASE_URL?.trim().replace(/\/$/, "") ||
    process.env.AI_BASE_URL?.trim().replace(/\/$/, "") ||
    "https://api.openai.com/v1";

  return {
    apiKey: process.env.OPENAI_API_KEY?.trim() || process.env.AI_API_KEY?.trim(),
    apiFormat,
    baseURL,
    endpointPath:
      process.env.OPENAI_API_PATH?.trim() ||
      (apiFormat === "chat" ? "/chat/completions" : "/responses"),
    model:
      process.env.OPENAI_MODEL?.trim() ||
      process.env.AI_MODEL?.trim() ||
      "gpt-4o-mini",
    name: "OpenAI API",
    proxyURL:
      process.env.OPENAI_PROXY_URL?.trim() || process.env.AI_PROXY_URL?.trim()
  };
};

const buildPayload = (
  config: ProviderConfig,
  prompt: string
): Record<string, unknown> => {
  const systemPrompt =
    "你是 WINTEMP 品牌运营部内部 AI 工作台助手。请严格根据用户提供的结构化 Prompt 输出结果，不要编造不存在的平台后台数据或真实业务数据。";

  if (config.apiFormat === "chat") {
    return {
      model: config.model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 6000
    };
  }

  return {
    model: config.model,
    input: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_output_tokens: 6000
  };
};

export async function POST(request: Request) {
  const config = getProviderConfig();

  if (!config.apiKey) {
    return NextResponse.json(
      {
        error:
          config.name === "魔芋 API"
            ? "缺少 MOYU_API_KEY。请在 .env.local 或 Vercel Environment Variables 中填写 MOYU_API_KEY。"
            : "缺少 OPENAI_API_KEY。请在 .env.local 或 Vercel Environment Variables 中填写 OPENAI_API_KEY。"
      },
      { status: 500 }
    );
  }

  if (!config.baseURL) {
    return NextResponse.json(
      {
        error:
          "缺少 API Base URL。使用魔芋 API 时请填写 MOYU_BASE_URL，例如官方文档提供的接口基础地址。"
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
    const apiResponse = await undiciRequest(
      `${config.baseURL}${config.endpointPath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(buildPayload(config, body.prompt)),
        dispatcher: config.proxyURL ? new ProxyAgent(config.proxyURL) : undefined
      }
    );

    responseStatus = apiResponse.statusCode;
    raw = await apiResponse.body.text();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `无法连接 ${config.name}：${error.message}${
                (error as Error & { cause?: { message?: string } }).cause
                  ?.message
                  ? `；原因：${
                      (error as Error & { cause?: { message?: string } }).cause
                        ?.message
                    }`
                  : ""
              }`
            : `无法连接 ${config.name}。`
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
        error: `${config.name} 返回了无法解析的内容，状态码：${responseStatus}`,
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
          `${config.name} 调用失败，状态码：${responseStatus}`
      },
      { status: responseStatus }
    );
  }

  const output = extractOutputText(data);

  return NextResponse.json({
    output,
    model: config.model,
    provider: config.name,
    agentTitle: body.agentTitle ?? ""
  });
}
