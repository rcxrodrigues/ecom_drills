"use client";

import { useState, type ReactNode } from "react";

export function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border-subtle border-y border-border-subtle">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-foreground-strong"
              aria-expanded={open}
            >
              {item.title}
              <span className={`shrink-0 transition-transform ${open ? "rotate-45" : ""}`}>
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="#121212" strokeWidth={1.4}>
                  <path d="M6 0v12M0 6h12" />
                </svg>
              </span>
            </button>
            {open && <div className="pb-4 text-sm leading-relaxed text-foreground">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
