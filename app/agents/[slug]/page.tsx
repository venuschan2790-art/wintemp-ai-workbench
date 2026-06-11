import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentWorkbench } from "@/components/AgentWorkbench";
import { CURRENT_VERSION_NOTE, agents, getAgent } from "@/lib/agents";

type AgentPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return agents.map((agent) => ({
    slug: agent.slug
  }));
}

export function generateMetadata({ params }: AgentPageProps) {
  const agent = getAgent(params.slug);

  if (!agent) {
    return {
      title: "Agent Not Found | WINTEMP AI Workbench"
    };
  }

  return {
    title: `${agent.title} | WINTEMP AI Workbench`,
    description: agent.description
  };
}

export default function AgentPage({ params }: AgentPageProps) {
  const agent = getAgent(params.slug);
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);

  if (!agent) {
    notFound();
  }

  return (
    <main className="min-h-screen px-8 py-7">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl border border-white bg-white/85 p-6 shadow-sm backdrop-blur">
          <div className="mb-7 flex items-center justify-between">
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-wintemp-200 hover:text-wintemp-700"
            >
              &lt;- 返回首页
            </Link>
            <span className="rounded-full border border-wintemp-200 bg-wintemp-50 px-4 py-2 text-sm font-semibold text-wintemp-700">
              {agent.category}
            </span>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <Image
                src="/wintemp-logo.jpg"
                alt="Wintemp"
                width={520}
                height={165}
                className="mb-6 h-16 w-64 object-contain object-left"
              />
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-wintemp-600">
                Prompt Generator v1.0
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-wintemp-ink">
                {agent.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                {agent.description}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#f7f7f5] p-5 shadow-sm">
              <p className="text-sm font-semibold text-wintemp-ink">
                当前版本能力
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-4">
                  <span>Prompt 生成</span>
                  <span className="font-semibold text-wintemp-700">Enabled</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>OpenAI API</span>
                  <span
                    className={
                      hasOpenAIKey
                        ? "font-semibold text-wintemp-700"
                        : "font-semibold text-slate-400"
                    }
                  >
                    {hasOpenAIKey ? "Ready" : "Not Connected"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>平台后台数据</span>
                  <span className="font-semibold text-slate-400">Mock Only</span>
                </div>
              </div>
              <p className="mt-5 rounded-xl bg-white p-3 text-xs leading-5 text-slate-500">
                {CURRENT_VERSION_NOTE}
              </p>
            </div>
          </div>
        </header>

        <AgentWorkbench slug={agent.slug} />
      </div>
    </main>
  );
}
