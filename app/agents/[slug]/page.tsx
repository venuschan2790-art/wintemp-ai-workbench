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
  const aiProvider =
    process.env.AI_PROVIDER?.trim().toLowerCase() === "moyu"
      ? "魔芋 API"
      : "OpenAI API";
  const hasAIKey = Boolean(
    process.env.MOYU_API_KEY || process.env.OPENAI_API_KEY || process.env.AI_API_KEY
  );

  if (!agent) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-8 overflow-hidden rounded-[34px] border border-wintemp-line bg-white/92 p-6 shadow-dashboard backdrop-blur">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              className="rounded-full border border-wintemp-line bg-white px-4 py-2 text-sm font-bold text-wintemp-steel transition hover:border-wintemp-200 hover:text-wintemp-700"
            >
              &lt;- 返回首页
            </Link>
            <span className="rounded-full border border-wintemp-200 bg-wintemp-50 px-4 py-2 text-sm font-extrabold text-wintemp-700">
              {agent.category}
            </span>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <Image
                src="/wintemp-logo.jpg"
                alt="Wintemp"
                width={520}
                height={165}
                className="mb-8 h-14 w-60 object-contain object-left"
              />
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-wintemp-600">
                WINTEMP AI Workflow
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-wintemp-ink">
                {agent.title}
              </h1>
              <p className="mt-5 max-w-4xl text-lg leading-8 text-[#626668]">
                {agent.description}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-wintemp-line bg-wintemp-cloud p-6 shadow-soft">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[54px] bg-wintemp-100" />
              <p className="relative text-sm font-extrabold text-wintemp-ink">
                当前版本能力
              </p>
              <div className="relative mt-5 space-y-4 text-sm text-[#626668]">
                <div className="flex items-center justify-between gap-4">
                  <span>Prompt 生成</span>
                  <span className="font-extrabold text-wintemp-700">Enabled</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>{aiProvider}</span>
                  <span
                    className={
                      hasAIKey
                        ? "font-extrabold text-wintemp-700"
                        : "font-extrabold text-wintemp-gray"
                    }
                  >
                    {hasAIKey ? "Ready" : "Not Connected"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>平台后台数据</span>
                  <span className="font-extrabold text-wintemp-gray">Mock Only</span>
                </div>
              </div>
              <p className="relative mt-6 rounded-2xl bg-white p-4 text-xs leading-5 text-[#707476]">
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
