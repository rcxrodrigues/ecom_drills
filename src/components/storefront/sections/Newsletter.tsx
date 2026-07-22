"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export type NewsletterConfig = { heading?: string; subheading?: string };

export function Newsletter({ config }: { config: NewsletterConfig }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="border-t border-border-subtle bg-brand-black py-12 text-white lg:py-16">
      <div className="page-container flex flex-col items-center gap-4 text-center">
        <h2 className="text-xl font-semibold sm:text-2xl">{config.heading ?? "Sign up for offers"}</h2>
        {config.subheading && <p className="max-w-md text-sm text-white/70">{config.subheading}</p>}
        {submitted ? (
          <p className="text-sm font-medium">Thanks — keep an eye on your inbox.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
          >
            <input
              required
              type="email"
              placeholder="Your email address"
              className="h-11 flex-1 rounded-input border border-white/30 bg-transparent px-3.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white"
            />
            <Button type="submit" variant="secondary" className="border-white bg-white text-brand-black hover:bg-neutral-100">
              Sign up
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
