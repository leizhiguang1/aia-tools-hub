"use client";

import { useEffect, useState } from "react";

export function StackPreview({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative max-w-md w-full bg-card rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">你的 AI 团队清单</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Image */}
        <div className="p-4">
          <img
            src={imageUrl}
            alt="我的 AI 团队清单"
            className="w-full rounded-lg"
          />
        </div>

        {/* Actions */}
        <div className="p-4 pt-0 space-y-3">
          {isMobile ? (
            <p className="text-center text-sm text-muted-foreground">
              长按图片保存到相册，分享到朋友圈或小红书
            </p>
          ) : (
            <a
              href={imageUrl}
              download="my-ai-stack-2026.png"
              className="block w-full text-center py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              下载图片
            </a>
          )}
          <button
            onClick={onClose}
            className="block w-full text-center py-2.5 px-4 border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            重新选择
          </button>
        </div>
      </div>
    </div>
  );
}
