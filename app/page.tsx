import Image from "next/image";
import { AgentCard } from "@/components/AgentCard";
import { CURRENT_VERSION_NOTE, agents } from "@/lib/agents";

const stats = [
  { label: "Prompt Agents", value: "4" },
  { label: "Brand System", value: "Wintemp" },
  { label: "Workflow", value: "Flows Right" }
];

export default function HomePage() {
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);

  return (
    <main className="min-h-screen px-8 py-7">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between rounded-2xl border border-white bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-4">
            <Image
              src="/wintemp-logo.jpg"
              alt="Wintemp"
              width={520}
              height={165}
              className="h-12 w-52 rounded-md object-contain object-left"
            />
            <div className="hidden h-9 w-px bg-slate-200 lg:block" />
            <div className="hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-wintemp-gray">
                Brand Operations
              </p>
              <h1 className="text-lg font-semibold tracking-tight text-wintemp-ink">
                WINTEMP AI Workbench
              </h1>
            </div>
          </div>
          <div className="rounded-full border border-wintemp-200 bg-wintemp-50 px-4 py-2 text-sm font-semibold text-wintemp-700 shadow-sm">
            AI Workbench v1.0
          </div>
        </header>

        <section className="grid gap-8 py-10 xl:grid-cols-[minmax(0,1.05fr)_470px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-wintemp-600">
              Flows Right, Works Smart
            </p>
            <h2 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.08] tracking-tight text-wintemp-ink">
              为 Wintemp 品牌运营团队打造的 AI Prompt 工作台。
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              围绕社媒数据、内容策略、说明书图示和产品营销场景图，统一生成结构化 Prompt，
              让品牌资料、运营输入和 AI 工具之间的流程更顺。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-wintemp-ink shadow-sm">
                Wintemp Orange System
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-wintemp-ink shadow-sm">
                {hasOpenAIKey ? "OpenAI API Ready" : "API Key Needed"}
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-wintemp-ink shadow-sm">
                Internal Dashboard
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white bg-white p-6 shadow-brand">
            <div className="absolute -right-14 -top-20 h-48 w-48 rounded-full bg-wintemp-100" />
            <div className="absolute -bottom-24 left-16 h-56 w-56 rounded-full border-[34px] border-wintemp-50" />
            <div className="relative">
              <Image
                src="/wintemp-logo.jpg"
                alt="Wintemp Flows Right"
                width={820}
                height={260}
                className="h-24 w-full object-contain object-left"
              />
              <div className="mt-8 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-100 bg-[#f7f7f5] p-4"
                  >
                    <p className="text-2xl font-semibold text-wintemp-ink">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-2xl bg-wintemp-50 p-4 text-sm leading-6 text-wintemp-700">
                {CURRENT_VERSION_NOTE}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-wintemp-600">
                Agent Library
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-wintemp-ink">
                第一版 Agent
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              选择一个 Agent，填写表单后可生成 Prompt，也可以直接点击 Call AI 调用模型。
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
