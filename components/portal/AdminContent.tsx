"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { getIdToken } from "@/lib/authClient";
import { useAuthRoleContext } from "@/components/portal/AuthRoleContext";

const ROLES = ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"] as const;

export function AdminContent() {
  const { locale } = useLocale();
  const { refreshRole } = useAuthRoleContext() ?? {};
  const t = getPortalContent(locale).admin;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("EMPLOYEE");
  const [hubId, setHubId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [seedStatus, setSeedStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [seedMessage, setSeedMessage] = useState("");
  const [seedDemoStatus, setSeedDemoStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [seedDemoMessage, setSeedDemoMessage] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createName, setCreateName] = useState("");
  const [createRole, setCreateRole] = useState<string>("EMPLOYEE");
  const [createHubId, setCreateHubId] = useState("");
  const [createStatus, setCreateStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [createMessage, setCreateMessage] = useState("");
  const [notifTo, setNotifTo] = useState("all");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [notifStatus, setNotifStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [notifMessage, setNotifMessage] = useState("");

  const handleSetRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const token = await getIdToken(true);
      const res = await fetch("/api/admin/setRole", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: email.trim(), role, hubId: hubId.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Erro ao definir função.");
        return;
      }
      setStatus("success");
      setMessage(locale === "pt-BR" ? "Função atualizada." : "Role updated.");
      await refreshRole?.();
    } catch {
      setStatus("error");
      setMessage(locale === "pt-BR" ? "Erro de rede." : "Network error.");
    }
  };

  const handleSeed = async () => {
    setSeedStatus("loading");
    setSeedMessage("");
    try {
      const token = await getIdToken(true);
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setSeedStatus("error");
        setSeedMessage(data.error || "Erro ao gerar dados.");
        return;
      }
      setSeedStatus("success");
      setSeedMessage(locale === "pt-BR" ? "Dados iniciais criados." : "Seed data created.");
    } catch {
      setSeedStatus("error");
      setSeedMessage(locale === "pt-BR" ? "Erro de rede." : "Network error.");
    }
  };

  const handleSeedDemo = async () => {
    setSeedDemoStatus("loading");
    setSeedDemoMessage("");
    try {
      const token = await getIdToken(true);
      const res = await fetch("/api/admin/seed-demo-accounts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setSeedDemoStatus("error");
        setSeedDemoMessage(data.error || "Erro ao criar contas demo.");
        return;
      }
      setSeedDemoStatus("success");
      setSeedDemoMessage(
        data.alreadyExists
          ? t.seedDemoAlreadyExists
          : (t.seedDemoSuccess ?? data.message ?? (locale === "pt-BR" ? "Contas demo criadas." : "Demo accounts created."))
      );
    } catch {
      setSeedDemoStatus("error");
      setSeedDemoMessage(locale === "pt-BR" ? "Erro de rede." : "Network error.");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateStatus("loading");
    setCreateMessage("");
    try {
      const token = await getIdToken(true);
      const res = await fetch("/api/admin/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: createEmail.trim(),
          password: createPassword,
          displayName: createName.trim() || undefined,
          role: createRole,
          hubId: createHubId.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateStatus("error");
        setCreateMessage(data.error || "Erro ao criar usuário.");
        return;
      }
      setCreateStatus("success");
      setCreateMessage(locale === "pt-BR" ? "Usuário criado." : "User created.");
      setCreateEmail("");
      setCreatePassword("");
      setCreateName("");
      setCreateHubId("");
    } catch {
      setCreateStatus("error");
      setCreateMessage(locale === "pt-BR" ? "Erro de rede." : "Network error.");
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifStatus("loading");
    setNotifMessage("");
    try {
      const token = await getIdToken(true);
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to: notifTo.trim(), title: notifTitle.trim(), body: notifBody.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotifStatus("error");
        setNotifMessage(data.error || "Erro ao enviar.");
        return;
      }
      setNotifStatus("success");
      setNotifMessage(locale === "pt-BR" ? "Notificação enviada." : "Notification sent.");
      setNotifTitle("");
      setNotifBody("");
    } catch {
      setNotifStatus("error");
      setNotifMessage(locale === "pt-BR" ? "Erro de rede." : "Network error.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="font-display text-2xl font-bold text-foreground">
        {t.title}
      </h1>

      <section className="rounded-2xl border border-border bg-surface2/50 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          {t.setRole}
        </h2>
        <form onSubmit={handleSetRole} className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t.role}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t.hubId} (opcional)
            </label>
            <input
              type="text"
              value={hubId}
              onChange={(e) => setHubId(e.target.value)}
              placeholder="hub-1"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          {message && (
            <p className={status === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-70"
          >
            {status === "loading" ? (locale === "pt-BR" ? "Salvando…" : "Saving…") : (locale === "pt-BR" ? "Salvar função" : "Save role")}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-surface2/50 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          {t.createAccount}
        </h2>
        <form onSubmit={handleCreateUser} className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.email}</label>
            <input
              type="email"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.password}</label>
            <input
              type="password"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.displayName} ({t.optional})</label>
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.role}</label>
            <select
              value={createRole}
              onChange={(e) => setCreateRole(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.hubId} ({t.optional})</label>
            <input
              type="text"
              value={createHubId}
              onChange={(e) => setCreateHubId(e.target.value)}
              placeholder="hub-1"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          {createMessage && (
            <p className={createStatus === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
              {createMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={createStatus === "loading"}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-70"
          >
            {createStatus === "loading" ? (locale === "pt-BR" ? "Criando…" : "Creating…") : t.createUser}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-surface2/50 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          {t.sendNotification}
        </h2>
        <form onSubmit={handleSendNotification} className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.to}</label>
            <input
              type="text"
              value={notifTo}
              onChange={(e) => setNotifTo(e.target.value)}
              placeholder="all ou e-mail do usuário"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
            <p className="mt-1 text-xs text-muted-foreground">{t.toAll} = all</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.messageTitle}</label>
            <input
              type="text"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.body}</label>
            <textarea
              value={notifBody}
              onChange={(e) => setNotifBody(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          {notifMessage && (
            <p className={notifStatus === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
              {notifMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={notifStatus === "loading"}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-surface2 disabled:opacity-70"
          >
            {notifStatus === "loading" ? (locale === "pt-BR" ? "Enviando…" : "Sending…") : t.sendNotification}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-surface2/50 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          {t.allowlist}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {locale === "pt-BR"
            ? "Use \"Definir função\" para atribuir função a um e-mail. A lista de permissão (allowlist) é gerenciada no Firestore na coleção allowlist."
            : "Use \"Set role\" to assign a role to an email. The allowlist is managed in Firestore collection allowlist."}
        </p>
        <h3 className="font-medium text-foreground mb-2">{t.seed}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {locale === "pt-BR"
            ? "Cria entradas de exemplo na allowlist e hubs (apenas desenvolvimento)."
            : "Creates sample allowlist and hub entries (development only)."}
        </p>
        {seedMessage && (
          <p className={seedStatus === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
            {seedMessage}
          </p>
        )}
        <button
          type="button"
          onClick={handleSeed}
          disabled={seedStatus === "loading"}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-surface2 disabled:opacity-70"
        >
          {seedStatus === "loading" ? (locale === "pt-BR" ? "Gerando…" : "Seeding…") : t.seed}
        </button>

        <h3 className="font-medium text-foreground mt-6 mb-2">{t.seedDemo}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {locale === "pt-BR"
            ? "Cria uma conta por cargo: admin@, gestor@, colaborador@, motorista@, hubops@todogreen.demo (senha 123456)."
            : "Creates one account per role: admin@, gestor@, colaborador@, motorista@, hubops@todogreen.demo (password 123456)."}
        </p>
        {seedDemoMessage && (
          <p className={seedDemoStatus === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
            {seedDemoMessage}
          </p>
        )}
        <button
          type="button"
          onClick={handleSeedDemo}
          disabled={seedDemoStatus === "loading"}
          className="rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-70"
        >
          {seedDemoStatus === "loading" ? (locale === "pt-BR" ? "Criando…" : "Creating…") : t.seedDemo}
        </button>
      </section>
    </div>
  );
}
