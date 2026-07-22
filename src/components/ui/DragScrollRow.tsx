"use client";

import { useRef, type ReactNode } from "react";

export function DragScrollRow({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ dragging: false, moved: false, startX: 0, startScroll: 0 });

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    state.current = { dragging: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !state.current.dragging) return;
    const delta = e.clientX - state.current.startX;
    if (Math.abs(delta) > 4) state.current.moved = true;
    el.scrollLeft = state.current.startScroll - delta;
  }

  function endDrag() {
    state.current.dragging = false;
  }

  function onClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  }

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
      className={`scrollbar-hidden flex cursor-grab snap-x overflow-x-auto active:cursor-grabbing ${className}`}
    >
      {children}
    </div>
  );
}
