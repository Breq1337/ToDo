import type { Metadata } from "next";
import { getContent, defaultLocale } from "@/content/i18n";
import { ServiceContent } from "./ServiceContent";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContent(defaultLocale).meta;
  return {
    title: content.title + " | Para empresas",
    description: content.description,
    openGraph: { title: content.ogTitle, description: content.ogDescription },
  };
}

export default function ServicePage() {
  return <ServiceContent />;
}
