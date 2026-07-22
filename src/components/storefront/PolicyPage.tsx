import type { ReactNode } from "react";

export function PolicyPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="page-container max-w-3xl py-12">
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">{title}</h1>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

export function PolicyHeading({ children }: { children: ReactNode }) {
  return <h2 className="mt-2 text-base font-semibold text-foreground-strong">{children}</h2>;
}

export function PolicyList({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-5">{children}</ul>;
}
