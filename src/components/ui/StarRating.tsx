function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill={filled ? "#121212" : "none"} stroke="#121212" strokeWidth={filled ? 0 : 1.2}>
      <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
    </svg>
  );
}

export function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const rounded = Math.round(rating);
  return (
    <div className={`flex items-center gap-1.5 ${size === "md" ? "scale-110 origin-left" : ""}`}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= rounded} />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-foreground">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
