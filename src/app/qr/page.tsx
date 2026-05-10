import QRCode from "qrcode";
import { headers } from "next/headers";
import { copy } from "@/lib/copy";

export const dynamic = "force-dynamic";

async function resolveSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv && fromEnv.length > 0) return fromEnv.replace(/\/$/, "");
  const h = await headers();
  const host =
    h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function QrPage() {
  const site = await resolveSiteUrl();
  const target = `${site}/`;
  const qrSvg = await QRCode.toString(target, {
    type: "svg",
    margin: 1,
    width: 360,
    color: {
      dark: "#2d2a26",
      light: "#00000000",
    },
    errorCorrectionLevel: "M",
  });

  return (
    <main className="flex flex-1 items-start justify-center px-6 py-10 sm:py-16">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <p className="font-body text-[0.78rem] uppercase tracking-[0.32em] text-[var(--color-subtle)] anim-fade">
          Prayer Wall
        </p>
        <div className="divider mt-5 anim-fade delay-1" />

        <h1 className="font-display text-[3.6rem] leading-[1.05] sm:text-[4.4rem] mt-8 anim-fade-up delay-1 text-[var(--color-foreground)]">
          {copy.qr.heading}
        </h1>

        <div
          className="mt-10 rounded-[6px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 anim-fade-up delay-2"
          aria-label="QR code that opens the prayer request site"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />

        <p className="mt-5 font-body text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-subtle)] anim-fade-up delay-2">
          {copy.qr.scan}
        </p>
        <p className="mt-2 font-body text-sm text-[var(--color-muted)] break-all anim-fade-up delay-2">
          {target}
        </p>

        <div className="mt-12 max-w-sm space-y-4 anim-fade-up delay-3">
          <p className="text-[var(--color-foreground)] italic font-body">
            {copy.qr.intro}
          </p>
          <p className="text-[var(--color-muted)] font-body">{copy.qr.body}</p>
        </div>

        <div className="divider mt-12 anim-fade delay-4" />

        <figure className="mt-8 max-w-sm space-y-3 anim-fade delay-4">
          <blockquote className="font-body italic text-[var(--color-foreground)] leading-relaxed">
            {copy.qr.verse}
          </blockquote>
          <figcaption className="font-body text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-subtle)]">
            {copy.qr.verseRef}
          </figcaption>
        </figure>
      </div>
    </main>
  );
}
