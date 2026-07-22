import Link from "next/link";
import { PaymentIcons } from "./PaymentIcons";
import { SecurityBadges } from "./SecurityBadges";
import { getSiteReviewSummary } from "@/lib/queries";

const menuLinks = [
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/collections/impact-drills", label: "Impact Drills" },
  { href: "/collections/hammer-drills", label: "Hammer Drills" },
  { href: "/collections/accessories", label: "Accessories" },
  { href: "/account/orders/track", label: "Track Your Order" },
];

const policyLinks = [
  { href: "/policies/returns", label: "Returns & Refund Policy" },
  { href: "/policies/privacy", label: "Privacy Policy" },
  { href: "/policies/terms", label: "Terms of Service" },
  { href: "/policies/shipping", label: "Shipping Policy" },
  { href: "/policies/contact", label: "Contact" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
];

export async function Footer() {
  const { avgRating, count } = await getSiteReviewSummary();
  return (
    <footer className="border-t border-border-subtle bg-white text-foreground">
      <div className="page-container grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground-strong">Menu</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {menuLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground-strong">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground-strong">Policies</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground-strong">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-foreground-strong">Contact Us</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>Monday–Friday, 9am–5.30pm (UK time)</li>
            <li>
              <a href="mailto:support@toolvodrills.co.uk" className="hover:text-foreground-strong">
                support@toolvodrills.co.uk
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-xs font-medium hover:bg-neutral-100"
              >
                {s.label[0]}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="page-container flex flex-col items-center gap-8 py-6 sm:flex-row sm:justify-center sm:gap-16">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-foreground/60">Payment Methods</span>
            <PaymentIcons />
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-foreground/60">Security</span>
            <SecurityBadges rating={avgRating} count={count} />
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="page-container py-5 text-center text-xs text-foreground/60">
          © {new Date().getFullYear()} Toolvo Drills Ltd. All rights reserved. Registered in England & Wales — 1
          Example Street, London, EC1A 1AA, United Kingdom.
        </div>
      </div>
    </footer>
  );
}
