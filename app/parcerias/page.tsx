import type { Metadata } from "next";
import { getContent, defaultLocale } from "@/content/i18n";
import { PartnersContent } from "./PartnersContent";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContent(defaultLocale).meta;
  return {
    title: content.title + " | Parcerias",
    description: content.description,
    openGraph: { title: content.ogTitle, description: content.ogDescription },
  };
}

export default function PartnersPage() {
  return <PartnersContent />;
}
