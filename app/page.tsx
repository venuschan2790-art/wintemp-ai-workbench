import Image from "next/image";
import { AgentCard } from "@/components/AgentCard";
import { CURRENT_VERSION_NOTE, agents } from "@/lib/agents";

const stats = [
  { label: "Agents", value: "04" },
  { label: "Brand Team", value: "Ops" },
  { label: "AI Flow", value: "Ready" }
];

const capabilities = [
  "Social Analytics",
  "Content Planning",
  "Marketing Visuals",
  "Manual Illustration"
];

export default function HomePage() {
  const aiProvider =
    process.env.AI_PROVIDER?.trim().toLowerCase() === "moyu"
      ? "魔芋 API"
      : "OpenAI API";
  const hasAIKey = Boolean(
    process.env.MOYU_API_KEY || process.env.OPENAI_API_KEY || process.env.AI_API_KEY
  );

  return (
    <main className="min-h-screen px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="flex items-center justify-between rounded-[28px] border border-wintemp-line/80 bg-white/90 px-6 py-4 shadow-soft backdrop-blur">
          <div className="flex items-center gap-4">
            <Image
              src="/wintemp-logo.jpg"
              alt="Wintemp"
              width={520}
              height={165}
              className="h-11 w-48 rounded-md object-contain object-left"
            />
            <div className="hidden h-9 w-px bg-wintemp-line lg:block" />
            <div className="hidden lg:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-wintemp-gray">
                Brand Operations
              </p>
              <h1 className="text-lg font-bold tracking-tight text-wintemp-ink">
                WINTEMP AI Workbench
              </h1>
            </div>
          </div>
          <div className="hidden items-center gap-3 text-sm font-semibold text-wintemp-steel md:flex">
            <span>Prompt</span>
            <span className="h-1 w-1 rounded-full bg-wintemp-600" />
            <span>AI</span>
            <span className="h-1 w-1 rounded-full bg-wintemp-600" />
            <span>Brand Assets</span>
          </div>
          <div className="rounded-full border border-wintemp-200 bg-white px-4 py-2 text-sm font-bold text-wintemp-700 shadow-sm">
            v1.0
          </div>
        </header>

        <section className="grid gap-8 py-12 xl:grid-cols-[minmax(0,1.04fr)_500px]">
          <div className="flex min-h-[520px] flex-col justify-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.34em] text-wintemp-600">
              Flows Right / Works Smart
            </p>
            <h2 className="mt-6 max-w-5xl text-5xl font-extrabold leading-[1.02] tracking-tight text-wintemp-ink lg:text-6xl">
              WINTEMP Brand Operations AI Workbench
            </h2>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#626668]">
              面向海外品牌运营、招商内容和营销视觉生产的内部 AI 工作台。
              用统一表单把市场信息、产品资料和 WINTEMP 品牌规范转换为可执行的 Prompt 与 AI 结果。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {capabilities.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-wintemp-line bg-white px-4 py-2 text-sm font-bold text-wintemp-steel shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-wintemp-line bg-white/85 p-4 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-wintemp-gray">
                  API Status
                </p>
                <p className="mt-2 text-xl font-extrabold text-wintemp-ink">
                  {hasAIKey ? `${aiProvider} Connected` : "API Key Needed"}
                </p>
              </div>
              <div className="rounded-2xl border border-wintemp-line bg-wintemp-ink p-4 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                  Brand Color
                </p>
                <p className="mt-2 text-xl font-extrabold text-white">
                  Grey System + WINTEMP Orange
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[34px] border border-wintemp-line bg-white p-7 shadow-dashboard">
            <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-[80px] bg-wintemp-100" />
            <div className="absolute bottom-0 left-0 h-2 w-full bg-gradient-to-r from-wintemp-600 via-wintemp-200 to-transparent" />
            <div className="relative">
              <Image
                src="/wintemp-logo.jpg"
                alt="Wintemp Flows Right"
                width={820}
                height={260}
                className="h-24 w-full object-contain object-left"
              />
              <div className="mt-10 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-wintemp-line bg-wintemp-cloud p-4"
                  >
                    <p className="text-3xl font-extrabold text-wintemp-ink">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] leading-5 text-wintemp-gray">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-wintemp-200 bg-wintemp-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-wintemp-600">
                  Internal Tool
                </p>
                <p className="mt-3 text-sm leading-6 text-wintemp-steel">
                  Reliable hot water and drinking water solutions for global distributors, installers, retailers, and project partners.
                </p>
              </div>
              <p className="mt-4 rounded-2xl bg-wintemp-ink p-4 text-sm leading-6 text-white/78">
                {CURRENT_VERSION_NOTE}
              </p>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-wintemp-600">
                Agent Library
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-wintemp-ink">
                Four workflows for brand growth
              </h2>
            </div>
            <p className="hidden max-w-xl text-right text-sm leading-6 text-[#707476] lg:block">
              选择一个 Agent，填写表单后可生成 Prompt，也可以直接调用 AI 或在营销场景图 Agent 中生成图片。
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {agents.map((agent, index) => (
              <AgentCard key={agent.slug} agent={agent} index={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
