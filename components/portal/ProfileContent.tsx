"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { getIdToken } from "@/lib/authClient";

interface ProfileData {
  email: string;
  displayName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export function ProfileContent() {
  const { locale } = useLocale();
  const t = getPortalContent(locale).nav;
  const tProfile = getPortalContent(locale).profilePage;
  const tCommon = getPortalContent(locale).common;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState<ProfileData>({
    email: "",
    displayName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const loadProfile = async () => {
    const token = await getIdToken(false);
    if (!token) {
      setLoading(false);
      return;
    }
    const res = await fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setForm({
        email: data.email ?? "",
        displayName: data.displayName ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        zipCode: data.zipCode ?? "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const token = await getIdToken(true);
      if (!token) {
        setMessage({ type: "error", text: tCommon.error });
        setSaving(false);
        return;
      }
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          displayName: form.displayName,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: data.error || tProfile.saveError });
      } else {
        setMessage({ type: "success", text: tProfile.saveSuccess });
      }
    } catch {
      setMessage({ type: "error", text: tProfile.saveError });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-2xl font-bold text-foreground">{t.profile}</h1>
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
        {tProfile.title}
      </motion.h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-border bg-surface2/50 p-6">
        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-muted-foreground mb-1">
            {tProfile.email}
          </label>
          <input
            id="profile-email"
            type="email"
            value={form.email}
            readOnly
            className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="profile-displayName" className="block text-sm font-medium text-muted-foreground mb-1">
            {tProfile.displayName}
          </label>
          <input
            id="profile-displayName"
            type="text"
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>
        <div>
          <label htmlFor="profile-phone" className="block text-sm font-medium text-muted-foreground mb-1">
            {tProfile.phone}
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>
        <div>
          <label htmlFor="profile-address" className="block text-sm font-medium text-muted-foreground mb-1">
            {tProfile.address}
          </label>
          <input
            id="profile-address"
            type="text"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="profile-city" className="block text-sm font-medium text-muted-foreground mb-1">
              {tProfile.city}
            </label>
            <input
              id="profile-city"
              type="text"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label htmlFor="profile-state" className="block text-sm font-medium text-muted-foreground mb-1">
              {tProfile.state}
            </label>
            <input
              id="profile-state"
              type="text"
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
          <div>
            <label htmlFor="profile-zipCode" className="block text-sm font-medium text-muted-foreground mb-1">
              {tProfile.zipCode}
            </label>
            <input
              id="profile-zipCode"
              type="text"
              value={form.zipCode}
              onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
            />
          </div>
        </div>
        {message && (
          <p className={`text-sm ${message.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-70"
        >
          {saving ? tCommon.loading : tCommon.save}
        </button>
      </form>
    </div>
  );
}
