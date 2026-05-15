"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";

export function StackPreview({
  imageUrl,
  onClose,
  dict,
  lang,
}: {
  imageUrl: string;
  onClose: () => void;
  dict: Dictionary;
  lang: string;
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
        body: JSON.stringify({ email, whatsapp, locale: lang, source: "image_download" }),
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
              {lang === "cn" && (
                <a
                  href="https://api.whatsapp.com/send?phone=60178966906&text=Hi%20Reeve%20%E5%9B%A2%E9%98%9F%EF%BC%8C%E6%88%91%E6%83%B3%E4%BA%86%E8%A7%A3%E3%80%90AI%20%E7%BD%91%E7%BB%9C%E8%87%AA%E7%94%B1%E5%88%9B%E4%B8%9A%E3%80%91%EF%BC%81%E8%AF%B7%E9%97%AE%E5%AD%A6%E4%B9%A0%E7%BE%A4%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%93%AA%E9%87%8C%EF%BC%9F%E6%88%91%E8%A6%81%E9%A2%86%E5%8F%96%20BONUS%20%F0%9F%8E%81"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 px-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/40 rounded-lg text-sm font-bold hover:bg-[#25D366]/20 transition-colors animate-pulse-border"
                >
                  🎁 领取小礼物
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
