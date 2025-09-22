import forms from "../../../data/forms.json";
import { GovtForm, slugFor } from "../../../types";
import type { Metadata } from "next";

const data = forms as GovtForm[];

export function generateStaticParams() {
  return data.map(f => ({ slug: slugFor(f) }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const f = data.find(x => slugFor(x) === params.slug);
  const title = f ? `${f.code} — ${f.title}` : "Form";
  const url = f ? f.official_url : "";
  return {
    title,
    description: f ? `${f.agency} — ${f.jurisdiction}. Quick links to the official page and PDF.` : undefined,
    alternates: { canonical: url || undefined }
  };
}

export default function FormPage({ params }: { params: { slug: string } }) {
  const f = data.find(x => slugFor(x) === params.slug);
  if (!f) return <main style={{padding: 24}}><h1>Form not found</h1></main>;

  const verified = new Date(f.updated_at).toLocaleDateString();
  return (
    <main style={{maxWidth: 800, margin: "40px auto", padding: "0 20px"}}>
      <h1>[{f.code}] {f.title}</h1>
      <p style={{opacity:.9}}>{f.agency} — {f.jurisdiction} • Updated: {verified}</p>

      <ul>
        {f.pdf_url && <li><a href={f.pdf_url} target="_blank" rel="noreferrer">Download PDF</a></li>}
        {f.instructions_url && <li><a href={f.instructions_url} target="_blank" rel="noreferrer">Instructions</a></li>}
        <li><a href={f.official_url} target="_blank" rel="noreferrer">Official page</a></li>
      </ul>

      <h3 style={{marginTop: 24}}>Submission</h3>
      <p>Method: <b>{f.submission.method}</b>{f.submission.fee ? ` • Fee: ${f.submission.fee}` : ""}</p>
      {f.submission.address && <pre style={{whiteSpace:"pre-wrap"}}>{f.submission.address}</pre>}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GovernmentService",
            name: `${f.code} ${f.title}`,
            areaServed: f.jurisdiction,
            provider: { "@type": "GovernmentOrganization", name: f.agency },
            url: f.official_url,
            serviceType: "Government form link"
          })
        }}
      />
    </main>
  );
}
