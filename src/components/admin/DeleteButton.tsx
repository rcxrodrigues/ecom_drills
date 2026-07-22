"use client";

import { useState, useTransition } from "react";

export function DeleteButton({
  onDelete,
  label = "Delete",
  confirmMessage = "Are you sure? This can't be undone.",
}: {
  onDelete: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-xs">
        {confirmMessage}
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(onDelete)}
          className="font-semibold text-red-600 underline"
        >
          Yes, delete
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-foreground-strong underline">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button type="button" onClick={() => setConfirming(true)} className="text-xs font-medium text-red-600 underline">
      {label}
    </button>
  );
}
