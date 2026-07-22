import Link from "next/link";

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

const paymentMethods = ["Visa", "Mastercard", "Amex", "Maestro", "Apple Pay", "Google Pay", "Shop Pay", "PayPal"];
const securityBadges = ["Secure SSL Checkout", "Verified Reviews", "Verified UK Store"];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
];

export function Footer() {
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
        <div className="page-container flex flex-col gap-3 py-5">
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/60">Payment Methods</span>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((p) => (
              <span key={p} className="rounded-input border border-border-subtle px-2.5 py-1 text-xs font-medium text-foreground-strong">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="page-container flex flex-col gap-3 py-5">
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/60">Security</span>
          <div className="flex flex-wrap gap-2">
            {securityBadges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 rounded-input border border-border-subtle px-2.5 py-1 text-xs font-medium text-foreground-strong"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="#121212" strokeWidth={1.4}>
                  <path d="M8 1.5l5.5 2v4c0 4-2.4 6.5-5.5 7.5-3.1-1-5.5-3.5-5.5-7.5v-4z" strokeLinejoin="round" />
                </svg>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="page-container py-5 text-xs text-foreground/60">
          © {new Date().getFullYear()} Toolvo Drills Ltd. All rights reserved. Registered in England & Wales — 1
          Example Street, London, EC1A 1AA, United Kingdom.
        </div>
      </div>
    </footer>
  );
}
