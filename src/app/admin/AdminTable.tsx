"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AdminTable({
  rows: initialRows,
}: {
  rows: PrayerRequest[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

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

  async function handleDelete(target: PrayerRequest) {
    const ok = window.confirm(
      `Delete the prayer request from ${target.name}? This cannot be undone.`
    );
    if (!ok) return;

    setError(null);
    setDeleting((prev) => {
      const next = new Set(prev);
      next.add(target.id);
      return next;
    });
    const previous = rows;
    setRows((curr) => curr.filter((r) => r.id !== target.id));

    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: target.id }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "Could not delete.");
      }
      router.refresh();
    } catch (e) {
      setRows(previous);
      setError(e instanceof Error ? e.message : "Could not delete.");
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(target.id);
        return next;
      });
    }
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

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-[var(--color-subtle)] font-body uppercase tracking-[0.18em]">
          Showing {filtered.length} of {rows.length}
        </p>
        {error ? (
          <p className="text-xs text-red-700 font-body">{error}</p>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-[var(--color-muted)] italic py-8 text-center font-body">
            No prayer requests match.
          </p>
        ) : (
          filtered.map((r) => {
            const isDeleting = deleting.has(r.id);
            return (
              <article
                key={r.id}
                className={`rounded-[4px] border border-[var(--color-line)] bg-[var(--color-paper)] p-5 transition-opacity ${
                  isDeleting ? "opacity-50" : ""
                }`}
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
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(r)}
                    disabled={isDeleting}
                    className="text-xs font-body uppercase tracking-[0.18em] text-[var(--color-subtle)] hover:text-red-700 transition-colors disabled:opacity-50 disabled:hover:text-[var(--color-subtle)]"
                  >
                    {isDeleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
