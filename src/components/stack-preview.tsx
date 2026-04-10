"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";

export function StackPreview({
  imageUrl,
  onClose,
  dict,
}: {
  imageUrl: string;
  onClose: () => void;
  dict: Dictionary;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, whatsapp }),
      });
      if (res.ok) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative max-w-md w-full bg-card rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">{dict.stack.preview_title}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Image */}
        <div className="p-4 relative">
          <img
            src={imageUrl}
            alt={dict.stack.preview_alt}
            className={`w-full rounded-lg transition-all duration-300 ${
              !isSubmitted ? "blur-[3px] pointer-events-none select-none" : ""
            }`}
          />
        </div>

        {/* Actions */}
        <div className="p-4 pt-0 space-y-3">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-3 bg-secondary/30 p-4 rounded-xl border">
              <h4 className="font-medium text-center text-sm mb-3">
                {dict.stack.form_title}
              </h4>
              <input
                type="email"
                required
                placeholder={dict.stack.form_email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
              />
              <input
                type="tel"
                required
                pattern="^\+?[0-9\s\-]{8,20}$"
                title="Example: +1234567890"
                placeholder={dict.stack.form_whatsapp}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="block w-full text-center py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-1"
              >
                {isLoading ? dict.stack.form_processing : dict.stack.form_submit}
              </button>
            </form>
          ) : (
            <>
              {isMobile ? (
                <p className="text-center text-sm text-muted-foreground">
                  {dict.stack.preview_mobile_hint}
                </p>
              ) : (
                <a
                  href={imageUrl}
                  download="my-ai-stack-2026.png"
                  className="block w-full text-center py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {dict.stack.preview_download}
                </a>
              )}
            </>
          )}

          <button
            onClick={onClose}
            className="block w-full text-center py-2.5 px-4 border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            {dict.stack.preview_reselect}
          </button>
        </div>
      </div>
    </div>
  );
}
