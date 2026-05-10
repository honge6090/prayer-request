"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <main className="flex flex-1 items-start justify-center px-6 py-10 sm:py-16">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <p className="font-body text-[0.78rem] uppercase tracking-[0.32em] text-[var(--color-subtle)] anim-fade">
          Admin
        </p>
        <div className="divider mt-5 anim-fade delay-1" />

        <h1 className="font-display text-[3.4rem] leading-[1.05] sm:text-[4rem] mt-8 anim-fade-up delay-1 text-[var(--color-foreground)]">
          Sign in
        </h1>

        <p className="mt-4 max-w-xs text-[var(--color-muted)] font-body anim-fade-up delay-2">
          Enter the admin password to view prayer requests.
        </p>

        <form action={action} className="w-full mt-8 anim-fade-up delay-2">
          <input
            name="password"
            type="password"
            required
            autoFocus
            placeholder="Admin password"
            className="calm w-full px-5 py-3.5 text-center placeholder:text-[var(--color-subtle)]"
          />
          <button
            type="submit"
            className="calm w-full mt-4"
            disabled={pending}
          >
            {pending ? "Checking…" : "Sign in"}
          </button>
        </form>

        {state.error ? (
          <p className="mt-4 text-sm text-red-700 anim-fade font-body">
            {state.error}
          </p>
        ) : null}
      </div>
    </main>
  );
}
