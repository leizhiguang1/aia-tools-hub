"use client";

import { VoteButton } from "@/features/public/components/vote-button";
import { Trophy } from "lucide-react";
import type { Tool } from "@/types";
import type { Dictionary } from "@/lib/dictionaries";

const RANK_STYLES = [
  "bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/10 ring-amber-300/40",
  "bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/30 dark:to-slate-700/10 ring-slate-300/30",
  "bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/10 ring-orange-300/30",
] as const;

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-white shadow-sm shadow-amber-200">
        <Trophy className="w-4 h-4" />
      </span>
    );
  if (rank <= 3)
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-600 text-white text-xs font-bold">
        {rank}
      </span>
    );
  return (
    <span className="flex items-center justify-center w-7 h-7 text-sm font-semibold text-muted-foreground">
      {rank}
    </span>
  );
}

export function PopularTools({ tools, dict }: { tools: Tool[]; dict: Dictionary }) {
  if (tools.length === 0) return null;
  const top5 = tools.slice(0, 5);
  const [champion, ...rest] = top5;

  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-5">
        <h2 className="text-xl font-bold">{dict.voting.popular_tools}</h2>
        <span className="text-sm text-muted-foreground">{dict.voting.popular_tools_subtitle}</span>
      </div>

      {/* Champion card */}
      <a
        href={champion.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-4 rounded-2xl p-5 mb-3 ring-1 ring-amber-300/50 bg-gradient-to-r from-amber-50 via-yellow-50/60 to-amber-50/30 dark:from-amber-950/40 dark:via-yellow-950/20 dark:to-amber-950/10 transition-all hover:shadow-lg hover:shadow-amber-100/50 hover:-translate-y-0.5"
      >
        <RankBadge rank={1} />
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {champion.icon?.startsWith("http") ? (
            <img src={champion.icon} alt="" className="w-10 h-10 rounded-xl object-contain shrink-0" />
          ) : (
            <span className="text-3xl leading-none shrink-0">{champion.icon}</span>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-base truncate">{champion.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{champion.description}</p>
          </div>
        </div>
        <div className="shrink-0">
          <VoteButton toolId={champion.id} initialCount={champion.vote_count ?? 0} />
        </div>
      </a>

      {/* Rest of leaderboard */}
      <div className="space-y-1.5">
        {rest.map((tool, i) => {
          const rank = i + 2;
          return (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 ring-1 transition-all hover:shadow-sm hover:-translate-y-px ${
                rank <= 3
                  ? RANK_STYLES[rank - 1]
                  : "bg-card ring-foreground/5 hover:ring-foreground/15"
              }`}
            >
              <RankBadge rank={rank} />
              {tool.icon?.startsWith("http") ? (
                <img src={tool.icon} alt="" className="w-7 h-7 rounded-lg object-contain shrink-0" />
              ) : (
                <span className="text-xl leading-none shrink-0">{tool.icon}</span>
              )}
              <span className="font-medium text-sm truncate flex-1">{tool.name}</span>
              <VoteButton toolId={tool.id} initialCount={tool.vote_count ?? 0} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
