"use client";

import { useEffect, useState } from "react";
import { getIdToken } from "@/lib/authClient";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { useAuthRoleContext } from "@/components/portal/AuthRoleContext";
import { canAccess } from "@/lib/rbac";
import { Bell, Send } from "lucide-react";

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

interface RecipientOption {
  email: string;
  displayName: string;
}

export default function PortalMessagesPage() {
  const { locale } = useLocale();
  const authContext = useAuthRoleContext();
  const role = authContext?.role ?? "EMPLOYEE";
  const canSendToAll = canAccess(role, "manager"); // ADMIN/MANAGER can send to "all"

  const t = getPortalContent(locale).notifications;
  const tAnnouncements = getPortalContent(locale).announcements;
  const tCommon = getPortalContent(locale).common;
  const [list, setList] = useState<NotificationItem[]>([]);
  const [recipients, setRecipients] = useState<RecipientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sendToAll, setSendToAll] = useState(canSendToAll);
  const [sendRecipientEmail, setSendRecipientEmail] = useState("");
  const [sendTitle, setSendTitle] = useState("");
  const [sendBody, setSendBody] = useState("");
  const [sendPriority, setSendPriority] = useState("NORMAL");
  const [sendStatus, setSendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [sendMessage, setSendMessage] = useState("");

  const fetchList = async () => {
    const token = await getIdToken(false);
    if (!token) return;
    const res = await fetch("/api/notifications", { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      setError(tCommon.error);
      return;
    }
    const data = await res.json();
    setList(data.notifications ?? []);
  };

  const fetchRecipients = async () => {
    const token = await getIdToken(false);
    if (!token) return;
    const res = await fetch("/api/notifications/recipients", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setRecipients(data.recipients ?? []);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getIdToken(false);
      if (!token) {
        setLoading(false);
        return;
      }
      await Promise.all([
        fetch("/api/notifications", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json().then((d) => !cancelled && setList(d.notifications ?? []))),
        fetch("/api/notifications/recipients", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json().then((d) => !cancelled && setRecipients(d.recipients ?? []))),
      ]);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [locale]);

  useEffect(() => {
    if (!canSendToAll) setSendToAll(false);
  }, [canSendToAll]);

  const markRead = async (id: string) => {
    const token = await getIdToken(false);
    if (!token) return;
    await fetch(`/api/notifications/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const to = sendToAll ? "all" : sendRecipientEmail.trim().toLowerCase();
    if (!to) {
      setSendStatus("error");
      setSendMessage(locale === "pt-BR" ? "Selecione um destinatário ou envie para todos." : "Select a recipient or send to everyone.");
      return;
    }
    if (!sendTitle.trim()) {
      setSendStatus("error");
      setSendMessage(locale === "pt-BR" ? "Título obrigatório." : "Title required.");
      return;
    }
    setSendStatus("loading");
    setSendMessage("");
    try {
      const token = await getIdToken(true);
      if (!token) {
        setSendStatus("error");
        setSendMessage(tCommon.error);
        return;
      }
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to, title: sendTitle.trim(), body: sendBody.trim(), priority: sendPriority }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendStatus("error");
        setSendMessage(data.error || t.sendError);
        return;
      }
      setSendStatus("success");
      setSendMessage(t.sendSuccess);
      setSendTitle("");
      setSendBody("");
      setSendRecipientEmail("");
      fetchList();
    } catch {
      setSendStatus("error");
      setSendMessage(t.sendError);
    }
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
      <h1 className="font-display text-2xl font-bold text-foreground">{t.title}</h1>

      <section className="rounded-2xl border border-border bg-surface2/50 p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Send className="h-4 w-4" />
            {t.sendMessage}
          </h2>
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {canSendToAll && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="sendTarget"
                    checked={sendToAll}
                    onChange={() => setSendToAll(true)}
                    className="rounded-full border-input"
                  />
                  {t.recipientAll}
                </label>
              )}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="sendTarget"
                  checked={!sendToAll}
                  onChange={() => setSendToAll(false)}
                  className="rounded-full border-input"
                />
                {t.toRecipient}
              </label>
            </div>
            {(!sendToAll || !canSendToAll) && (
              <div>
                <span className="text-xs text-muted-foreground block mb-1">{t.selectRecipient}</span>
                <select
                  value={sendRecipientEmail}
                  onChange={(e) => setSendRecipientEmail(e.target.value)}
                  required={!sendToAll}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="">{t.selectRecipient}</option>
                  {recipients.map((r) => (
                    <option key={r.email} value={r.email}>
                      {r.displayName || r.email}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <span className="text-xs text-muted-foreground block mb-1">{t.titleLabel}</span>
              <input
                type="text"
                value={sendTitle}
                onChange={(e) => setSendTitle(e.target.value)}
                placeholder={t.titleLabel}
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-1">{t.bodyLabel}</span>
              <textarea
                value={sendBody}
                onChange={(e) => setSendBody(e.target.value)}
                placeholder={t.bodyLabel}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
            {canSendToAll && sendToAll && (
              <div>
                <span className="text-xs text-muted-foreground block mb-1">{t.priorityLabel}</span>
                <select
                  value={sendPriority}
                  onChange={(e) => setSendPriority(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="NORMAL">{tAnnouncements.priorityNormal}</option>
                  <option value="URGENTE">{tAnnouncements.priorityUrgent}</option>
                  <option value="ATUALIZAÇÃO">{tAnnouncements.priorityUpdate}</option>
                  <option value="BAIXA">{tAnnouncements.priorityBaixa}</option>
                  <option value="INFORMATIVO">{tAnnouncements.priorityInformativo}</option>
                </select>
              </div>
            )}
            {sendMessage && (
              <p className={`text-sm ${sendStatus === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {sendMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={sendStatus === "loading"}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-70"
            >
              {sendStatus === "loading" ? tCommon.loading : t.submitSend}
            </button>
          </form>
        </section>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface2/40 py-16 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/60" />
          <p className="mt-4 text-muted-foreground">{t.empty}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl border p-4 ${n.read ? "border-border bg-background" : "border-primary/30 bg-primary/5"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">{n.title}</h2>
                  {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
                  {n.createdAt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString(locale === "pt-BR" ? "pt-BR" : "en")}
                    </p>
                  )}
                </div>
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                  >
                    {t.markRead}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
