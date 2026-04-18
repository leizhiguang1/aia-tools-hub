"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "voted_tools";

function getVotedTools(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markVoted(toolId: string) {
  const set = getVotedTools();
  set.add(toolId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function VoteButton({
  toolId,
  initialCount,
}: {
  toolId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVoted(getVotedTools().has(toolId));
  }, [toolId]);

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (voted || loading) return;

    // Optimistic update
    setVoted(true);
    setCount((c) => c + 1);
    setLoading(true);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId }),
      });
      const data = await res.json();
      setCount(data.vote_count);
      if (data.success || data.already_voted) {
        markVoted(toolId);
        setVoted(true);
      }
    } catch {
      // Revert on error
      setVoted(false);
      setCount((c) => c - 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleVote}
      disabled={voted || loading}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
        voted
          ? "bg-rose-50 text-rose-500 cursor-default"
          : "bg-muted/50 text-muted-foreground hover:bg-rose-50 hover:text-rose-500"
      )}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-all",
          voted ? "fill-rose-500 text-rose-500 scale-110" : ""
        )}
      />
      <span>{count}</span>
    </button>
  );
}
