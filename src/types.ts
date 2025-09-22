export type SubmissionMethod = "mail" | "in-person" | "online" | "give-to-requester";

export type GovtForm = {
  id: string;
  jurisdiction: string;
  level: "federal" | "state" | "local" | "national" | "ministry";
  agency: string;
  code: string;
  title: string;
  categories: string[];
  official_url: string;
  pdf_url?: string | null;
  instructions_url?: string | null;
  submission: { method: SubmissionMethod; address?: string | null; fee?: string | null };
  updated_at: string;
  status: "active" | "deprecated";
  aliases: string[];
};

export const slugFor = (f: GovtForm) =>
  `${f.jurisdiction}-${(f.agency || "gov").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${f.code.toLowerCase()}`;

