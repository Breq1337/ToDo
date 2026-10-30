import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { SiteOrPortalWrapper } from "@/components/layout/SiteOrPortalWrapper";

const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/** Legendas e rótulos, como nas peças da marca. */
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "To Do Green – A maior transportadora elétrica do Brasil",
  description:
    "Transportadora 100% elétrica: first, middle e last mile com frota própria. 500+ veículos elétricos, 196+ cidades atendidas e 38 milhões de entregas.",
  openGraph: {
    title: "To Do Green – A maior transportadora elétrica do Brasil",
    description:
      "Transporte confiável e elétrico na mesma operação, do tamanho que a indústria brasileira exige.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <ThemeScript />
        <ThemeProvider>
          <LocaleProvider>
            <div className="flex min-h-screen flex-col">
              <SiteOrPortalWrapper>{children}</SiteOrPortalWrapper>
            </div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
