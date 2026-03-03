import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
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

export const metadata: Metadata = {
  title: "To Do Green – Mudando o Mundo a Cada Entrega",
  description:
    "Transportadora verde que realiza 100% das entregas com veículos elétricos. Delivery sem emissão de CO2.",
  openGraph: {
    title: "To Do Green – Mudando o Mundo a Cada Entrega",
    description:
      "Somos uma transportadora verde que realiza 100% das entregas com veículos elétricos.",
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
        className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased`}
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
