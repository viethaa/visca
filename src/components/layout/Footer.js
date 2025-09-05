"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ContactDialog from "../ContactDialog";
import { usePathname } from "next/navigation";

// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="mt-24 bg-black">
      {/* centered divider that fades out */}
      <div className="flex justify-center">
        <div className="h-[1.5px] w-3/4 bg-gradient-to-r from-transparent via-zinc-200/90 to-transparent" />
      </div>
      <p className="py-4 text-center text-md text-zinc-400">
        © 2025 VISCA. All rights reserved.
      </p>
    </footer>
  )
}
