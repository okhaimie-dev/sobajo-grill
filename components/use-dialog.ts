"use client";

import { useEffect, useRef } from "react";

/**
 * Drives a native <dialog> from React state: showModal() gives focus
 * trapping, Escape-to-close and top-layer stacking for free. Escape and
 * backdrop clicks are reported through onClose so state stays the source of truth.
 */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    // A click whose target is the <dialog> itself landed on the backdrop.
    const onClick = (e: MouseEvent) => {
      if (e.target === el) onClose();
    };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("click", onClick);
    };
  }, [onClose]);

  return ref;
}
