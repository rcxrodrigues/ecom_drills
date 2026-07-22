"use client";

import { cloneElement, isValidElement, useEffect, useRef, type ReactElement, type ReactNode } from "react";

export function AutoScrollRow({
  children,
  className = "",
  speed = 0.4,
}: {
  children: ReactElement[];
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ dragging: false, moved: false, startX: 0, startScroll: 0, paused: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame: number;

    function tick() {
      if (!el) return;
      if (!state.current.paused && !state.current.dragging) {
        el.scrollLeft += speed;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    state.current.dragging = true;
    state.current.moved = false;
    state.current.startX = e.clientX;
    state.current.startScroll = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !state.current.dragging) return;
    const delta = e.clientX - state.current.startX;
    if (Math.abs(delta) > 4) state.current.moved = true;
    let next = state.current.startScroll - delta;
    const half = el.scrollWidth / 2;
    if (half > 0) {
      if (next < 0) next += half;
      if (next >= half) next -= half;
    }
    el.scrollLeft = next;
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

  const duplicated: ReactNode[] = children
    .filter(isValidElement)
    .map((child) => cloneElement(child, { key: `dup-${child.key}` }));

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={() => {
        endDrag();
        state.current.paused = false;
      }}
      onPointerEnter={() => {
        state.current.paused = true;
      }}
      onClickCapture={onClickCapture}
      className={`scrollbar-hidden flex cursor-grab overflow-x-auto active:cursor-grabbing ${className}`}
    >
      {children}
      {duplicated}
    </div>
  );
}
