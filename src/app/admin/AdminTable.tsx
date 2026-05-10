"use client";

import { useMemo, useState } from "react";
import type { PrayerRequest } from "@/lib/supabase";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function csvEscape(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCsv(rows: PrayerRequest[]) {
  const header = ["created_at", "name", "request"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [csvEscape(r.created_at), csvEscape(r.name), csvEscape(r.request)].join(
        ","
      )
    );
  }
  return lines.join("\n");
}

export default function AdminTable({ rows }: { rows: PrayerRequest[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.request.toLowerCase().includes(q)
    );
  }, [rows, query]);

  function downloadCsv() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `prayer-requests-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or request"
          className="calm flex-1 px-4 py-3 text-base"
        />
        <button
          type="button"
          onClick={downloadCsv}
          className="calm whitespace-nowrap"
          disabled={filtered.length === 0}
        >
          Export CSV
        </button>
      </div>

      <p className="mt-3 text-xs text-[var(--color-subtle)] font-body uppercase tracking-[0.18em]">
        Showing {filtered.length} of {rows.length}
      </p>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-[var(--color-muted)] italic py-8 text-center font-body">
            No prayer requests match.
          </p>
        ) : (
          filtered.map((r) => (
            <article
              key={r.id}
              className="rounded-[4px] border border-[var(--color-line)] bg-[var(--color-paper)] p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-[2rem] leading-tight text-[var(--color-foreground)]">
                  {r.name}
                </h3>
                <time
                  className="text-xs font-body uppercase tracking-[0.18em] text-[var(--color-subtle)] whitespace-nowrap"
                  dateTime={r.created_at}
                >
                  {formatDate(r.created_at)}
                </time>
              </div>
              <p className="mt-3 text-[var(--color-foreground)] whitespace-pre-wrap font-body leading-relaxed">
                {r.request}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
