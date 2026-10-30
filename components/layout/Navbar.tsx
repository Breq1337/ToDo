"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Languages } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "home" as const },
  { href: "/quem-somos", key: "about" as const },
  { href: "/para-empresas", key: "service" as const },
  { href: "/parcerias", key: "partnersPage" as const },
  { href: "/contato", key: "contact" as const },
  { href: "/portal/login", key: "portal" as const },
];

/** Logos recortadas e com fundo transparente; a troca por tema é feita no CSS, sem piscar. */
const LOGO_LIGHT = "/images/brand/logo-preta.png";
const LOGO_DARK = "/images/brand/logo-branca.png";

export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <>
      <Image src={LOGO_LIGHT} alt="To Do Green" width={220} height={240} priority={priority} className={cn("w-auto dark:hidden", className)} />
      <Image src={LOGO_DARK} alt="To Do Green" width={215} height={240} priority={priority} className={cn("hidden w-auto dark:block", className)} />
    </>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const content = getContent(locale).nav;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative z-10 flex items-center" aria-label="To Do Green - Home">
          <BrandLogo className="h-[34px]" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-bg2 hover:text-foreground",
                isActive(href) && "text-primary-ink"
              )}
            >
              {content[key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            onClick={() => setLocale(locale === "pt-BR" ? "en" : "pt-BR")}
            className="flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-bg2 hover:text-foreground"
            aria-label={locale === "pt-BR" ? "Switch to English" : "Mudar para português"}
          >
            <Languages className="h-4 w-4" />
            <span>{locale === "pt-BR" ? "EN" : "PT"}</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-bg2 hover:text-foreground"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>

        <button
          type="button"
          className="relative z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-foreground lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium",
                  isActive(href) ? "bg-bg2 text-primary-ink" : "text-foreground"
                )}
              >
                {content[key]}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => {
                  setLocale(locale === "pt-BR" ? "en" : "pt-BR");
                  setMobileOpen(false);
                }}
                className="flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                <Languages className="h-4 w-4" />
                {locale === "pt-BR" ? "English" : "Português"}
              </button>
              <button
                type="button"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-muted-foreground"
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
