"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";

const TIMED_DELAY_MS = 10_000;

type LeadSource = "timed_popup" | "floating_button";

export function LeadCapture({ dict, lang }: { dict: Dictionary; lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSource, setActiveSource] = useState<LeadSource>("timed_popup");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const timer = window.setTimeout(() => {
      setActiveSource("timed_popup");
      setIsOpen(true);
    }, TIMED_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    setTimeout(() => setIsSubmitted(false), 200);
  };

  const openFromButton = () => {
    setActiveSource("floating_button");
    setIsSubmitted(false);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, whatsapp, locale: lang, source: activeSource }),
      });
      if (res.ok) {
        setHasSubmitted(true);
        setIsSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showFloatingButton = hydrated && !hasSubmitted && !isOpen;

  return (
    <>
      {showFloatingButton && (
        <button
          type="button"
          onClick={openFromButton}
          aria-label={dict.lead_popup.title}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-primary text-primary-foreground rounded-full shadow-lg px-4 py-3 text-sm font-medium hover:bg-primary/90 transition-all hover:scale-105"
        >
          <span aria-hidden>📬</span>
          <span className="hidden sm:inline">{dict.lead_popup.fab_label}</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative max-w-md w-full bg-card rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">{dict.lead_popup.title}</h3>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label={dict.lead_popup.close}
                className="text-muted-foreground hover:text-foreground text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-4 space-y-3">
              {!isSubmitted ? (
                <>
                  <p className="text-sm text-muted-foreground">{dict.lead_popup.description}</p>
                  <form onSubmit={handleSubmit} className="space-y-3 bg-secondary/30 p-4 rounded-xl border">
                    <input
                      type="email"
                      required
                      placeholder={dict.lead_popup.email_placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                    />
                    <input
                      type="tel"
                      required
                      pattern="^\+?[0-9\s\-]{8,20}$"
                      title="Example: +1234567890"
                      placeholder={dict.lead_popup.whatsapp_placeholder}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="block w-full text-center py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? dict.lead_popup.processing : dict.lead_popup.submit}
                    </button>
                  </form>
                  {activeSource === "timed_popup" && (
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="block w-full text-center py-2 px-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {dict.lead_popup.dismiss}
                    </button>
                  )}
                </>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <h4 className="font-semibold text-lg">{dict.lead_popup.success_title}</h4>
                  <p className="text-sm text-muted-foreground">{dict.lead_popup.success_description}</p>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="mt-4 inline-block py-2 px-6 border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                  >
                    {dict.lead_popup.close}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
