/**
 * Per-market QR codes for the generated stack card.
 * Each market gets its own QR image at /public/images/qr-{market}.png
 *
 * To regenerate, run for each market with the appropriate CTA URL:
 *   npx qrcode -o public/images/qr-cn.png -w 144 --margin 1 --dark "#1e293b" --light "#ffffff" "YOUR_CN_CTA_URL"
 *   npx qrcode -o public/images/qr-my.png -w 144 --margin 1 --dark "#1e293b" --light "#ffffff" "YOUR_MY_CTA_URL"
 *   npx qrcode -o public/images/qr-tw.png -w 144 --margin 1 --dark "#1e293b" --light "#ffffff" "YOUR_TW_CTA_URL"
 */
