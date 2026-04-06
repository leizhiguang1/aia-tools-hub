"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor";
import { cn } from "@/lib/utils";
import { locales, defaultLocale, localeNames, type Locale } from "@/lib/i18n";
import { saveTranslationsAction } from "@/lib/actions/translations";

interface TranslationField {
  name: string;
  label: string;
  type: "input" | "textarea" | "richtext";
}

interface TranslationFieldsProps {
  entityType: string;
  entityId: string;
  fields: TranslationField[];
  existingTranslations: Record<string, Record<string, string>>; // locale -> field -> value
}

export function AdminTranslationFields({
  entityType,
  entityId,
  fields,
  existingTranslations,
}: TranslationFieldsProps) {
  const nonDefaultLocales = locales.filter((l) => l !== defaultLocale);
  const [activeTab, setActiveTab] = useState<string>(nonDefaultLocales[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const formRef = React.useRef<HTMLDivElement>(null);

  async function handleSave() {
    if (!formRef.current) return;
    setSaving(true);
    setSaved(false);
    const inputs = formRef.current.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >("input[name], textarea[name]");
    const formData = new FormData();
    inputs.forEach((el) => formData.append(el.name, el.value));
    await saveTranslationsAction(entityType, entityId, formData);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="border rounded-lg p-4 mt-4 bg-muted/20">
      <h3 className="text-sm font-semibold mb-3">翻译 Translations</h3>

      {/* Language tabs */}
      <div className="flex gap-1 mb-4">
        {nonDefaultLocales.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => setActiveTab(locale)}
            className={cn(
              "px-3 py-1 text-xs rounded-md transition-colors",
              activeTab === locale
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {localeNames[locale as Locale]}
          </button>
        ))}
      </div>

      <div ref={formRef}>
        {nonDefaultLocales.map((locale) => (
          <div
            key={locale}
            className={cn(activeTab === locale ? "block" : "hidden")}
          >
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <Label htmlFor={`${locale}.${field.name}`} className="text-xs">
                    {field.label}
                  </Label>
                  {field.type === "richtext" ? (
                    <RichTextEditor
                      name={`${locale}.${field.name}`}
                      initialContent={existingTranslations[locale]?.[field.name] || ""}
                      placeholder={`${localeNames[locale as Locale]} - ${field.label}`}
                    />
                  ) : field.type === "textarea" ? (
                    <Textarea
                      id={`${locale}.${field.name}`}
                      name={`${locale}.${field.name}`}
                      defaultValue={existingTranslations[locale]?.[field.name] || ""}
                      rows={4}
                      placeholder={`${localeNames[locale as Locale]} - ${field.label}`}
                    />
                  ) : (
                    <Input
                      id={`${locale}.${field.name}`}
                      name={`${locale}.${field.name}`}
                      defaultValue={existingTranslations[locale]?.[field.name] || ""}
                      placeholder={`${localeNames[locale as Locale]} - ${field.label}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 mt-3">
          <Button type="button" size="sm" variant="outline" disabled={saving} onClick={handleSave}>
            {saving ? "保存中..." : "保存翻译"}
          </Button>
          {saved && (
            <span className="text-xs text-green-600">已保存 ✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
