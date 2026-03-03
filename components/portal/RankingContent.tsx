"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { getIdToken } from "@/lib/authClient";
import { Trophy } from "lucide-react";

interface RankingEntry {
  position: number;
  uid: string;
  displayName: string;
  email: string;
  points: number;
}

export function RankingContent() {
  const { locale } = useLocale();
  const t = getPortalContent(locale).nav;
  const tRank = getPortalContent(locale).rankingPage;
  const tCommon = getPortalContent(locale).common;

  const [list, setList] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchRanking = async () => {
    const res = await fetch("/api/ranking");
    if (res.ok) {
      const data = await res.json();
      setList(data.ranking ?? []);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchRanking();
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleAddPoints = async () => {
    setAdding(true);
    try {
      const token = await getIdToken(true);
      if (!token) return;
      const res = await fetch("/api/ranking", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ add: 10 }),
      });
      if (res.ok) await fetchRanking();
    } finally {
      setAdding(false);
    }
  };

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

      <div className="mt-3">
        <button
          type="button"
          onClick={handleAddPoints}
          disabled={adding}
          className="rounded-lg border border-border bg-surface2/50 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface2 disabled:opacity-70"
        >
          {adding ? tCommon.loading : tRank.addPoints}
        </button>
      </div>

      {list.length === 0 ? (
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
                    {row.displayName || row.email || row.uid}
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
