"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Linkedin, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { cn } from "@/lib/utils";

const footerLinks = [
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

export function Footer() {
  const { theme } = useTheme();
  const { locale } = useLocale();
  const content = getContent(locale);
  const nav = content.nav;
  const footer = content.footer;
  const [logoSrc, setLogoSrc] = useState(theme === "light" ? LOGO_LIGHT : LOGO_DARK);

  useEffect(() => {
    setLogoSrc(theme === "light" ? LOGO_LIGHT : LOGO_DARK);
  }, [theme]);

  const handleLogoError = () => setLogoSrc(LOGO_FALLBACK);

  return (
    <footer className="border-t border-border bg-surface2/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <Link href="/" className="inline-block">
              <span className="flex h-[286px] w-[256px] max-h-32 max-w-[180px] sm:max-h-40 sm:max-w-[220px] lg:max-h-[286px] lg:max-w-[256px] items-center justify-center overflow-hidden">
                <Image
                  src={logoSrc}
                  alt="To Do Green"
                  width={LOGO_WIDTH}
                  height={LOGO_HEIGHT}
                  className="h-full w-full object-contain object-center"
                  onError={handleLogoError}
                />
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {footer.note}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {nav.home}
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              {footer.email}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:atendimento@todogreen.com.br"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  atendimento@todogreen.com.br
                </a>
              </li>
              <li>
                <span className="text-sm text-muted-foreground block mb-1">{footer.sac}</span>
                <a
                  href={`mailto:${footer.sacValue}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  {footer.sacValue}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.linkedin.com/company/to-do-green"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/todogreen"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/todogreen"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} To Do Green. {locale === "pt-BR" ? "Todos os direitos reservados." : "All rights reserved."}
        </div>
      </div>
    </footer>
  );
}
