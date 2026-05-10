import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: { name?: string; request?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (payload.name ?? "").trim();
  const request = (payload.request ?? "").trim();

  if (name.length < 1 || name.length > 200) {
    return NextResponse.json(
      { error: "Please share a name (under 200 characters)." },
      { status: 400 }
    );
  }

  if (request.length < 1 || request.length > 5000) {
    return NextResponse.json(
      { error: "Please share a prayer request (under 5000 characters)." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("prayer_requests")
    .insert({ name, request });

  if (error) {
    return NextResponse.json(
      { error: "Could not save prayer request. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
