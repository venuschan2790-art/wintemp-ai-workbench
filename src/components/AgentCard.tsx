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
      className="group relative overflow-hidden rounded-[28px] border border-wintemp-line bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-wintemp-200 hover:shadow-brand"
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[56px] bg-wintemp-cloud transition group-hover:bg-wintemp-100" />
      <div className="absolute bottom-0 left-0 h-1 w-16 bg-wintemp-600 transition-all duration-300 group-hover:w-full" />
      <div className="flex items-start justify-between gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-wintemp-ink text-sm font-extrabold text-white shadow-sm transition group-hover:bg-wintemp-600">
          {String(index + 1).padStart(2, "0")}
        </div>
        <span className="relative rounded-full border border-wintemp-line bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-wintemp-gray">
          {agent.badge}
        </span>
      </div>
      <p className="relative mt-7 text-xs font-extrabold uppercase tracking-[0.24em] text-wintemp-600">
        {agent.category}
      </p>
      <h3 className="relative mt-3 text-xl font-extrabold leading-tight text-wintemp-ink">
        {agent.title}
      </h3>
      <p className="relative mt-4 min-h-24 text-sm leading-6 text-[#686c6e]">
        {agent.description}
      </p>
      <div className="relative mt-7 flex items-center text-sm font-extrabold text-wintemp-700">
        打开 Agent
        <span className="ml-2 transition group-hover:translate-x-1">-&gt;</span>
      </div>
    </Link>
  );
}
