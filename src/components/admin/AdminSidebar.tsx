"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/app/actions/admin-auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/sections", label: "Homepage Sections" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/discounts", label: "Discount Codes" },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border-subtle bg-white">
      <div className="px-5 py-5">
        <span className="text-sm font-bold tracking-tight text-foreground-strong">TOOLVO DRILLS</span>
        <p className="mt-0.5 text-xs text-foreground/60">Admin panel</p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {links.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-input px-3 py-2 text-sm font-medium ${
                active ? "bg-brand-black text-white" : "text-foreground-strong hover:bg-neutral-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border-subtle p-4">
        <p className="mb-2 truncate text-xs text-foreground/70">{adminName}</p>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await logoutAdmin();
              router.push("/admin/login");
              router.refresh();
            })
          }
          className="text-xs font-medium text-foreground-strong underline"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
