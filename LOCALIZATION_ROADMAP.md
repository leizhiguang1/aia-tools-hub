# Localization & Scaling Roadmap

This document outlines the current state of localization within the AI Tools Hub and serves as a blueprint for future feature expansions related to multi-language routing, regional marketing, and lead capturing.

---

## 🟢 Current State (Phase 0: Successfully Implemented)

We have successfully laid the architectural foundation for a robust, multi-language web application. All translations and multi-language features are fully centralized.

1. **Global Tool Display**
   * Currently, all tools in the database are visible to all users across all languages. The interface gracefully swaps text contents (Tool Name, Tool Description) based on the user's selected language (`/zh`, `/vi`, `/en`).
2. **Localized URLs with Fallbacks**
   * The system now allows the administrator to override the default tool URL for any specific language. 
   * **Behavior**: If a user is on the Vietnamese (`/vi`) path and clicks a tool, the system checks if a specific Vietnamese URL is defined. If yes, it redirects there. If not, it falls back safely to the primary tool URL.
3. **Dynamic built-in QR Code Generation**
   * The Admin panel automatically generates a dynamically refreshing QR code next to the URL input. This avoids dependencies on external generators and makes grabbing creatives for marketing entirely frictionless.

---

## 🟡 Future Feature: Tool Visibility Customization

When you only want specific tools to be shown in certain countries or languages.

**What needs to be built:**
* Implement an `is_published` toggles within the translation system.
* **Database Updates**: No major changes needed; the `translations` table simply receives a new field name (`is_published`) with a string boolean (`"true"` | `"false"`).
* **Admin UI Updates**: Expand the `<AdminTranslationFields>` component in the Admin Tool Form to include a "Visible to this region" checkbox.
* **Frontend Filtering**: Update the `tools.filter()` logic in Next.js to respect translation visibility preferences before rendering the tool grid.

---

## 🟡 Future Feature: Regional Lead Tracking 

When you want to capture emails before actions (like image downloads or link clicks) and cleanly segment them by language/country for targeted ad syncing.

**What needs to be built:**
* **Database Updates**: Add a `locale` (String) column to the `leads` table in Supabase.
* **Frontend Capture**: Whenever a user submits a form or triggers a gated modal on the frontend, grab the active locale from the URL (e.g., `lang` from the page parameters) and submit it alongside their email.
* **Dashboard / CRM Export**: Filter and segment the exported CSVs or webhook data so you can cleanly load Vietnamese emails into a Vietnam-specific Facebook Lookalike Audience and Chinese emails into their respective campaigns.

---

## 🟡 Future Feature: Fully Localized Landing Pages or Subdomains

If ad platforms ever require distinct structural separation beyond `/vi` and `/zh`.

**What needs to be built:**
* The current subdirectory structure (`domain.com/vi`) is highly recommended for retaining SEO authority globally and is 100% fine for Facebook/Google Ads.
* However, if absolute isolation is needed, the architecture can support mapping custom subdomains (e.g., `vi.domain.com`) natively via Next.js domain-based i18n routing without rewriting the underlying application.
