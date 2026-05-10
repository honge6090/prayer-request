"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";

type Step = "request" | "name" | "thanks";

export default function Home() {
  const [step, setStep] = useState<Step>("request");
  const [request, setRequest] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "request" && requestRef.current) {
      requestRef.current.focus({ preventScroll: true });
    }
    if (step === "name" && nameRef.current) {
      nameRef.current.focus({ preventScroll: true });
    }
  }, [step]);

  useEffect(() => {
    if (step !== "thanks") return;
    const t = setTimeout(() => {
      setStep("request");
      setRequest("");
      setName("");
      setError(null);
    }, 5000);
    return () => clearTimeout(t);
  }, [step]);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), request: request.trim() }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "Something went wrong.");
      }
      setStep("thanks");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-start justify-center px-6 py-10 sm:py-16">
      <div className="w-full max-w-md">
        {step === "request" ? (
          <RequestStep
            value={request}
            onChange={setRequest}
            onContinue={() => setStep("name")}
            inputRef={requestRef}
          />
        ) : null}

        {step === "name" ? (
          <NameStep
            value={name}
            onChange={setName}
            onBack={() => setStep("request")}
            onSubmit={submit}
            submitting={submitting}
            error={error}
            inputRef={nameRef}
          />
        ) : null}

        {step === "thanks" ? <ThanksStep name={name} /> : null}
      </div>
    </main>
  );
}

function RequestStep({
  value,
  onChange,
  onContinue,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const canContinue = value.trim().length > 0;

  return (
    <section key="request" className="flex flex-col items-center text-center">
      <p className="font-body text-[0.78rem] uppercase tracking-[0.32em] text-[var(--color-subtle)] anim-fade">
        Prayer Wall
      </p>
      <div className="divider mt-5 anim-fade delay-1" />

      <h1 className="font-display text-[3.6rem] leading-[1.05] sm:text-[4.4rem] mt-8 anim-fade-up delay-1 text-[var(--color-foreground)]">
        {copy.request.heading}
      </h1>

      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={copy.request.placeholder}
        rows={5}
        className="calm w-full mt-9 px-5 py-4 placeholder:text-[var(--color-subtle)] resize-none anim-fade-up delay-2"
        maxLength={5000}
      />

      <button
        type="button"
        className="calm mt-6 anim-fade-up delay-2"
        onClick={onContinue}
        disabled={!canContinue}
      >
        {copy.request.cta}
      </button>

      <div className="mt-14 max-w-sm space-y-4 anim-fade-up delay-3">
        <p className="text-[var(--color-foreground)] italic font-body">
          {copy.request.intro}
        </p>
        <p className="text-[var(--color-muted)] font-body">
          {copy.request.body}
        </p>
      </div>

      <div className="divider mt-12 anim-fade delay-4" />
      <figure className="mt-8 max-w-sm space-y-3 anim-fade delay-4">
        <blockquote className="font-body italic text-[var(--color-foreground)] leading-relaxed">
          {copy.request.verse}
        </blockquote>
        <figcaption className="font-body text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-subtle)]">
          {copy.request.verseRef}
        </figcaption>
      </figure>
    </section>
  );
}

function NameStep({
  value,
  onChange,
  onBack,
  onSubmit,
  submitting,
  error,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const canSubmit = value.trim().length > 0 && !submitting;

  return (
    <section key="name" className="flex flex-col items-center text-center">
      <p className="font-body text-[0.78rem] uppercase tracking-[0.32em] text-[var(--color-subtle)] anim-fade">
        Step 2 of 2
      </p>
      <div className="divider mt-5 anim-fade delay-1" />

      <h1 className="font-display text-[3.6rem] leading-[1.05] sm:text-[4.4rem] mt-8 anim-fade-up delay-1 text-[var(--color-foreground)]">
        {copy.name.heading}
      </h1>

      <p className="mt-6 max-w-xs text-[var(--color-muted)] anim-fade-up delay-2 font-body">
        {copy.name.body}
      </p>

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={copy.name.placeholder}
        autoComplete="given-name"
        maxLength={200}
        onKeyDown={(e) => {
          if (e.key === "Enter" && canSubmit) onSubmit();
        }}
        className="calm w-full mt-8 px-5 py-3.5 text-center placeholder:text-[var(--color-subtle)] anim-fade-up delay-2"
      />

      {error ? (
        <p className="mt-4 text-sm text-red-700 anim-fade font-body">
          {error}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col items-center gap-3 anim-fade-up delay-3">
        <button
          type="button"
          className="calm"
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          {submitting ? "Sending…" : copy.name.cta}
        </button>
        <button type="button" className="calm-ghost" onClick={onBack}>
          {copy.name.back}
        </button>
      </div>
    </section>
  );
}

function ThanksStep({ name }: { name: string }) {
  return (
    <section
      key="thanks"
      className="flex flex-col items-center text-center pt-8"
    >
      <p className="font-body text-[0.78rem] uppercase tracking-[0.32em] text-[var(--color-subtle)] anim-fade">
        Received
      </p>
      <div className="divider mt-5 anim-fade delay-1" />

      <h1 className="font-display text-[4rem] leading-[1.05] sm:text-[5rem] mt-8 anim-fade-up delay-1 text-[var(--color-foreground)]">
        {copy.thanks.heading(name.trim())}
      </h1>

      <p className="mt-6 max-w-sm text-[var(--color-muted)] anim-fade-up delay-2 font-body">
        {copy.thanks.body}
      </p>

      <div className="divider mt-12 anim-fade delay-3" />

      <figure className="mt-8 max-w-sm space-y-3 anim-fade delay-3">
        <blockquote className="font-body italic text-[var(--color-foreground)] leading-relaxed text-lg">
          {copy.thanks.verse}
        </blockquote>
        <figcaption className="font-body text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-subtle)]">
          {copy.thanks.verseRef}
        </figcaption>
      </figure>
    </section>
  );
}
