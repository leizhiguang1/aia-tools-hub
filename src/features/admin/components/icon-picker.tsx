"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/features/admin/actions/upload";

// Extracts the first emoji from a string (handles compound emojis like 🖌️, 👨‍💻)
const emojiRegex = /\p{Emoji_Presentation}(\u200d\p{Emoji_Presentation})*/u;

function firstEmoji(str: string): string {
  const match = str.match(emojiRegex);
  return match ? match[0] : "";
}

export function IconPicker({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const [mode, setMode] = useState<"emoji" | "upload">(
    defaultValue.startsWith("http") ? "upload" : "emoji"
  );
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadFile(fd, "tool-icons");
      setValue(url);
    } catch (err) {
      alert("上传失败: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {/* Hidden input that carries the value to the form */}
      <input type="hidden" name="icon" value={value} />

      {/* Mode toggle */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setMode("emoji")}
          className={cn(
            "px-3 py-1 text-xs rounded-full border transition-colors",
            mode === "emoji"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          Emoji
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "px-3 py-1 text-xs rounded-full border transition-colors",
            mode === "upload"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          上传图片
        </button>
      </div>

      {mode === "emoji" ? (
        <Input
          placeholder="输入 emoji，如 🤖（仅限一个）"
          value={value.startsWith("http") ? "" : value}
          onChange={(e) => {
            const emoji = firstEmoji(e.target.value);
            setValue(emoji);
          }}
        />
      ) : (
        <div className="flex items-center gap-3">
          {/* Preview */}
          {value.startsWith("http") && (
            <img
              src={value}
              alt="icon preview"
              className="w-12 h-12 rounded-lg object-contain border"
            />
          )}
          <div className="flex-1">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "上传中..." : value.startsWith("http") ? "更换图片" : "选择图片"}
            </Button>
          </div>
        </div>
      )}

      {/* Preview for emoji mode */}
      {mode === "emoji" && value && !value.startsWith("http") && (
        <div className="text-4xl">{value}</div>
      )}
    </div>
  );
}
