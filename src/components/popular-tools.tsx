"use client";

import { VoteButton } from "@/components/vote-button";
import type { Tool } from "@/types";

export function PopularTools({ tools }: { tools: Tool[] }) {
  return (
    <section className="mb-12">
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="text-xl font-bold">大家都在用</h2>
        <span className="text-sm text-muted-foreground">社区投票最多的工具</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {tools.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none w-48 flex flex-col gap-2 rounded-xl bg-card p-4 text-sm ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-foreground/20"
          >
            <div className="flex items-center gap-2">
              {tool.icon?.startsWith("http") ? (
                <img src={tool.icon} alt="" className="w-8 h-8 rounded-lg object-contain shrink-0" />
              ) : (
                <span className="text-2xl leading-none shrink-0">{tool.icon}</span>
              )}
              <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
            <div className="mt-auto pt-1">
              <VoteButton toolId={tool.id} initialCount={tool.vote_count ?? 0} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
