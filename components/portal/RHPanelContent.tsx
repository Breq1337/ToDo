"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { getIdToken } from "@/lib/authClient";
import { useAuthRoleContext } from "@/components/portal/AuthRoleContext";
import { canAccess } from "@/lib/rbac";
import { ClipboardList, Send } from "lucide-react";

export function RHPanelContent() {
  const { locale } = useLocale();
  const auth = useAuthRoleContext();
  const role = auth?.role ?? "EMPLOYEE";
  const t = getPortalContent(locale).rhPanel;
  const tAnnouncements = getPortalContent(locale).announcements;
  const tCommon = getPortalContent(locale).common;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<string>("NORMAL");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const canSend = canAccess(role, "manager");

  const priorityOptions = [
    { value: "NORMAL", labelKey: "priorityNormal" as const },
    { value: "URGENTE", labelKey: "priorityUrgent" as const },
    { value: "ATUALIZAÇÃO", labelKey: "priorityUpdate" as const },
    { value: "BAIXA", labelKey: "priorityBaixa" as const },
    { value: "INFORMATIVO", labelKey: "priorityInformativo" as const },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const token = await getIdToken(true);
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ to: "all", title: title.trim(), body: body.trim(), priority }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || t.error);
        return;
      }
      setStatus("success");
      setMessage(t.success);
      setTitle("");
      setBody("");
    } catch {
      setStatus("error");
      setMessage(t.error);
    }
  };

  if (!canSend) {
    const tGate = getPortalContent(locale).roleGate;
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="mt-4 text-muted-foreground">{tGate.noPermissionMessage}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="mt-1 text-muted-foreground">{t.subtitle}</p>
      </div>

      <section className="rounded-2xl border border-border bg-surface2/50 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {t.sendAnnouncement}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="rh-announcement-title" className="block text-sm font-medium text-foreground">
              {t.announcementTitle}
            </label>
            <input
              id="rh-announcement-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t.announcementTitle}
            />
          </div>
          <div>
            <label htmlFor="rh-announcement-priority" className="block text-sm font-medium text-foreground">
              {t.priorityLabel}
            </label>
            <select
              id="rh-announcement-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {tAnnouncements[opt.labelKey]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rh-announcement-body" className="block text-sm font-medium text-foreground">
              {t.announcementBody}
            </label>
            <textarea
              id="rh-announcement-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t.announcementBody}
            />
          </div>
          {message && (
            <p
              className={
                status === "success"
                  ? "text-sm text-green-600 dark:text-green-400"
                  : "text-sm text-red-600 dark:text-red-400"
              }
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "loading" || !title.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {status === "loading" ? tCommon.loading : t.send}
          </button>
        </form>
      </section>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href="/portal/quadro-avisos"
          className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
        >
          <ClipboardList className="h-4 w-4" />
          {t.viewBoard}
        </Link>
        <Link
          href="/portal/messages"
          className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
        >
          <Send className="h-4 w-4" />
          {t.linkToMessages}
        </Link>
      </div>
    </div>
  );
}
