import { cookies } from "next/headers";
import { supabase, type PrayerRequest } from "./supabase";

export const ADMIN_COOKIE = "admin_pw";

export async function getAdminPasswordFromCookie(): Promise<string | null> {
  const c = await cookies();
  const pw = c.get(ADMIN_COOKIE)?.value;
  return pw && pw.length > 0 ? pw : null;
}

export async function verifyPassword(pw: string): Promise<boolean> {
  if (!pw) return false;
  const { error } = await supabase.rpc("admin_list_prayers", { pw });
  return !error;
}

export async function listPrayers(pw: string): Promise<PrayerRequest[]> {
  const { data, error } = await supabase.rpc("admin_list_prayers", { pw });
  if (error) throw new Error("unauthorized");
  return (data ?? []) as PrayerRequest[];
}
