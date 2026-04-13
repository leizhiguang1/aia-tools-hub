# Localization Guide

This app serves 4 markets with the same content, different translations, different CTA QR codes, and market-level lead tracking.

| Market           | Locale code | URL prefix | Dictionary file     |
|------------------|-------------|------------|---------------------|
| Malaysia Chinese | `zh-MY`     | `/zh-MY`   | `src/messages/zh-MY.json` |
| Malay            | `ms`        | `/ms`      | `src/messages/ms.json`    |
| English          | `en`        | `/en`      | `src/messages/en.json`    |
| Taiwan Chinese   | `zh-TW`     | `/zh-TW`   | `src/messages/zh-TW.json` |

**Default locale:** `zh-MY` (Malaysia Chinese). This is the "source" language — all content in the database is written in Simplified Chinese first, and other locales get translations overlaid on top.

---

## How It Works (Architecture Overview)

There are **two layers** of translation:

### Layer 1: UI Strings (dictionary JSON files)

Static text like button labels, page titles, form placeholders, etc.

- Files live in `src/messages/{locale}.json`
- Loaded server-side via `getDictionary(locale)` in `src/lib/dictionaries.ts`
- Used in pages/components as `dict.section.key` (e.g. `dict.hero.cta`)

**To edit UI strings:** Open the JSON file for the target locale and change the value directly.

### Layer 2: Dynamic Content (Supabase translations table)

Database content like tool names, event titles, news articles — these are managed via the admin panel.

- Source content is stored in the main tables (`tools`, `events`, `posts`, `categories`, `tags`) in Simplified Chinese
- Translations are stored in the `translations` table, keyed by `(entity_type, entity_id, locale, field)`
- When a non-default locale is requested, translations are overlaid onto the source content
- If a translation is missing for a field, the source (Chinese) value is shown as fallback

---

## Admin Panel: Managing Translations

### Adding/Editing Content

1. Go to `/admin/login` and enter the admin password
2. Navigate to the content section (Tools, Events, News, Categories, Tags)
3. **Create** the item first — fill in the Chinese fields and save
4. **Edit** the item — now you'll see a "翻译 Translations" section at the bottom
5. Click through the language tabs: **Bahasa Melayu**, **English**, **中文 (台灣)**
6. Fill in the translated text for each field
7. Click **保存翻译** (Save Translations) to save

### What fields can be translated?

| Entity Type | Translatable Fields                |
|-------------|-------------------------------------|
| Tool        | name, description                   |
| Event       | title, description, content         |
| Post (News) | title, excerpt, content             |
| Category    | name                                |
| Tag         | name                                |

### Important Notes

- You **cannot** translate the default locale (`zh-MY`) from the admin panel — that's the source content, edit it directly in the main form fields
- Empty translation fields fall back to the Chinese source automatically
- Saving translations immediately revalidates all locale pages

---

## QR Codes: Per-Market CTA Links

Each generated stack card image includes a QR code specific to the user's market. The QR codes are at:

```
public/images/qr-zh-MY.png   → Malaysia Chinese CTA link
public/images/qr-ms.png      → Malay CTA link
public/images/qr-en.png      → English CTA link
public/images/qr-zh-TW.png   → Taiwan CTA link
```

### How to Generate QR Codes

You need the `qrcode` npm package (already in dev dependencies or install globally):

```bash
npm install -g qrcode
```

Then generate each QR code with the CTA URL for that market:

```bash
# Malaysia Chinese — e.g. links to WhatsApp group / landing page
npx qrcode -o public/images/qr-zh-MY.png -w 144 --margin 1 \
  --dark "#1e293b" --light "#ffffff" \
  "https://your-zh-my-cta-link.com"

# Malay
npx qrcode -o public/images/qr-ms.png -w 144 --margin 1 \
  --dark "#1e293b" --light "#ffffff" \
  "https://your-ms-cta-link.com"

# English
npx qrcode -o public/images/qr-en.png -w 144 --margin 1 \
  --dark "#1e293b" --light "#ffffff" \
  "https://your-en-cta-link.com"

# Taiwan
npx qrcode -o public/images/qr-zh-TW.png -w 144 --margin 1 \
  --dark "#1e293b" --light "#ffffff" \
  "https://your-zh-tw-cta-link.com"
```

