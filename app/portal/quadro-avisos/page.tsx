"use client";

import { useEffect, useState } from "react";
import { getIdToken } from "@/lib/authClient";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { useAuthRoleContext } from "@/components/portal/AuthRoleContext";
import { canAccess } from "@/lib/rbac";
import { ClipboardList, Trash2 } from "lucide-react";

interface NotificationItem {
  id: string;
  from: string;
  to: string;
  title: string;
  body: string;
  read: boolean;
  priority?: string;
  createdAt: string | null;
}

const PRIORITY_MAP: Record<string, { labelKey: "priorityUrgent" | "priorityNormal" | "priorityUpdate" | "priorityBaixa" | "priorityInformativo"; className: string }> = {
  URGENTE: { labelKey: "priorityUrgent", className: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200" },
  NORMAL: { labelKey: "priorityNormal", className: "bg-muted text-muted-foreground" },
  "ATUALIZAÇÃO": { labelKey: "priorityUpdate", className: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200" },
  BAIXA: { labelKey: "priorityBaixa", className: "bg-muted/80 text-foreground" },
  INFORMATIVO: { labelKey: "priorityInformativo", className: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200" },
};

export default function QuadroAvisosPage() {
  const { locale } = useLocale();
  const authContext = useAuthRoleContext();
  const role = authContext?.role ?? "EMPLOYEE";
  const canDelete = canAccess(role, "manager"); // ADMIN or MANAGER can delete announcements (to === "all")

  const t = getPortalContent(locale).announcements;
  const tCommon = getPortalContent(locale).common;
  const [list, setList] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchList = async () => {
    const token = await getIdToken(false);
    if (!token) {
      setError(tCommon.error);
      setLoading(false);
      return;
    }
    const res = await fetch("/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setError(tCommon.error);
      setLoading(false);
      return;
    }
    const data = await res.json();
    const all = (data.notifications ?? []) as NotificationItem[];
    const announcements = all.filter((n) => n.to === "all");
    setList(announcements);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getIdToken(false);
      if (!token) {
        setError(tCommon.error);
        setLoading(false);
        return;
      }
      const res = await fetch("/api/notifications", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        if (!cancelled) setError(tCommon.error);
        setLoading(false);
        return;
      }
      const data = await res.json();
      const all = (data.notifications ?? []) as NotificationItem[];
      const announcements = all.filter((n) => n.to === "all");
      if (!cancelled) setList(announcements);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [locale, tCommon.error]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const token = await getIdToken(true);
      if (!token) return;
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setList((prev) => prev.filter((n) => n.id !== id));
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  };

  const getPriorityLabel = (priority: string) => {
    const key = PRIORITY_MAP[priority]?.labelKey ?? "priorityNormal";
    return t[key];
  };

  const getPriorityClass = (priority: string) => {
    return PRIORITY_MAP[priority]?.className ?? PRIORITY_MAP.NORMAL.className;
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="mt-2 text-muted-foreground">{tCommon.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="mt-1 text-muted-foreground">{t.subtitle}</p>
      </div>
      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface2/40 py-16 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground/60" />
          <p className="mt-4 text-muted-foreground">{t.empty}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((n) => (
            <li
              key={n.id}
              className="rounded-xl border border-border bg-surface2/50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${getPriorityClass(n.priority ?? "NORMAL")}`}>
                      {getPriorityLabel(n.priority ?? "NORMAL")}
                    </span>
                  </div>
                  <h2 className="mt-1 font-semibold text-foreground">{n.title}</h2>
                  {n.body && (
                    <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                      {n.body}
                    </p>
                  )}
                  {n.createdAt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString(
                        locale === "pt-BR" ? "pt-BR" : "en"
                      )}
                    </p>
                  )}
                </div>
                {canDelete && (
                  <div className="shrink-0">
                    {confirmDeleteId === n.id ? (
                      <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-2 text-sm">
                        <p className="text-foreground">{t.deleteConfirm}</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(n.id)}
                            disabled={deletingId === n.id}
                            className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {deletingId === n.id ? tCommon.loading : t.deleteConfirmYes}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded border border-border px-2 py-1 text-foreground hover:bg-muted"
                          >
                            {tCommon.cancel}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(n.id)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title={t.deleteButton}
                        aria-label={t.deleteButton}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
