"use client";

import { useMemo, useState } from "react";
import {
  CURRENT_VERSION_NOTE,
  getAgent,
  type AgentConfig,
  type AgentField,
  type AgentSlug
} from "@/lib/agents";

type AgentWorkbenchProps = {
  slug: AgentSlug;
};

type GeneratedImage = {
  b64Json?: string;
  url?: string;
};

const createInitialValues = (agent: AgentConfig) =>
  agent.fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.name] =
      agent.defaults[field.name] ??
      (field.type === "select" || field.type === "radio"
        ? field.options?.[0] ?? ""
        : "");
    return acc;
  }, {});

const getAccept = (field: AgentField) => {
  if (field.type === "image") {
    return "image/png,image/jpeg,image/webp";
  }

  if (
    field.name.toLowerCase().includes("socialdata") ||
    field.label.includes("社媒数据")
  ) {
    return ".xlsx,.csv";
  }

  if (
    field.name.toLowerCase().includes("document") ||
    field.label.includes("安装步骤文档")
  ) {
    return ".docx,.pdf,.txt";
  }

  return undefined;
};

export function AgentWorkbench({ slug }: AgentWorkbenchProps) {
  const agent = getAgent(slug)!;
  const initialValues = useMemo(() => createInitialValues(agent), [agent]);
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [output, setOutput] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const canGenerateImage = slug === "product-marketing-scene";

  const hasRequiredValues = agent.fields
    .filter((field) => field.required)
    .every((field) => values[field.name]?.trim());

  const updateValue = (name: string, nextValue: string) => {
    setValues((current) => ({
      ...current,
      [name]: nextValue
    }));
    setCopyState("idle");
  };

  const toggleValue = (name: string, option: string) => {
    const currentValues = (values[name] ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const nextValues = currentValues.includes(option)
      ? currentValues.filter((item) => item !== option)
      : [...currentValues, option];

    updateValue(name, nextValues.join(", "));
  };

  const buildPromptOutput = () => agent.buildPrompt(values);

  const getImageSrc = (image: GeneratedImage) =>
    image.url ?? (image.b64Json ? `data:image/png;base64,${image.b64Json}` : "");

  const renderField = (field: AgentField) => {
    const commonFocus =
      "outline-none transition focus:border-wintemp-600 focus:bg-white focus:ring-4 focus:ring-wintemp-100";

    if (field.type === "textarea") {
      return (
        <textarea
          className={`min-h-32 w-full resize-y rounded-2xl border border-wintemp-line bg-wintemp-cloud px-4 py-3 text-sm leading-6 text-wintemp-ink ${commonFocus}`}
          placeholder={field.placeholder}
          value={values[field.name] ?? ""}
          onChange={(event) => updateValue(field.name, event.target.value)}
        />
      );
    }

    if (field.type === "select") {
      return (
        <select
          className={`h-11 w-full rounded-2xl border border-wintemp-line bg-wintemp-cloud px-4 text-sm text-wintemp-ink ${commonFocus}`}
          value={values[field.name] ?? ""}
          onChange={(event) => updateValue(field.name, event.target.value)}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "multiselect") {
      const selectedValues = (values[field.name] ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options?.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-2xl border border-wintemp-line bg-wintemp-cloud px-3 py-2 text-sm font-bold text-wintemp-steel transition hover:border-wintemp-200 hover:bg-wintemp-50"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-wintemp-600"
                checked={selectedValues.includes(option)}
                onChange={() => toggleValue(field.name, option)}
              />
              {option}
            </label>
          ))}
        </div>
      );
    }

    if (field.type === "radio") {
      return (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-2xl border border-wintemp-line bg-wintemp-cloud px-3 py-2 text-sm font-bold text-wintemp-steel transition hover:border-wintemp-200 hover:bg-wintemp-50"
            >
              <input
                type="radio"
                className="h-4 w-4 accent-wintemp-600"
                checked={(values[field.name] ?? "") === option}
                name={field.name}
                onChange={() => updateValue(field.name, option)}
              />
              {option}
            </label>
          ))}
        </div>
      );
    }

    if (field.type === "file" || field.type === "image") {
      return (
        <div>
          <input
            className={`w-full rounded-2xl border border-dashed border-wintemp-line bg-wintemp-cloud px-4 py-3 text-sm text-wintemp-steel file:mr-4 file:rounded-full file:border-0 file:bg-wintemp-50 file:px-3 file:py-2 file:text-sm file:font-bold file:text-wintemp-700 ${commonFocus}`}
            type="file"
            accept={getAccept(field)}
            onChange={(event) =>
              updateValue(field.name, event.target.files?.[0]?.name ?? "")
            }
          />
          <p className="mt-2 text-xs text-slate-500">
            当前版本记录文件名；如使用图片生成，会优先根据表单 Prompt 生成。
            {values[field.name] ? ` 已选择：${values[field.name]}` : null}
          </p>
        </div>
      );
    }

    return (
      <input
        className={`h-11 w-full rounded-2xl border border-wintemp-line bg-wintemp-cloud px-4 text-sm text-wintemp-ink placeholder:text-wintemp-gray ${commonFocus}`}
        type={
          field.type === "month"
            ? "month"
            : field.type === "number"
              ? "number"
              : "text"
        }
        placeholder={field.placeholder}
        value={values[field.name] ?? ""}
        onChange={(event) => updateValue(field.name, event.target.value)}
      />
    );
  };

  const generatePrompt = () => {
    setOutput(buildPromptOutput());
    setAiError("");
    setGeneratedImages([]);
    setCopyState("idle");
  };

  const callAI = async () => {
    const prompt = buildPromptOutput();

    setOutput(prompt);
    setAiError("");
    setGeneratedImages([]);
    setAiLoading(true);
    setCopyState("idle");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agentTitle: agent.title,
          prompt
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI 调用失败。");
      }

      setOutput(data.output || "AI 没有返回文本内容。");
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "AI 调用失败。");
    } finally {
      setAiLoading(false);
    }
  };

  const generateImage = async () => {
    const prompt = buildPromptOutput();

    setOutput(prompt);
    setAiError("");
    setGeneratedImages([]);
    setImageLoading(true);
    setCopyState("idle");

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          agentTitle: agent.title,
          aspectRatio: values.aspectRatio,
          prompt
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "图片生成失败。");
      }

      setGeneratedImages(data.images ?? []);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "图片生成失败。");
    } finally {
      setImageLoading(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setOutput("");
    setAiError("");
    setAiLoading(false);
    setImageLoading(false);
    setGeneratedImages([]);
    setCopyState("idle");
  };

  const copy = async () => {
    if (!output) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(500px,1.08fr)]">
      <section className="rounded-[30px] border border-wintemp-line bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-wintemp-600">
              Input Form
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-wintemp-ink">
              任务信息
            </h2>
          </div>
          <span className="rounded-full border border-wintemp-200 bg-wintemp-50 px-3 py-1 text-xs font-extrabold text-wintemp-700">
            Brand Input
          </span>
        </div>

        <div className="space-y-5">
          {agent.fields.map((field) => (
            <label key={field.name} className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-extrabold text-wintemp-steel">
                {field.label}
                {field.required ? (
                  <span className="text-wintemp-600">*</span>
                ) : null}
              </span>
              {renderField(field)}
            </label>
          ))}
        </div>

        <p className="mt-6 rounded-2xl border border-wintemp-200 bg-wintemp-50 p-4 text-sm leading-6 text-wintemp-700">
          {CURRENT_VERSION_NOTE}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full bg-wintemp-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-wintemp-700 disabled:cursor-not-allowed disabled:bg-wintemp-line"
            disabled={!hasRequiredValues}
            onClick={generatePrompt}
          >
            Generate Prompt
          </button>
          <button
            type="button"
            className="rounded-full bg-wintemp-ink px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-wintemp-steel disabled:cursor-not-allowed disabled:bg-wintemp-line"
            disabled={!hasRequiredValues || aiLoading}
            onClick={callAI}
          >
            {aiLoading ? "Calling AI..." : "Call AI"}
          </button>
          {canGenerateImage ? (
            <button
              type="button"
              className="rounded-full bg-[#0f8f5f] px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#0b744d] disabled:cursor-not-allowed disabled:bg-wintemp-line"
              disabled={!hasRequiredValues || imageLoading}
              onClick={generateImage}
            >
              {imageLoading ? "Generating Image..." : "Generate Image"}
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-full border border-wintemp-line bg-white px-5 py-2.5 text-sm font-extrabold text-wintemp-steel transition hover:border-wintemp-200 hover:bg-wintemp-cloud"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-[30px] border border-wintemp-steel bg-wintemp-ink p-6 shadow-dashboard">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-wintemp-200">
              Output Desk
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-white">
              {agent.outputTitle}
            </h2>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:text-white/35"
            disabled={!output}
            onClick={copy}
          >
            Copy
          </button>
        </div>

        <div className="min-h-[560px] rounded-2xl border border-white/10 bg-[#3b3e3f] p-4">
          {generatedImages.length ? (
            <div className="space-y-5">
              <div className="grid gap-4">
                {generatedImages.map((image, index) => {
                  const src = getImageSrc(image);

                  return (
                    <div
                      key={`${src}-${index}`}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Generated WINTEMP marketing scene ${index + 1}`}
                        className="max-h-[560px] w-full object-contain"
                      />
                      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
                        <span className="text-xs text-slate-400">
                          AI generated image
                        </span>
                        <a
                          className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15"
                          href={src}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open Image
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
              <details className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-white">
                  查看本次图片 Prompt
                </summary>
                <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-xs leading-5 text-slate-300">
                  {output}
                </pre>
              </details>
            </div>
          ) : output ? (
            <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-slate-100">
              {output}
            </pre>
          ) : (
            <div className="flex min-h-[488px] items-center justify-center text-center">
              <div>
                <p className="text-sm font-bold text-slate-200">
                  填写左侧表单后生成结构化 Prompt
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  可先生成 Prompt，也可以调用已配置的 AI API；营销场景图 Agent 支持直接生成图片。
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="mt-3 h-5 text-xs text-slate-400">
          {copyState === "copied" ? "已复制到剪贴板。" : null}
          {copyState === "failed" ? "复制失败，请手动选择文本复制。" : null}
          {aiError ? aiError : null}
        </p>
      </section>
    </div>
  );
}
