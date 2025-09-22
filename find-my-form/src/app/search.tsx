"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { GovtForm, slugFor } from "../types";
import Link from "next/link";

export default function Search({ data }: { data: GovtForm[] }) {
  const [q, setQ] = useState("");

  const fuse = useMemo(() => new Fuse(data, {
    keys: ["code", "title", "aliases", "categories", "agency", "jurisdiction"],
    threshold: 0.35,
    ignoreLocation: true
  }), [data]);

  const results = q.trim()
    ? fuse.search(q).slice(0, 25).map(r => r.item)
    : [];

  return (
    <div>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder='Try: "W-9", "passport application", "tax id"'
        style={{
          width: "100%", padding: "12px 14px", fontSize: 16,
          border: "1px solid #ccc", borderRadius: 8
        }}
      />
      <div style={{marginTop: 16}}>
        {q && results.length === 0 && <p>No results yet. Try “w9”, “passport” or an agency name.</p>}
        {results.map(f => <ResultCard key={f.id} f={f} />)}
      </div>
    </div>
  );
}

function ResultCard({ f }: { f: GovtForm }) {
  const verified = new Date(f.updated_at).toLocaleDateString();
  return (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, marginBottom: 12
    }}>
      <div style={{display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap"}}>
        <div>
          <div style={{fontWeight: 600}}>[{f.code}] {f.title}</div>
          <div style={{fontSize: 13, opacity: .85}}>
            {f.agency} — {f.jurisdiction} • Updated: {verified}
          </div>
        </div>
        <div style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
          {f.pdf_url && <a href={f.pdf_url} target="_blank" rel="noreferrer" className="btn">Download PDF</a>}
          {f.instructions_url && <a href={f.instructions_url} target="_blank" rel="noreferrer" className="btn">Instructions</a>}
          <a href={f.official_url} target="_blank" rel="noreferrer" className="btn">Official page</a>
          <Link href={`/forms/${slugFor(f)}`} className="btn">Details</Link>
        </div>
      </div>
      <style jsx>{`
        .btn { border:1px solid #cbd5e1; padding:8px 10px; border-radius:8px; text-decoration:none; font-size:14px }
        .btn:hover { background:#f8fafc }
      `}</style>
    </div>
  );
}
