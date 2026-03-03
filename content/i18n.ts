/**
 * Typed i18n — dictionary-based. Default pt-BR, secondary en.
 */

import { siteContentPt } from "./siteContent.pt";
import { siteContentEn } from "./siteContent.en";
import type { SiteContent } from "./siteContent.pt";

export type Locale = "pt-BR" | "en";

export type { SiteContent };

const dictionaries: Record<Locale, SiteContent> = {
  "pt-BR": siteContentPt,
  en: siteContentEn,
};

export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale] ?? dictionaries["pt-BR"];
}

export const defaultLocale: Locale = "pt-BR";

// Phase 2 — Portal (same locale)
import { portalI18nPt } from "./portalI18n.pt";
import { portalI18nEn } from "./portalI18n.en";

export type PortalContent = typeof portalI18nPt;

const portalDictionaries: Record<Locale, PortalContent> = {
  "pt-BR": portalI18nPt,
  en: portalI18nEn,
};

export function getPortalContent(locale: Locale): PortalContent {
  return portalDictionaries[locale] ?? portalDictionaries["pt-BR"];
}
