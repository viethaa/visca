"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ContactDialog from "../ContactDialog";
import { useRouter } from "next/router";

export default function HeaderBanner() {
  const [open, setOpen] = useState(false);

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/events", label: "Events" },
      { href: "/locations", label: "Locations" },
      { href: "/information", label: "Information" },
    ],
    []
  );

  const router = useRouter();
  const pathname = (router.asPath || "/").split("#")[0].split("?")[0] || "/";

  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const [slider, setSlider] = useState({ left: 0, width: 0 });

  // YOUR image – if the host blocks hotlinking, copy it to /public and set "/hoan-kiem.jpg"
  const heroSrc = "https://statics.vinpearl.com/thap-rua-ho-guom-5_1691857514.jpg";

  const activeHref = useMemo(() => {
    const exact = navLinks.find((l) => l.href === pathname)?.href;
    if (exact) return exact;
    const pref = [...navLinks]
      .filter((l) => pathname.startsWith(l.href) && l.href !== "/")
      .sort((a, b) => b.href.length - a.href.length)[0];
    return pref?.href ?? "/";
  }, [pathname, navLinks]);

  const recalcSlider = () => {
    const el = itemRefs.current[activeHref];
    const wrap = containerRef.current;
    if (!el || !wrap) return;
    const elRect = el.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    setSlider({ left: elRect.left - wrapRect.left, width: elRect.width });
  };

  useEffect(() => {
    recalcSlider();
    const t = setTimeout(recalcSlider, 0);
    return () => clearTimeout(t);
  }, [activeHref]);

  useEffect(() => {
    const onResize = () => recalcSlider();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="relative text-white">
      {/* NAVBAR — dark with some opacity, kept minimal */}
      <div className="fixed inset-x-0 top-0 z-[1000] border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="w-24" />

          <nav ref={containerRef} className="relative hidden items-center gap-8 md:flex">
            <span
              className="pointer-events-none absolute -bottom-2 h-[2px] rounded-full bg-white transition-all duration-300 ease-out"
              style={{ left: slider.left, width: slider.width }}
            />
            {navLinks.map((l) => {
              const isActive = l.href === activeHref;
              return (
                <Link key={l.href} href={l.href} className="px-2">
                  <span
                    ref={(el) => (itemRefs.current[l.href] = el)}
                    className={[
                      "text-sm font-medium tracking-wide transition-colors",
                      isActive ? "text-white font-semibold" : "text-white/80 hover:text-white",
                    ].join(" ")}
                  >
                    {l.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="w-24 flex justify-end">
            <ContactDialog asChild>
              <button
                className="relative inline-flex items-center justify-center rounded-full border border-white/20
                           bg-black/60 px-5 py-2 text-sm font-semibold text-white/90 shadow-md backdrop-blur
                           transition-all hover:border-white/40 hover:text-white"
              >
                <span className="relative z-10">Contact</span>
              </button>
            </ContactDialog>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="md:hidden rounded-xl border border-white/15 bg-black/60 px-3 py-2 hover:bg-black/70 transition"
          >
            <span className="sr-only">Open menu</span>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </div>
          </button>
        </div>

        {open && (
          <div id="mobile-nav" className="md:hidden border-t border-white/10 bg-black/85 backdrop-blur-md z-[1000]">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
              {navLinks.map((l) => {
                const isActive = l.href === activeHref;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-white" : "text-white/80 hover:text-white",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <ContactDialog asChild>
                <button
                  onClick={() => setOpen(false)}
                  className="relative mt-2 inline-flex items-center justify-center rounded-full border border-white/20
                             bg-black/60 px-5 py-2 text-sm font-semibold text-white/90 shadow-md backdrop-blur
                             transition-all hover:border-white/40 hover:text-white"
                >
                  <span className="relative z-10">Contact</span>
                </button>
              </ContactDialog>
            </div>
          </div>
        )}
      </div>

      {/* FULL-SCREEN HERO (no carousel) */}
      <section className="relative pt-16 overflow-hidden">
        {/* Cover entire first screen on modern mobile + desktop */}
        <div className="relative min-h-screen" style={{ height: "100svh" }}>
          {/* Use CSS background so remote hosts are less picky than <img> */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url('${heroSrc}')`,
              // Slight vertical bias to keep the tower framed nicely—tweak if needed:
              backgroundPosition: "center 45%",
            }}
          />
          {/* Contrast overlay (doesn't blur the image) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/48 to-black/65" />

          {/* CONTENT */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-center max-w-6xl px-6">
              <h1
                className="
    -mt-14  /* moves text further upward */
    text-4xl sm:text-5xl md:text-6xl lg:text-7xl
    font-extrabold tracking-tight
    bg-gradient-to-b from-white via-white to-white
    bg-clip-text text-transparent
    drop-shadow-[0_3px_14px_rgba(255,255,255,0.55)]
    [text-shadow:0_5px_28px_rgba(0,0,0,0.8)]
  "
              >
                Vietnam International School <br />
                Counselor Association
              </h1>

              <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/events"
                  className="rounded-lg border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/20 transition backdrop-blur-sm"
                >
                  Explore Events
                </Link>
                <Link
                  href="/information"
                  className="rounded-lg border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/20 transition backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
