"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ContactDialog from "../ContactDialog";
import { usePathname } from "next/navigation";

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

  const pathname = (usePathname() || "/").split("#")[0].split("?")[0] || "/";
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const [slider, setSlider] = useState({ left: 0, width: 0 });

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
    <>
      <style jsx global>{`
        /* Page reveal */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        /* Calm progress for At a glance */
        @keyframes gentlePulse {
          0% { width: 55%; }
          50% { width: 75%; }
          100% { width: 55%; }
        }
        /* Smooth hover helpers */
        .card-hover { transition: transform 300ms ease, box-shadow 300ms ease, background-color 300ms ease, border-color 300ms ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.42); }
        .btn-hover { transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, border-color 180ms ease, color 180ms ease; }
        .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(0,0,0,0.35); }
      `}</style>

      <div className="relative text-white">
        {/* NAVBAR (logo left, contact right, centered nav) */}
        <div className="fixed inset-x-0 top-0 z-[1000] border-b border-white/10 bg-black/70 backdrop-blur-md">
          <div className="relative flex h-16 items-center px-4 md:px-6">
            {/* VISCA far-left */}
            <div className="flex-none">
              <div className="rounded-md bg-neutral-900/95 px-3 py-2 border border-white/10 shadow-sm">
                <span className="text-white font-bold tracking-widest text-xs">VISCA</span>
              </div>
            </div>

            {/* Centered nav */}
            <nav
              ref={containerRef}
              className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8"
            >
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

            {/* Mobile menu */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="md:hidden rounded-xl border border-white/15 bg-black/80 px-3 py-2 hover:bg-black/85 transition ml-3"
            >
              <span className="sr-only">Open menu</span>
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
              </div>
            </button>

            {/* Contact far-right */}
            <div className="flex-none ml-auto">
              <ContactDialog asChild>
                <button
                  className="btn-hover inline-flex items-center justify-center rounded-full border border-white/15 bg-black/60 px-5 py-2 text-sm font-medium text-white/90 shadow-md backdrop-blur hover:border-white/35 hover:text-white"
                >
                  Contact
                </button>
              </ContactDialog>
            </div>
          </div>

          {open && (
            <div id="mobile-nav" className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-md z-[1000]">
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
                        isActive ? "text-white" : "text-white/85 hover:text-white",
                      ].join(" ")}
                    >
                      {l.label}
                    </Link>
                  );
                })}
                <ContactDialog asChild>
                  <button
                    onClick={() => setOpen(false)}
                    className="btn-hover mt-2 inline-flex items-center justify-center rounded-full border border-white/15 bg-black/70 px-5 py-2 text-sm font-medium text-white/90 shadow-md backdrop-blur hover:border-white/35 hover:text-white"
                  >
                    Contact
                  </button>
                </ContactDialog>
              </div>
            </div>
          )}
        </div>

        {/* HERO */}
        <section className="relative pt-16 min-h-screen overflow-hidden">
          {/* Background image (restored) */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url('https://statics.vinpearl.com/thap-rua-ho-guom-5_1691857514.jpg')",
              backgroundPosition: "center 80%",
            }}
          />
          {/* Readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/60" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* LEFT — minimal, clean */}
              <div className="space-y-6 max-w-xl" style={{ animation: "fadeInUp .7s ease-out" }}>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
                    Vietnam International{" "}
                  </span>
                  <span className="bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text text-transparent">
                    <span className="whitespace-nowrap">School&nbsp;Counselor</span>{" "}
                  </span>
                  <span className="bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
                    Association
                  </span>
                </h1>

                <p className="text-base md:text-lg text-white/90 leading-relaxed">
                  Connecting counselors across Vietnam to share resources, run impactful
                  events, and support every student with consistent, high-quality guidance.
                </p>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/events"
                    className="btn-hover rounded-lg border border-white/30 bg-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-md shadow-lg"
                  >
                    Explore Events
                  </Link>
                  <Link
                    href="/information"
                    className="btn-hover rounded-lg border border-white/30 bg-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-md shadow-lg"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* RIGHT — compact, balanced; At a glance is HALF width */}
              <div className="grid grid-cols-2 gap-4 lg:gap-5" style={{ animation: "scaleIn .6s ease-out .05s both" }}>
                {/* Featured Event (full width) */}
                <div className="col-span-2 rounded-xl border border-white/25 bg-white/20 backdrop-blur-xl shadow-2xl p-5 relative overflow-hidden card-hover">
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">Featured</div>
                      <h3 className="mt-1 text-lg font-semibold tracking-tight">Counselor Summit 2025</h3>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] border border-white/10">
                        <span>Sep</span>
                        <span className="font-bold">20</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white/90">
                    Workshops, networking, and best-practice sharing nationwide.
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Link href="/events" className="btn-hover rounded-md border border-white/25 bg-white/20 px-3 py-1.5 text-xs font-medium hover:bg-white/30">
                      View details
                    </Link>
                    <Link href="/locations" className="btn-hover rounded-md border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-medium hover:bg-black/60">
                      Directions
                    </Link>
                  </div>
                </div>

                {/* Row 2: Quick Links (left) + At a glance (right, HALF) */}
                <div className="rounded-xl border border-white/25 bg-white/20 backdrop-blur-xl shadow-xl p-4 flex flex-col gap-2 card-hover">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/70 mb-1">Quick Links</div>
                  <Link href="/information" className="btn-hover rounded-md bg-black/45 border border-white/10 px-3 py-2 text-xs hover:bg-black/60">
                    Guides
                  </Link>
                  <Link href="/events" className="btn-hover rounded-md bg-black/45 border border-white/10 px-3 py-2 text-xs hover:bg-black/60">
                    Workshops
                  </Link>
                  <Link href="/locations" className="btn-hover rounded-md bg-black/45 border border-white/10 px-3 py-2 text-xs hover:bg-black/60">
                    Schools
                  </Link>
                </div>

                <div className="rounded-xl border border-white/25 bg-white/20 backdrop-blur-xl shadow-xl p-4 card-hover">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">At a glance</div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-base font-bold">50+</div>
                      <div className="text-[10px] uppercase tracking-wide text-white/70">Schools</div>
                    </div>
                    <div>
                      <div className="text-base font-bold">200+</div>
                      <div className="text-[10px] uppercase tracking-wide text-white/70">Counselors</div>
                    </div>
                    <div>
                      <div className="text-base font-bold">100+</div>
                      <div className="text-[10px] uppercase tracking-wide text-white/70">Events</div>
                    </div>
                  </div>
                  {/* Calm breathing bar */}
                  <div className="mt-3 h-1 w-full bg-white/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/70 rounded-full"
                      style={{ animation: "gentlePulse 8s ease-in-out infinite" }}
                    />
                  </div>
                </div>

                {/* Row 3: Counselor Network full width (as requested swap outcome) */}
                <div className="col-span-2 rounded-xl overflow-hidden border border-white/25 shadow-xl relative group card-hover">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://media.licdn.com/dms/image/v2/D5610AQEOeXbumiQLFg/image-shrink_800/B56ZYVETrvGsAc-/0/1744110173638?e=2147483647&v=beta&t=3lXvLQe8NzI7gg4AlezzSIcL2luLaHKLqydm3kWMe-s')",
                    }}
                  />
                  <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/30" />
                  <div className="relative p-3">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-white/85">Community</div>
                    <div className="text-sm font-semibold tracking-tight">Counselor Network</div>
                  </div>
                </div>
              </div>
              {/* /RIGHT */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
