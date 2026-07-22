import { type ComponentProps } from "react";
import Link from "next/link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-button font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none";

const variants = {
  primary: "bg-brand-black text-white hover:bg-black",
  secondary: "bg-white text-brand-black border border-brand-black hover:bg-neutral-100",
  ghost: "bg-transparent text-brand-black hover:bg-neutral-100",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
};

type ButtonOwnProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonOwnProps & ComponentProps<"button">) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...props
}: ButtonOwnProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
