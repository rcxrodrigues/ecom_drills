import { type ComponentProps, forwardRef } from "react";

const base =
  "h-11 w-full rounded-input border border-border-subtle bg-white px-3.5 text-sm text-foreground-strong placeholder:text-foreground/50 focus:outline-none focus:border-brand-black transition-colors";

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={`${base} ${className}`} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea">>(
  ({ className = "", ...props }, ref) => (
    <textarea ref={ref} className={`${base} h-auto min-h-24 py-2.5 ${className}`} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, ComponentProps<"select">>(
  ({ className = "", ...props }, ref) => (
    <select ref={ref} className={`${base} ${className}`} {...props} />
  )
);
Select.displayName = "Select";

export function Label({ className = "", ...props }: ComponentProps<"label">) {
  return (
    <label
      className={`mb-1.5 block text-xs font-medium uppercase tracking-wide text-foreground-strong ${className}`}
      {...props}
    />
  );
}
