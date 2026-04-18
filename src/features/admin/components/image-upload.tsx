"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/features/admin/actions/upload";
import { ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  folder?: string;
  label?: string;
  hint?: string;
}

export function ImageUpload({
  name,
  defaultValue = "",
  folder = "cover-images",
  label = "选择图片",
  hint,
}: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const publicUrl = await uploadFile(fd, folder);
      setUrl(publicUrl);
    } catch (err) {
      alert("上传失败: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative inline-block">
          <img
            src={url}
            alt="preview"
            className="w-full max-w-xs h-32 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
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
          <ImageIcon size={14} className="mr-1.5" />
          {uploading ? "上传中..." : url ? "更换图片" : label}
        </Button>
      </div>

      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
