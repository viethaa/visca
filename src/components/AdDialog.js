"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FAIR } from "@/lib/site";

// The fair poster. Opens only when someone asks for it.
export default function AdDialog({ children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[92dvh] w-[calc(100%-2rem)] max-w-[480px] overflow-y-auto rounded-2xl border-0 bg-transparent p-0 shadow-none sm:rounded-2xl [&>button]:right-3 [&>button]:top-3 [&>button]:grid [&>button]:h-9 [&>button]:w-9 [&>button]:place-items-center [&>button]:rounded-full [&>button]:bg-surface [&>button]:opacity-100">
        <DialogTitle className="sr-only">{FAIR.name} poster</DialogTitle>
        <img src={FAIR.poster} alt={`${FAIR.name} poster`} className="block w-full rounded-2xl" />
      </DialogContent>
    </Dialog>
  );
}
