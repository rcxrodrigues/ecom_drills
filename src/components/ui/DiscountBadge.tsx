export function DiscountBadge({ percentage, className = "" }: { percentage: number; className?: string }) {
  if (percentage <= 0) return null;
  return (
    <span
      className={`inline-flex items-center rounded-button bg-brand-black px-2 py-1 text-xs font-semibold text-white ${className}`}
    >
      -{percentage}% OFF
    </span>
  );
}
