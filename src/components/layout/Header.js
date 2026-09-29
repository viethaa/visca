"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ContactDialog from "../ContactDialog";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

/* VISCA mark: an outlined tile holding a "V", with the lime signal dot on its corner */
export function LogoMark({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect
        x="1"
        y="3"
        width="26"
        height="26"
        rx="7"
        fill="none"
        strokeWidth="1.5"
        className="stroke-ink"
      />
      <path
        d="M8.5 11 L14 22 L19.5 11"
        fill="none"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-ink"
      />
      <circle cx="27" cy="5" r="4" className="fill-signal" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="VISCA home">
      <LogoMark />
      <span className="text-[1.375rem] leading-none tracking-[-0.03em]">
        visca
      </span>
    </Link>
  );
}

// Floating glass pill at the top of every page
// overlay: float over a full-bleed banner instead of taking up space
// back: { href, label } adds a small round back button before the logo
export default function Header({ overlay = false, back = null }) {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const isActive = (href) => {
    if (href === "/#schools") return pathname.startsWith("/schools");
    return pathname === href;
  };

  // Small pill on the right: links with a sliding marker, then contact
  const pill = (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full border p-1 text-white backdrop-blur-md transition-colors duration-500",
        "border-white/15 bg-black/20",
      )}
    >
      <nav aria-label="Main" className="hidden items-center md:flex">
        {NAV_LINKS.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-[14px] transition-colors",
                active ? "text-abyss" : "text-white/75 hover:text-white",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-full bg-white"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 32,
                  }}
                />
              )}
              {l.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="rounded-full px-3.5 py-1.5 text-[14px] text-white/85 md:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>
      <span className="mx-1 h-4 w-px bg-white/20" aria-hidden="true" />
      <ContactDialog>
        <button className="rounded-full px-3.5 py-1.5 text-[14px] text-white/75 transition-colors hover:text-white">
          Contact
        </button>
      </ContactDialog>
    </div>
  );

  const mobileNav = (
    <AnimatePresence>
      {open && (
        <motion.nav
          id="mobile-nav"
          aria-label="Mobile"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="wrap md:hidden"
        >
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0e1d1b]/90 px-5 py-1 text-white backdrop-blur-xl">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-white/10 py-4 text-2xl tracking-[-0.02em] last:border-0"
              >
                {l.label}
                {isActive(l.href) && (
                  <span
                    className="h-2 w-2 rounded-full bg-signal"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <a
        href="#main"
        className="t-mono sr-only z-[1001] rounded-lg bg-signal px-4 py-2 text-abyss focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        className={cn(
          overlay ? "absolute inset-x-0 top-0 z-20" : "relative z-20",
        )}
      >
        <div className="wrap flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            {back && (
              <Link
                href={back.href}
                aria-label={back.label}
                title={back.label}
                className={cn(
                  "group grid h-10 w-10 place-items-center rounded-full border text-white backdrop-blur-md transition-colors duration-500",
                  "border-white/15 bg-black/20 hover:border-white hover:bg-white hover:text-abyss",
                )}
              >
                <ArrowLeft
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                  strokeWidth={1.75}
                />
              </Link>
            )}
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2.5 text-white",
                back && "ml-2",
              )}
              aria-label="VISCA home"
            >
              <LogoMark className="h-7 w-7" />
              <span className="text-[1.2rem] leading-none tracking-[-0.03em]">
                visca
              </span>
            </Link>
          </div>

          {pill}
        </div>
        {mobileNav}
      </header>
    </>
  );
}
