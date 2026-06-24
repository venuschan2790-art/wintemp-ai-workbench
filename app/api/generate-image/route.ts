import { NextResponse } from "next/server";
import { ProxyAgent, request as undiciRequest } from "undici";

type ImageRequest = {
  agentTitle?: string;
  aspectRatio?: string;
  prompt?: string;
};

type ImageResult = {
  b64Json?: string;
  url?: string;
};

const getImageSize = (aspectRatio = "1:1") => {
  const sizes: Record<string, string> = {
    "1:1": "1024x1024",
    "4:3": "1024x768",
    "16:9": "1792x1024",
    "9:16": "1024x1792",
    "4:5": "1024x1280",
    "21:9": "1792x768"
  };

  return sizes[aspectRatio] ?? "1024x1024";
};

const normalizeImage = (item: unknown): ImageResult | null => {
  if (typeof item === "string") {
    return item.startsWith("data:image") || item.startsWith("http")
      ? { url: item }
      : { b64Json: item };
  }

  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Record<string, unknown>;
  const url =
    record.url ??
    record.image_url ??
    record.imageUrl ??
    record.output_url ??
    record.outputUrl;
  const b64Json = record.b64_json ?? record.b64Json ?? record.base64;

  if (typeof url === "string") {
    return { url };
  }

  if (typeof b64Json === "string") {
    return { b64Json };
  }

  return null;
};

const collectImages = (value: unknown): ImageResult[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectImages);
  }

  const normalized = normalizeImage(value);

  if (normalized) {
    return [normalized];
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const direct =
      record.data ??
      record.images ??
      record.image_urls ??
      record.imageUrls ??
      record.output ??
      record.result;

    if (direct && direct !== value) {
      return collectImages(direct);
    }
  }

  return [];
};

export async function POST(request: Request) {
  const apiKey =
    process.env.IMAGE_API_KEY?.trim() ||
    process.env.MOYU_API_KEY?.trim() ||
    process.env.AI_API_KEY?.trim();
  const baseURL =
    process.env.IMAGE_BASE_URL?.trim().replace(/\/$/, "") ||
    process.env.MOYU_BASE_URL?.trim().replace(/\/$/, "") ||
    "https://www.moyu.info";
  const endpointPath =
    process.env.IMAGE_API_PATH?.trim() || "/pg/images/generations";
  const model = process.env.IMAGE_MODEL?.trim() || "jimeng_t2i_v31";
  const proxyURL =
    process.env.IMAGE_PROXY_URL?.trim() ||
    process.env.MOYU_PROXY_URL?.trim() ||
    process.env.AI_PROXY_URL?.trim();

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "缺少图片生成 API Key。请在 Vercel Environment Variables 中填写 IMAGE_API_KEY 或 MOYU_API_KEY。"
      },
      { status: 500 }
    );
  }

  let body: ImageRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求内容不是有效 JSON。" }, { status: 400 });
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "缺少图片生成 Prompt。" }, { status: 400 });
  }

  let responseStatus = 0;
  let raw = "";

  try {
    const apiResponse = await undiciRequest(`${baseURL}${endpointPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        prompt: body.prompt,
        n: 1,
        size: getImageSize(body.aspectRatio),
        response_format: "url"
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
            ? `无法连接图片生成 API：${error.message}`
            : "无法连接图片生成 API。"
      },
      { status: 500 }
    );
  }

  let data: unknown;

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json(
      {
        error: `图片生成 API 返回了无法解析的内容，状态码：${responseStatus}`,
        detail: raw.slice(0, 500)
      },
      { status: responseStatus || 500 }
    );
  }

  if (responseStatus < 200 || responseStatus >= 300) {
    const errorRecord = data as { error?: { message?: string }; message?: string };

    return NextResponse.json(
      {
        error:
          errorRecord.error?.message ||
          errorRecord.message ||
          `图片生成 API 调用失败，状态码：${responseStatus}`
      },
      { status: responseStatus }
    );
  }

  const images = collectImages(data);

  if (!images.length) {
    return NextResponse.json(
      {
        error: "图片生成 API 没有返回图片地址或 base64 图片内容。",
        detail: raw.slice(0, 800)
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    agentTitle: body.agentTitle ?? "",
    images,
    model
  });
}
