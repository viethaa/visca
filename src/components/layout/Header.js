"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ContactDialog from "../ContactDialog";
import { useRouter } from "next/router";

export default function HeaderBanner() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/locations", label: "Locations" },
    { href: "/information", label: "Information" },
  ];

  const router = useRouter();
  const pathname = (router.asPath || "/").split("#")[0].split("?")[0] || "/";

  // slider refs/state
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const [slider, setSlider] = useState({ left: 0, width: 0 });

  // active link
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
      {/* NAVBAR */}
      <div className="fixed inset-x-0 top-0 z-[1000] border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* left spacer */}
          <div className="w-24" />

          {/* centered nav with slider */}
          <nav
            ref={containerRef}
            className="relative hidden items-center gap-8 md:flex"
          >
            {/* slider bar */}
            <span
              className="pointer-events-none absolute -bottom-2 h-[2px] rounded-full bg-white transition-all duration-300 ease-out"
              style={{ left: slider.left, width: slider.width }}
            />
            {navLinks.map((l) => {
              const isActive = l.href === activeHref;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "px-2 text-sm font-medium tracking-wide transition-colors",
                    isActive
                      ? "text-white font-semibold"
                      : "text-white/80 hover:text-white",
                  ].join(" ")}
                  ref={(el) => (itemRefs.current[l.href] = el)}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* right side: Contact button */}
          <div className="w-24 flex justify-end">
            <ContactDialog asChild>
              <button
                className="relative inline-flex items-center justify-center rounded-full border border-white/20
                           bg-black/40 px-5 py-2 text-sm font-semibold text-white/90
                           shadow-md backdrop-blur transition-all
                           before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-sky-500 before:to-purple-500 before:opacity-0
                           before:transition-opacity before:duration-300 hover:before:opacity-100
                           hover:border-transparent hover:text-white hover:shadow-sky-500/30 active:scale-[0.97]"
              >
                <span className="relative z-10">Contact</span>
              </button>
            </ContactDialog>
          </div>

          {/* mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="md:hidden rounded-xl border border-white/15 bg-white/10 px-3 py-2 hover:bg-white/20 transition"
          >
            <span className="sr-only">Open menu</span>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </div>
          </button>
        </div>

        {/* mobile menu */}
        {open && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur z-[1000]"
          >
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
                      isActive
                        ? "text-white"
                        : "text-white/80 hover:text-white",
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
                             bg-black/40 px-5 py-2 text-sm font-semibold text-white/90 shadow-md backdrop-blur transition-all
                             before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-sky-500 before:to-purple-500 before:opacity-0
                             before:transition-opacity before:duration-300 hover:before:opacity-100
                             hover:border-transparent hover:text-white hover:shadow-sky-500/30 active:scale-[0.97]"
                >
                  <span className="relative z-10">Contact</span>
                </button>
              </ContactDialog>
            </div>
          </div>
        )}
      </div>

      {/* BANNER (unchanged) */}
      <section
        className="relative pt-24 md:pt-28 bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://media.istockphoto.com/id/478073811/photo/beautiful-entrance-at-the-temple-of-literature-hanoi.jpg?s=612x612&w=0&k=20&c=yfkyJse95xkxEL2DOY9srgmZdpOxPTOc-6NQHiLj-_w=)",
          backgroundColor: "#0b0b0f",
        }}
      >
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="relative mx-auto flex min-h-[68vh] items-center justify-center px-4 py-24 text-center md:px-6 lg:py-28">
          <div className="max-w-4xl">
            <h1 className="leading-tight font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl">
              <span className="block">Vietnam International School</span>
              <span className="block">Counselor Association</span>
            </h1>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/events"
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition"
              >
                Explore Events
              </Link>
              <Link
                href="/information"
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
