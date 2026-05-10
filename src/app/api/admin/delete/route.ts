import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const c = await cookies();
  const pw = c.get(ADMIN_COOKIE)?.value;
  if (!pw) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = body.id;
  if (typeof id !== "string" || id.length === 0) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("admin_delete_prayer", {
    pw,
    target_id: id,
  });

  if (error) {
    return NextResponse.json({ error: "Could not delete." }, { status: 403 });
  }

  return NextResponse.json({ ok: true, deleted: data ?? 0 });
}
