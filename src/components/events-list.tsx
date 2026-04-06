"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TagList } from "@/components/tag-list";
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
                <TagList tags={event.tag_list || []} max={2} size="xs" />
              </div>
              <h3 className="font-semibold text-lg mb-1">
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
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-muted-foreground py-12">{dict.events.no_events}</p>
      )}
    </div>
  );
}
