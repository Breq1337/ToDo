"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Sun, Moon, Languages } from "lucide-react";
import { useState, useEffect } from "react";
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

const LOGO_LIGHT = "/images/logo_preta.png";
const LOGO_DARK = "/images/logo_branca.png";
const LOGO_FALLBACK = "/images/todo_logo-21.jpeg";
/** Dimensões da logo (proporção fixa 256x286). */
const LOGO_WIDTH = 256;
const LOGO_HEIGHT = 286;

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const content = getContent(locale).nav;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState(theme === "light" ? LOGO_LIGHT : LOGO_DARK);

  useEffect(() => {
    setLogoSrc(theme === "light" ? LOGO_LIGHT : LOGO_DARK);
  }, [theme]);

  const handleLogoError = () => setLogoSrc(LOGO_FALLBACK);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative z-10 flex items-center gap-2" aria-label="To Do Green - Home">
          <span className="flex h-10 max-h-10 w-auto items-center justify-center overflow-hidden">
            <Image
              src={logoSrc}
              alt="To Do Green"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              className="h-10 w-auto max-h-10 object-contain object-left"
              priority
              onError={handleLogoError}
            />
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(({ href, key }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            const label = content[key];
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium text-foreground/90 hover:text-foreground rounded-lg transition-colors",
                  isActive && "text-primary"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocale(locale === "pt-BR" ? "en" : "pt-BR")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface2 transition-colors"
            aria-label={locale === "pt-BR" ? "Switch to English" : "Mudar para português"}
          >
            <Languages className="h-4 w-4" />
            <span>{locale === "pt-BR" ? "EN" : "PT"}</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-surface2 transition-colors"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>

        <button
          type="button"
          className="relative z-10 md:hidden rounded-lg p-2 text-foreground"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium",
                  pathname === href || (href !== "/" && pathname.startsWith(href))
                    ? "bg-primary/10 text-primary"
                    : "text-foreground"
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
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                <Languages className="h-4 w-4" />
                {locale === "pt-BR" ? "English" : "Português"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTheme(theme === "light" ? "dark" : "light");
                }}
                className="rounded-lg p-2 text-muted-foreground"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
