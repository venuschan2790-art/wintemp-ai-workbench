import Link from "next/link";
import type { AgentConfig } from "@/lib/agents";

type AgentCardProps = {
  agent: AgentConfig;
  index: number;
};

export function AgentCard({ agent, index }: AgentCardProps) {
  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-wintemp-200 hover:shadow-brand"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-wintemp-50 transition group-hover:bg-wintemp-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-wintemp-600 text-sm font-bold text-white shadow-sm">
          {String(index + 1).padStart(2, "0")}
        </div>
        <span className="relative rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
          {agent.badge}
        </span>
      </div>
      <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.18em] text-wintemp-600">
        {agent.category}
      </p>
      <h3 className="relative mt-3 text-xl font-semibold text-wintemp-ink">
        {agent.title}
      </h3>
      <p className="relative mt-3 min-h-20 text-sm leading-6 text-slate-600">
        {agent.description}
      </p>
      <div className="relative mt-6 flex items-center text-sm font-semibold text-wintemp-700">
        打开 Agent
        <span className="ml-2 transition group-hover:translate-x-1">-&gt;</span>
      </div>
    </Link>
  );
}
