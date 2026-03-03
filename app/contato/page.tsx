import type { Metadata } from "next";
import { getContent, defaultLocale } from "@/content/i18n";
import { ContactContent } from "./ContactContent";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContent(defaultLocale).meta;
  return {
    title: content.title + " | Contato",
    description: content.description,
    openGraph: { title: content.ogTitle, description: content.ogDescription },
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
