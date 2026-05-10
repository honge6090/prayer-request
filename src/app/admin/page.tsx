import { redirect } from "next/navigation";
import { getAdminPasswordFromCookie, listPrayers } from "@/lib/admin";
import { logout } from "./login/actions";
import AdminTable from "./AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const pw = await getAdminPasswordFromCookie();
  if (!pw) redirect("/admin/login");

  let rows;
  try {
    rows = await listPrayers(pw);
  } catch {
    redirect("/admin/login");
  }

  return (
    <main className="flex flex-1 items-start justify-center px-6 py-10 sm:py-12">
      <div className="w-full max-w-3xl">
        <header className="flex items-end justify-between gap-4 anim-fade">
          <div>
            <p className="font-body text-[0.78rem] uppercase tracking-[0.32em] text-[var(--color-subtle)]">
              Admin
            </p>
            <h1 className="font-display text-[3.2rem] sm:text-[3.8rem] leading-[1.05] mt-2 text-[var(--color-foreground)]">
              Prayer requests
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)] font-body">
              {rows.length} {rows.length === 1 ? "entry" : "entries"}
            </p>
          </div>

          <form action={logout}>
            <button type="submit" className="calm-ghost text-sm">
              Sign out
            </button>
          </form>
        </header>

        <div className="divider mt-6 mx-0" />

        <AdminTable rows={rows} />
      </div>
    </main>
  );
}
