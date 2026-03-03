"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getContent } from "@/content/i18n";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  city: z.string().optional(),
  state: z.string().optional(),
  message: z.string().min(10),
  honeypot: z.string().max(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ContactContent() {
  const { locale } = useLocale();
  const c = getContent(locale).contact;
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", city: "", state: "", message: "", honeypot: "" },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative py-16 lg:py-24 min-h-[80vh]">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/aaron-burden-dXYE1d08BiY-unsplash-scaled.jpg"
          alt=""
          fill
          className="object-cover opacity-20 dark:opacity-10"
        />
        <div className="absolute inset-0 bg-background/90 dark:bg-background/95" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl sm:text-5xl font-bold text-foreground"
        >
          {c.title}
        </motion.h1>

        <div className="mt-12 grid lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {c.emailLabel}
              </h2>
              <a
                href="mailto:atendimento@todogreen.com.br"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-2 -m-2"
              >
                <Mail className="h-5 w-5 shrink-0" />
                {c.emailValue}
              </a>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {c.sacLabel}
              </h2>
              <a
                href={`mailto:${c.sacValue}`}
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-2 -m-2"
              >
                <MessageCircle className="h-5 w-5 shrink-0" />
                {c.sacValue}
              </a>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">{c.footerNote}</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-border bg-surface2/50 p-6 sm:p-8 shadow-lg space-y-5"
          >
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("honeypot")}
              className="absolute opacity-0 pointer-events-none h-0 w-0"
              aria-hidden
            />
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                {c.formName}
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={cn(
                  "w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent transition-shadow",
                  errors.name && "border-red-500 focus:ring-red-500"
                )}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                {c.formEmail}
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={cn(
                  "w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent transition-shadow",
                  errors.email && "border-red-500 focus:ring-red-500"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1.5">
                  {c.formCity}
                </label>
                <input
                  id="city"
                  type="text"
                  {...register("city")}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-foreground mb-1.5">
                  {c.formState}
                </label>
                <input
                  id="state"
                  type="text"
                  {...register("state")}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                {c.formMessage}
              </label>
              <textarea
                id="message"
                rows={4}
                {...register("message")}
                className={cn(
                  "w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground resize-y",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent transition-shadow",
                  errors.message && "border-red-500 focus:ring-red-500"
                )}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
              )}
            </div>

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 p-3 text-sm"
              >
                <CheckCircle className="h-5 w-5 shrink-0" />
                {locale === "pt-BR"
                  ? "Mensagem enviada com sucesso. Entraremos em contato em breve."
                  : "Message sent successfully. We will get back to you soon."}
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 p-3 text-sm"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                {locale === "pt-BR"
                  ? "Erro ao enviar. Tente novamente ou use o e-mail acima."
                  : "Something went wrong. Please try again or use the email above."}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "w-full rounded-xl bg-primary py-3.5 px-6 text-sm font-semibold text-primary-foreground",
                "hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              )}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {locale === "pt-BR" ? "Enviando…" : "Sending…"}
                </>
              ) : (
                c.submit
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
