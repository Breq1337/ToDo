"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { Trophy } from "lucide-react";

interface RankingEntry {
  position: number;
  uid: string;
  displayName: string;
  points: number;
}

export function RankingContent() {
  const { locale } = useLocale();
  const t = getPortalContent(locale).nav;
  const tRank = getPortalContent(locale).rankingPage;
  const tCommon = getPortalContent(locale).common;

  const [list, setList] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ranking");
        if (!res.ok) throw new Error(`ranking ${res.status}`);
        const data = await res.json();
        if (!cancelled) setList(data.ranking ?? []);
      } catch {
        if (!cancelled) setLoadFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-2xl font-bold text-foreground">{t.ranking}</h1>
        <p className="mt-2 text-muted-foreground">{tCommon.loading}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-bold text-foreground"
      >
        {tRank.title}
      </motion.h1>
      <p className="mt-1 text-sm text-muted-foreground">{tRank.subtitle}</p>


      {loadFailed ? (
        <p role="alert" className="mt-6 rounded-2xl border border-border bg-surface2/40 p-6 text-sm text-foreground">
          {tRank.loadError}
        </p>
      ) : list.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-border bg-surface2/40 py-12 text-center">
          <Trophy className="h-10 w-10 text-muted-foreground/60" />
          <p className="mt-3 text-muted-foreground">{tRank.empty}</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[280px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface2/50">
                <th className="px-3 py-2 text-left font-medium text-foreground w-12">{tRank.position}</th>
                <th className="px-3 py-2 text-left font-medium text-foreground">{tRank.name}</th>
                <th className="px-3 py-2 text-right font-medium text-foreground w-20">{tRank.points}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.uid} className="border-b border-border/70 hover:bg-surface2/30">
                  <td className="px-3 py-2 text-muted-foreground">{row.position}</td>
                  <td className="px-3 py-2 text-foreground">
                    {row.displayName || "—"}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-foreground">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
