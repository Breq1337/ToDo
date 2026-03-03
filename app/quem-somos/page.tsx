import type { Metadata } from "next";
import Image from "next/image";
import { getContent, defaultLocale } from "@/content/i18n";
import { AboutContent } from "./AboutContent";

export async function generateMetadata(): Promise<Metadata> {
  const content = getContent(defaultLocale).meta;
  return {
    title: content.title + " | Quem somos",
    description: content.description,
    openGraph: { title: content.ogTitle, description: content.ogDescription },
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
