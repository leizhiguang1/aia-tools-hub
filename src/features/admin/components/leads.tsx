"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MarketChip } from "@/features/admin/components/market-chip";
import type { Lead } from "@/types";

const SOURCE_LABELS: Record<string, string> = {
  "": "未知",
  image_download: "图片下载",
  timed_popup: "定时弹窗",
  floating_button: "悬浮按钮",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function csvEscape(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadCsv(leads: Lead[]) {
  const header = ["id", "email", "whatsapp", "locale", "source", "created_at"];
  const rows = leads.map((l) =>
    [l.id, l.email, l.whatsapp, l.locale, l.source, l.created_at].map((v) => csvEscape(v ?? "")).join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AdminLeads({ leads, currentMarket }: { leads: Lead[]; currentMarket: string }) {
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [localeFilter, setLocaleFilter] = useState<string>("all");

  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.source || ""))), [leads]);
  const locales = useMemo(() => Array.from(new Set(leads.map((l) => l.locale || ""))), [leads]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (sourceFilter !== "all" && (l.source || "") !== sourceFilter) return false;
      if (localeFilter !== "all" && (l.locale || "") !== localeFilter) return false;
      return true;
    });
  }, [leads, sourceFilter, localeFilter]);

  const summary = useMemo(() => {
    const bySource: Record<string, number> = {};
    const byLocale: Record<string, number> = {};
    for (const l of leads) {
      bySource[l.source || ""] = (bySource[l.source || ""] || 0) + 1;
      byLocale[l.locale || ""] = (byLocale[l.locale || ""] || 0) + 1;
    }
    return { bySource, byLocale };
  }, [leads]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Lead 管理</h1>
          <MarketChip market={currentMarket} />
        </div>
        <Button onClick={() => downloadCsv(filtered)} disabled={filtered.length === 0}>
          导出 CSV ({filtered.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4 bg-muted/20">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">按来源</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(summary.bySource).map(([src, count]) => (
              <Badge key={src} variant="outline">
                {SOURCE_LABELS[src] || src || "未知"}: {count}
              </Badge>
            ))}
          </div>
        </div>
        <div className="border rounded-lg p-4 bg-muted/20">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">按市场</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(summary.byLocale).map(([loc, count]) => (
              <Badge key={loc} variant="outline">
                {loc || "未知"}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <label className="text-sm flex items-center gap-2">
          <span className="text-muted-foreground">来源:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-2 py-1 border rounded-md bg-background text-sm"
          >
            <option value="all">全部</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABELS[s] || s || "未知"}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm flex items-center gap-2">
          <span className="text-muted-foreground">市场:</span>
          <select
            value={localeFilter}
            onChange={(e) => setLocaleFilter(e.target.value)}
            className="px-2 py-1 border rounded-md bg-background text-sm"
          >
            <option value="all">全部</option>
            {locales.map((l) => (
              <option key={l} value={l}>
                {l || "未知"}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>邮箱</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>市场</TableHead>
            <TableHead>来源</TableHead>
            <TableHead>时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.email || "-"}</TableCell>
              <TableCell>{lead.whatsapp || "-"}</TableCell>
              <TableCell>
                <Badge variant="outline">{lead.locale || "未知"}</Badge>
              </TableCell>
              <TableCell>
                <Badge>{SOURCE_LABELS[lead.source] || lead.source || "未知"}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDate(lead.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          {leads.length === 0 ? "暂无 Lead 数据" : "当前筛选条件下没有数据"}
        </p>
      )}
    </div>
  );
}
