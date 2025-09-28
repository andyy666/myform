"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { GovtForm, slugFor } from "../types";
import Link from "next/link";

export default function Search({ data }: { data: GovtForm[] }) {
  const [q, setQ] = useState("");
  const [jurisdiction, setJurisdiction] = useState<string>("US");
  const [category, setCategory] = useState<string>("all");

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: ["code", "title", "aliases", "categories", "agency", "jurisdiction"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [data]
  );

  // compute filters from current US-only data, but keep generic code
  const jurisdictions = useMemo(
    () => Array.from(new Set(data.map((f) => f.jurisdiction))).sort(),
    [data]
  );
  const categories = useMemo(
    () => Array.from(new Set(data.flatMap((f) => f.categories))).sort(),
    [data]
  );

  const searched = q.trim() ? fuse.search(q).map((r) => r.item) : data;
  const filtered = searched.filter((f) => {
    const okJ = jurisdiction === "all" || f.jurisdiction === jurisdiction;
    const okC = category === "all" || f.categories.includes(category);
    return okJ && okC;
  });

  return (
    <div className="space-y-3">
      <div className="card">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Try: "W-9", "passport application", "tax id"'
            className="input"
            aria-label="Search forms"
          />
          <select
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            className="select"
            aria-label="Filter by country"
          >
            <option value="all">All countries</option>
            {jurisdictions.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select"
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {q && filtered.length === 0 && (
          <p className="text-sm text-slate-600 mt-2">
            No results. Try “w9”, “passport”, or an agency name.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {filtered.slice(0, 50).map((f) => (
          <ResultCard key={f.id} f={f} />
        ))}
      </div>
    </div>
  );
}

function ResultCard({ f }: { f: GovtForm }) {
  const verified = new Date(f.updated_at).toLocaleDateString();
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold truncate">[{f.code}] {f.title}</div>
          <div className="text-xs text-slate-600">
            {f.agency} — {f.jurisdiction} • Updated: {verified}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {f.categories.map((c) => (
              <span key={c} className="chip">{c}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {f.pdf_url && (
            <a href={f.pdf_url} target="_blank" rel="noreferrer" className="btn">
              Download PDF
            </a>
          )}
          {f.instructions_url && (
            <a href={f.instructions_url} target="_blank" rel="noreferrer" className="btn">
              Instructions
            </a>
          )}
          <a href={f.official_url} target="_blank" rel="noreferrer" className="btn">
            Official page
          </a>
          <Link href={`/forms/${slugFor(f)}`} className="btn btn-primary">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
