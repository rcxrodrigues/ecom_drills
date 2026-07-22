"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

type NavCollection = { handle: string; name: string };

export function Header({ collections }: { collections: NavCollection[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const cart = useCart();
  const router = useRouter();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-white">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-input hover:bg-neutral-100 lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#121212" strokeWidth={1.6}>
              <path d="M2 5h16M2 10h16M2 15h16" strokeLinecap="round" />
            </svg>
          </button>
          <nav className="hidden gap-6 lg:flex">
            {collections.slice(0, 6).map((c) => (
              <Link
                key={c.handle}
                href={`/collections/${c.handle}`}
                className="text-sm font-medium text-foreground-strong hover:text-foreground"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="text-xl font-bold tracking-tight text-foreground-strong">
          TOOLVO DRILLS
        </Link>

        <div className="flex flex-1 items-center justify-end gap-1">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-input hover:bg-neutral-100"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#121212" strokeWidth={1.6}>
              <circle cx="9" cy="9" r="6.5" />
              <path d="M17.5 17.5L14 14" strokeLinecap="round" />
            </svg>
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden h-10 w-10 items-center justify-center rounded-input hover:bg-neutral-100 sm:flex"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#121212" strokeWidth={1.6}>
              <circle cx="10" cy="6.5" r="3.5" />
              <path d="M2.5 17.5c1.2-4 5-5.5 7.5-5.5s6.3 1.5 7.5 5.5" strokeLinecap="round" />
            </svg>
          </Link>
          <button
            type="button"
            aria-label="Basket"
            onClick={cart.open}
            className="relative flex h-10 w-10 items-center justify-center rounded-input hover:bg-neutral-100"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#121212" strokeWidth={1.6}>
              <path d="M5 7h10l-1 10H6L5 7Z" strokeLinejoin="round" />
              <path d="M7.5 7V5.5a2.5 2.5 0 0 1 5 0V7" strokeLinecap="round" />
            </svg>
            {cart.count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-black text-[10px] font-semibold text-white">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border-subtle bg-white">
          <form onSubmit={submitSearch} className="page-container flex items-center gap-2 py-3">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for drills, batteries, accessories…"
              className="h-11 w-full rounded-input border border-border-subtle px-3.5 text-sm focus:outline-none focus:border-brand-black"
            />
            <button type="submit" className="h-11 shrink-0 rounded-button bg-brand-black px-4 text-sm font-medium text-white">
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80vw] animate-slide-in bg-white p-5 [animation-direction:reverse]">
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="mb-6 flex h-10 w-10 items-center justify-center rounded-input hover:bg-neutral-100"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#121212" strokeWidth={1.6}>
                <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
              </svg>
            </button>
            <nav className="flex flex-col gap-1">
              {collections.map((c) => (
                <Link
                  key={c.handle}
                  href={`/collections/${c.handle}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-input px-2 py-2.5 text-sm font-medium text-foreground-strong hover:bg-neutral-100"
                >
                  {c.name}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-input border-t border-border-subtle px-2 pt-4 text-sm font-medium text-foreground-strong hover:bg-neutral-100"
              >
                My account
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
