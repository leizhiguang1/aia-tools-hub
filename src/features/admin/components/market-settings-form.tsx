"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMarketSettingsAction } from "@/features/admin/actions/markets";
import type { Market } from "@/types";

export function MarketSettingsForm({ market }: { market: Market }) {
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [ctaUrl, setCtaUrl] = useState(market.cta_url);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    try {
      await updateMarketSettingsAction(market.id, formData);
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  }

  const dirty = ctaUrl.trim() !== market.cta_url;

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="cta_url">CTA 链接 / CTA URL</Label>
        <Input
          id="cta_url"
          name="cta_url"
          type="url"
          placeholder="https://..."
          value={ctaUrl}
          onChange={(e) => setCtaUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          此链接将用于 buildmystack 卡片上的 QR 码。保存后系统会自动生成二维码并缓存，不会在每次生成图片时重新请求外部服务。
        </p>
      </div>

      <div className="space-y-2">
        <Label>当前二维码预览 / QR Preview</Label>
        <div className="flex items-center gap-4">
          {market.qr_data_url ? (
            <img
              src={market.qr_data_url}
              alt="Market QR"
              className="w-32 h-32 border rounded-md bg-white p-2"
            />
          ) : (
            <div className="w-32 h-32 border rounded-md bg-muted/40 flex items-center justify-center text-xs text-muted-foreground text-center px-2">
              尚未生成<br />No QR yet
            </div>
          )}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>指向 / Points to:</div>
            <div className="font-mono text-foreground break-all max-w-xs">
              {market.cta_url || <span className="italic text-muted-foreground">（未设置 / not set）</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving || !dirty}>
          {saving ? "保存中..." : "保存并重新生成 QR"}
        </Button>
        {savedAt && !saving && (
          <span className="text-sm text-green-600">已保存 / Saved</span>
        )}
        {dirty && !saving && (
          <span className="text-xs text-amber-600">未保存的更改 / Unsaved changes</span>
        )}
      </div>
    </form>
  );
}
