"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TagList } from "@/features/public/components/tag-list";
import { localePath } from "@/lib/i18n";
import type { Event } from "@/types";
import type { Dictionary } from "@/lib/dictionaries";

export function EventsList({
  events,
  dict,
  lang,
}: {
  events: Event[];
  dict: Dictionary;
  lang: string;
}) {
  return (
    <div>
      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={localePath(lang, `/events/${event.id}`)}
            className="block group"
          >
            <Card className="hover:shadow-md transition-shadow h-full">
              {event.cover_image && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={event.cover_image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TagList tags={event.tag_list || []} max={2} size="xs" />
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                {event.location && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.location}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex gap-2">
                  <span className={buttonVariants({ variant: "outline", size: "sm" })}>{dict.events.details}</span>
                  {event.external_url && (
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(event.external_url!, "_blank", "noopener,noreferrer");
                      }}
                      className={buttonVariants({ size: "sm" })}
                    >
                      {dict.events.register}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-muted-foreground py-12">{dict.events.no_events}</p>
      )}
    </div>
  );
}
