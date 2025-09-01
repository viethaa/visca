"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function AdDialog({ open, onOpenChange }) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Use controlled state if props are provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Allow other components to open this dialog on demand via custom event
  React.useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("ad-dialog:open", handler);
    return () => window.removeEventListener("ad-dialog:open", handler);
  }, [setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="
          w-full sm:max-w-[500px] p-0
          overflow-hidden rounded-2xl
          border-[4px] border-gray-900/90
          shadow-[0_20px_60px_rgba(0,0,0,0.9)]
          [&>button]:bg-black [&>button]:text-gray-200
          [&>button]:hover:bg-gray-950 [&>button]:hover:text-white
          [&>button]:flex [&>button]:items-center [&>button]:justify-center
          [&>button]:w-10 [&>button]:h-10 [&>button]:rounded-xl
        "
      >
        <img
          src="/fair2025.png"
          alt="Hanoi Fair 2025"
          className="block w-full h-full object-cover"
        />
      </DialogContent>
    </Dialog>
  );
}
