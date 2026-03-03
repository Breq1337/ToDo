"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import {
  ClipboardList,
  MessageSquare,
  Users,
  BookOpen,
  LayoutDashboard,
  TrendingUp,
  Target,
  Activity,
} from "lucide-react";

const DEMO_TEAM = [
  { area: "Operação", count: 12, completed: 10 },
  { area: "Entregas", count: 8, completed: 6 },
  { area: "Hub", count: 5, completed: 4 },
  { area: "Administrativo", count: 4, completed: 4 },
];

const DEMO_TRACKS = [
  { name: "Valores e cultura", person: "Maria S.", progress: 80 },
  { name: "Segurança e conduta", person: "João P.", progress: 45 },
  { name: "Procedimentos de entrega", person: "Ana R.", progress: 100 },
  { name: "Atendimento ao cliente", person: "Carlos M.", progress: 20 },
];

export function ManagerContent() {
  const { locale } = useLocale();
  const t = getPortalContent(locale).managerPanel;
  const tNav = getPortalContent(locale).nav;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="mt-1 text-muted-foreground">{t.subtitle}</p>
      </div>

      <section className="rounded-2xl border border-border bg-surface2/50 p-6">
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          <Users className="h-5 w-5" />
          {t.teamOverview}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.teamOverviewDesc}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_TEAM.map((row) => (
            <div
              key={row.area}
              className="rounded-xl border border-border bg-background p-4"
            >
              <p className="text-sm font-medium text-foreground">{row.area}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{row.count}</p>
              <p className="text-xs text-muted-foreground">
                {row.completed} {t.completedMandatory.toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface2/50 p-6">
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          <LayoutDashboard className="h-5 w-5" />
          {t.kpis}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.kpisDesc}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-background p-4">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold text-foreground">29</p>
            <p className="text-xs text-muted-foreground">{t.totalMembers}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <Target className="h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold text-foreground">83%</p>
            <p className="text-xs text-muted-foreground">{t.completedMandatory}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold text-foreground">72%</p>
            <p className="text-xs text-muted-foreground">{t.avgProgress}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold text-foreground">24</p>
            <p className="text-xs text-muted-foreground">{t.activeThisWeek}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface2/50 p-6">
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          <BookOpen className="h-5 w-5" />
          {t.tracksInProgress}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.tracksInProgressDesc}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[320px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left font-medium text-foreground">{tNav.academy}</th>
                <th className="pb-2 text-left font-medium text-muted-foreground">{t.memberHeader}</th>
                <th className="pb-2 text-right font-medium text-muted-foreground">Progresso</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_TRACKS.map((row) => (
                <tr key={row.name + row.person} className="border-b border-border/70">
                  <td className="py-2 text-foreground">{row.name}</td>
                  <td className="py-2 text-muted-foreground">{row.person}</td>
                  <td className="py-2 text-right font-medium text-foreground">{row.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface2/50 p-6">
        <h2 className="font-semibold text-foreground">{t.quickLinks}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/portal/quadro-avisos"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ClipboardList className="h-4 w-4" />
            {t.viewBoard}
          </Link>
          <Link
            href="/portal/messages"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <MessageSquare className="h-4 w-4" />
            {t.viewMessages}
          </Link>
          <Link
            href="/portal/rh"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Users className="h-4 w-4" />
            {t.viewRHPanel}
          </Link>
          <Link
            href="/portal/academy"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <BookOpen className="h-4 w-4" />
            {t.viewAcademy}
          </Link>
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground">{t.demoDisclaimer}</p>
    </div>
  );
}
