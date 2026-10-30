"use client";

import Link from "next/link";
import { Linkedin, Instagram } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { BrandLogo } from "@/components/layout/Navbar";

const footerLinks = [
  { href: "/quem-somos", key: "about" as const },
  { href: "/para-empresas", key: "service" as const },
  { href: "/parcerias", key: "partnersPage" as const },
  { href: "/contato", key: "contact" as const },
  { href: "/portal/login", key: "portal" as const },
];

/** Perfis publicados em todogreenlog.com. */
const socialLinks = [
  { href: "https://www.linkedin.com/company/todogreen/", label: "LinkedIn", Icon: Linkedin },
  { href: "https://www.instagram.com/todogreen_br/", label: "Instagram", Icon: Instagram },
];

export function Footer() {
  const { locale } = useLocale();
  const content = getContent(locale);
  const nav = content.nav;
  const footer = content.footer;

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1.2fr] md:gap-12">
          <div className="grid content-start gap-4">
            <Link href="/" className="inline-flex w-fit" aria-label="To Do Green - Home">
              <BrandLogo className="h-11" />
            </Link>
            <p className="max-w-xs text-muted-foreground">{footer.tagline}</p>
          </div>

          <nav aria-label={footer.navTitle}>
            <h3 className="mb-3.5 font-mono text-xs font-medium uppercase tracking-[0.1em] text-faint">{footer.navTitle}</h3>
            <ul className="grid gap-2.5">
              {footerLinks.map(({ href, key }) => (
                <li key={href}>
                  <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-3.5 font-mono text-xs font-medium uppercase tracking-[0.1em] text-faint">{footer.contactTitle}</h3>
            <div className="grid gap-3.5">
              <a href="mailto:atendimento@todogreen.com.br" className="w-fit font-semibold text-foreground transition-colors hover:text-primary-ink">
                atendimento@todogreen.com.br
              </a>
              <div className="flex gap-2">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-faint hover:text-foreground"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-border pt-6 text-[13px] text-faint">
          <span>
            © {new Date().getFullYear()} To Do Green. {footer.rights}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em]">{footer.ecosystem}</span>
        </div>
      </div>
    </footer>
  );
}
