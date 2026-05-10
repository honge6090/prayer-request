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
    width: 480,
    color: {
      dark: "#2d2a26",
      light: "#00000000",
    },
    errorCorrectionLevel: "M",
  });

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-8 lg:px-12 lg:py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
        <section className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <p className="font-body text-[0.78rem] uppercase tracking-[0.32em] text-[var(--color-subtle)] anim-fade">
            Prayer Wall
          </p>
          <div className="mt-5 h-px w-14 bg-[var(--color-line)] anim-fade delay-1" />

          <h1 className="font-display text-[4.4rem] leading-[1.02] sm:text-[5.6rem] lg:text-[6.6rem] mt-7 anim-fade-up delay-1 text-[var(--color-foreground)]">
            {copy.qr.heading}
          </h1>

          <div className="mt-8 max-w-xl space-y-4 anim-fade-up delay-2">
            <p className="text-lg lg:text-xl text-[var(--color-foreground)] italic font-body leading-relaxed">
              {copy.qr.intro}
            </p>
            <p className="text-base lg:text-lg text-[var(--color-muted)] font-body leading-relaxed">
              {copy.qr.body}
            </p>
          </div>

          <div className="mt-8 h-px w-14 bg-[var(--color-line)] anim-fade delay-3" />

          <figure className="mt-6 max-w-xl space-y-3 anim-fade delay-3">
            <blockquote className="font-body italic text-[var(--color-foreground)] leading-relaxed text-base lg:text-lg">
              {copy.qr.verse}
            </blockquote>
            <figcaption className="font-body text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-subtle)]">
              {copy.qr.verseRef}
            </figcaption>
          </figure>
        </section>

        <aside className="flex flex-col items-center anim-fade-up delay-2">
          <div
            className="rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 lg:p-8 w-full max-w-[520px]"
            aria-label="QR code that opens the prayer request site"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="mt-5 font-body text-[0.78rem] uppercase tracking-[0.28em] text-[var(--color-subtle)] text-center">
            {copy.qr.scan}
          </p>
          <p className="mt-2 font-body text-sm text-[var(--color-muted)] break-all text-center">
            {target}
          </p>
        </aside>
      </div>
    </main>
  );
}
