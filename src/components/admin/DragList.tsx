"use client";

import { useState, type ReactNode } from "react";

export function DragList<T>({
  items,
  getKey,
  onReorder,
  renderItem,
}: {
  items: T[];
  getKey: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function handleDrop() {
    if (dragIndex === null || overIndex === null || dragIndex === overIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(overIndex, 0, moved);
    onReorder(next);
    setDragIndex(null);
    setOverIndex(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div
          key={getKey(item)}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(index);
          }}
          onDrop={handleDrop}
          onDragEnd={() => {
            setDragIndex(null);
            setOverIndex(null);
          }}
          className={`flex cursor-grab items-center gap-3 rounded-input border bg-white transition-colors ${
            overIndex === index && dragIndex !== null ? "border-brand-black" : "border-border-subtle"
          } ${dragIndex === index ? "opacity-50" : ""}`}
        >
          <span className="pl-3 text-foreground/40" aria-hidden>
            <svg viewBox="0 0 12 20" className="h-4 w-4" fill="currentColor">
              <circle cx="3" cy="3" r="1.4" />
              <circle cx="9" cy="3" r="1.4" />
              <circle cx="3" cy="10" r="1.4" />
              <circle cx="9" cy="10" r="1.4" />
              <circle cx="3" cy="17" r="1.4" />
              <circle cx="9" cy="17" r="1.4" />
            </svg>
          </span>
          <div className="flex-1 py-2 pr-3">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
}
