"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { BackToTop } from "@/components/common/BackToTop";
import { JsonLd } from "@/components/common/JsonLd";

/**
 * Wraps root layout children: show main site chrome (Navbar, Footer) only for public routes.
 * /portal/* is rendered without main site nav (portal has its own layout).
 * .site-theme applies the brand palette to the public site only (see globals.css).
 */
export function SiteOrPortalWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/portal");

  if (isPortal) {
    return <>{children}</>;
  }

  return (
    <div className="site-theme flex flex-1 flex-col bg-background text-foreground">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
      <JsonLd />
    </div>
  );
}
