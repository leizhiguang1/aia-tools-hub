"use server";

import QRCode from "qrcode";
import { revalidatePath } from "next/cache";
import { getMarketById, updateMarket } from "@/db/queries";
import { locales } from "@/lib/i18n";

async function renderQrDataUrl(url: string): Promise<string> {
  if (!url) return "";
  return QRCode.toDataURL(url, {
    width: 300,
    margin: 1,
    errorCorrectionLevel: "M",
  });
}

export async function updateMarketSettingsAction(marketId: string, formData: FormData) {
  const cta_url = ((formData.get("cta_url") as string) || "").trim();

  const current = await getMarketById(marketId);
  const existingQr = current?.qr_data_url || "";
  const existingUrl = current?.cta_url || "";

  // Regenerate only when the URL actually changes; otherwise keep the cached PNG.
  const qr_data_url = cta_url === existingUrl && existingQr ? existingQr : await renderQrDataUrl(cta_url);

  await updateMarket(marketId, { cta_url, qr_data_url });

  revalidatePath(`/admin/${marketId}/settings`);
  for (const locale of locales) revalidatePath(`/${locale}/build-stack`);
}
