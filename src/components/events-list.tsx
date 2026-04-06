"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TagList } from "@/components/tag-list";
import { localePath } from "@/lib/i18n";
import type { Event } from "@/types";
import type { Dictionary } from "@/lib/dictionaries";

function getEventStatus(event: Event): "upcoming" | "ongoing" | "past" {
  const now = new Date().toISOString().split("T")[0];
  if (event.date_start > now) return "upcoming";
  if (event.date_end && event.date_end >= now) return "ongoing";
  if (!event.date_end && event.date_start === now) return "ongoing";
  return "past";
}

const statusColors = {
  upcoming: "bg-green-100 text-green-800",
  ongoing: "bg-blue-100 text-blue-800",
  past: "bg-gray-100 text-gray-600",
};

export function EventsList({
  events,
  dict,
  lang,
}: {
  events: Event[];
  dict: Dictionary;
  lang: string;
}) {
  const [filter, setFilter] = useState("all");

  const statusLabels: Record<string, string> = {
    upcoming: dict.events.upcoming,
    ongoing: dict.events.ongoing,
    past: dict.events.past,
  };

  const filters = [
    { value: "all", label: dict.events.all },
    { value: "upcoming", label: dict.events.upcoming },
    { value: "past", label: dict.events.past },
  ];

  const filtered = events.filter((event) => {
    if (filter === "all") return true;
    return getEventStatus(event) === filter;
  });

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-4 py-1.5 text-sm rounded-full border transition-colors",
              filter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((event) => {
          const status = getEventStatus(event);

          return (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              {event.cover_image && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={event.cover_image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      statusColors[status]
                    )}
                  >
                    {statusLabels[status]}
                  </span>
                  <TagList tags={event.tag_list || []} max={2} size="xs" />
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {event.date_start}
                  {event.date_end && event.date_end !== event.date_start
                    ? ` ~ ${event.date_end}`
                    : ""}
                  {event.location && ` · ${event.location}`}
                </p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex gap-2">
                  <Link href={localePath(lang, `/events/${event.id}`)} className={buttonVariants({ variant: "outline", size: "sm" })}>{dict.events.details}</Link>
                  {event.external_url && (
                    <a
                      href={event.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ size: "sm" })}
                    >
                      {dict.events.register}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">{dict.events.no_events}</p>
      )}
    </div>
  );
}
