import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LoginSection } from "./LoginSection";

export const metadata: Metadata = {
  title: "Acessar Portal | To Do Green",
  description: "Área do colaborador To Do Green",
};

export default function PortalLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Barra superior: voltar ao site (só na tela de login) */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            ← Voltar ao site
          </Link>
          <span className="text-sm text-muted-foreground">Portal · Login</span>
        </div>
      </header>

      {/* Banner no topo */}
      <div className="w-full overflow-hidden">
        <Image
          src="/images/banner.jpg"
          alt="To Do Green"
          width={1346}
          height={400}
          className="w-full h-48 sm:h-56 object-cover object-center"
          priority
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              To Do Green · Portal
            </h1>
            <p className="mt-2 text-muted-foreground">
              Área do colaborador
            </p>
          </div>
          <LoginSection />
        </div>
      </div>
    </div>
  );
}
