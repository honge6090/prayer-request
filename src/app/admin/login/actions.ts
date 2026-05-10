"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyPassword } from "@/lib/admin";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const pw = String(formData.get("password") ?? "");
  const ok = await verifyPassword(pw);
  if (!ok) {
    return { error: "Incorrect password." };
  }
  const c = await cookies();
  c.set(ADMIN_COOKIE, pw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
