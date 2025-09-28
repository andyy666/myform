import forms from "../data/forms.json";
import Link from "next/link";
import { GovtForm, slugFor } from "../types";
import Search from "./search";

export default function Home() {
  const data = forms as GovtForm[];
  const popular = data.slice(0, 5);

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-8 leading-relaxed">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Find My Form</h1>
        <p className="text-slate-700 mt-1">
          Type what you need (“W-9”, “passport application”). We send you to the <b>official</b> page or PDF.
        </p>
      </header>

      <Search data={data} />

      <section className="mt-8">
        <h2 className="text-xl font-medium mb-2">Popular</h2>
        <ul className="list-disc pl-5 space-y-1">
          {popular.map((f) => (
            <li key={f.id}>
              <Link className="text-[rgb(var(--primary))] hover:underline" href={`/forms/${slugFor(f)}`}>
                {f.code} — {f.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-10 text-sm text-slate-600">
        Not legal advice. Always verify details on the official site.
      </footer>
    </main>
  );
}
