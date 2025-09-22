import forms from "../data/forms.json";
import Link from "next/link";
import { GovtForm, slugFor } from "../types";
import Search from "./search";

export default function Home() {
  const data = forms as GovtForm[];
  const popular = data.slice(0, 5);
  return (
    <main style={{maxWidth: 840, margin: "40px auto", padding: "0 20px", lineHeight: 1.5}}>
      <h1 style={{fontSize: 32, marginBottom: 8}}>Find My Form</h1>
      <p style={{marginBottom: 24, opacity: .9}}>
        Type what you need (“W-9”, “passport application”). We send you to the <b>official</b> page or PDF.
      </p>

      <Search data={data} />

      <h2 style={{marginTop: 32}}>Popular</h2>
      <ul>
        {popular.map(f => (
          <li key={f.id}>
            <Link href={`/forms/${slugFor(f)}`}>{f.code} — {f.title}</Link>
          </li>
        ))}
      </ul>

      <footer style={{marginTop: 40, fontSize: 14, opacity: .8}}>
        Not legal advice. Always verify details on the official site.
      </footer>
    </main>
  );
}
