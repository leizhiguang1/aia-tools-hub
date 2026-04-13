/**
 * Per-market QR codes for the generated stack card.
 * Each locale gets its own QR image at /public/images/qr-{locale}.png
 *
 * To regenerate, run for each market with the appropriate CTA URL:
 *   npx qrcode -o public/images/qr-zh-MY.png -w 144 --margin 1 --dark "#1e293b" --light "#ffffff" "YOUR_ZH_MY_CTA_URL"
 *   npx qrcode -o public/images/qr-ms.png    -w 144 --margin 1 --dark "#1e293b" --light "#ffffff" "YOUR_MS_CTA_URL"
 *   npx qrcode -o public/images/qr-en.png    -w 144 --margin 1 --dark "#1e293b" --light "#ffffff" "YOUR_EN_CTA_URL"
 *   npx qrcode -o public/images/qr-zh-TW.png -w 144 --margin 1 --dark "#1e293b" --light "#ffffff" "YOUR_ZH_TW_CTA_URL"
 */