Replace the URLs with your actual CTA links (WhatsApp group invites, landing pages, etc.).

**QR image specs:**
- Size: 144x144px (rendered at 72x72 on card, 2x for retina)
- Colors: dark `#1e293b`, light `#ffffff` (matches the card design)
- Margin: 1 module

---

## Lead Tracking: Knowing Which Market They're From

When a user fills in the lead capture form (email + WhatsApp) on the stack builder, their **locale is automatically saved** with the lead record.

### Database: `leads` table

| Column    | Type | Description                    |
|-----------|------|--------------------------------|
| id        | text | CUID2 unique ID                |
| email     | text | User's email                   |
| whatsapp  | text | Cleaned WhatsApp number        |
| locale    | text | Market locale (e.g. `zh-MY`, `ms`, `en`, `zh-TW`) |
| created_at| timestamp | Auto-generated             |

### Supabase Migration

Run this SQL in your Supabase SQL editor to add the `locale` column:

```sql
ALTER TABLE leads ADD COLUMN locale text DEFAULT '';
```

### Querying Leads by Market

In Supabase dashboard or SQL:

```sql
-- All leads from Malaysia Chinese market
SELECT * FROM leads WHERE locale = 'zh-MY';

-- Lead count per market
SELECT locale, COUNT(*) as count
FROM leads
GROUP BY locale
ORDER BY count DESC;

-- Recent leads from Taiwan
SELECT * FROM leads
WHERE locale = 'zh-TW'
ORDER BY created_at DESC
LIMIT 20;
```

---

## Adding a New Market/Language

If you need to add a 5th market later:

### 1. Update locale config

In `src/lib/i18n.ts`, add the new locale to all 4 places:

```typescript
export const locales = ["zh-MY", "ms", "en", "zh-TW", "ja"] as const;

export const localeNames: Record<Locale, string> = {
  ...
  ja: "日本語",
};

export const dateLocaleMap: Record<Locale, string> = {
  ...
  ja: "ja-JP",
};
```

### 2. Create dictionary file

Create `src/messages/ja.json` with all the same keys as the other locale files. Copy `en.json` as a starting template.

### 3. Register the dictionary

In `src/lib/dictionaries.ts`, add:

```typescript
ja: () => import("@/messages/ja.json").then((m) => m.default),
```

### 4. Create QR code

```bash
npx qrcode -o public/images/qr-ja.png -w 144 --margin 1 \
  --dark "#1e293b" --light "#ffffff" "https://your-ja-cta-link.com"
```

### 5. Add translations in admin

The admin translation tabs will automatically show the new locale. Go through your content and add translations.

That's it — no routing or middleware changes needed. Everything derives from the `locales` array in `i18n.ts`.

---

## Language Switcher

The language dropdown in the navbar automatically shows all configured locales. When a user switches:

1. The URL path segment changes (e.g. `/zh-MY/build-stack` → `/en/build-stack`)
2. A `locale` cookie is set (expires in 1 year)
3. The page does a full reload to fetch the correct translations

---

## File Reference

| File | Purpose |
|------|---------|
| `src/lib/i18n.ts` | Locale definitions, default locale, locale names |
| `src/lib/dictionaries.ts` | Dictionary loader (maps locale → JSON file) |
| `src/messages/*.json` | UI string translations per locale |
| `src/lib/translate.ts` | Helper to overlay DB translations onto entities |
| `src/db/queries.ts` | DB queries including `getBulkTranslations()`, `createLead()` |
| `src/lib/actions/translations.ts` | Server action to save translations from admin |
| `src/components/admin-translation-fields.tsx` | Admin UI for managing translations per locale |
| `src/components/language-switcher.tsx` | Locale dropdown in navbar |
| `src/components/stack-builder.tsx` | Stack card generator (uses per-locale QR) |
| `src/components/stack-preview.tsx` | Lead capture form (sends locale with submission) |
| `src/app/api/leads/route.ts` | Lead API endpoint (stores locale) |
| `src/lib/config.ts` | QR generation commands reference |
| `public/images/qr-{locale}.png` | Per-market QR code images |
