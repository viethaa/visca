"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ContactDialog from "../ContactDialog";
import { useRouter } from "next/router";

export default function HeaderBanner() {
  const [open, setOpen] = useState(false);

  // keep stable to avoid ref jitter
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

  // slider refs/state
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const [slider, setSlider] = useState({ left: 0, width: 0 });

  // carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hanoi scenery images
  const hanoiScenery = [
     {
      url: "https://media.istockphoto.com/id/478073811/photo/beautiful-entrance-at-the-temple-of-literature-hanoi.jpg?s=612x612&w=0&k=20&c=yfkyJse95xkxEL2DOY9srgmZdpOxPTOc-6NQHiLj-_w=0",
      title: "Van Mieu - Quoc Tu Giam (Temple of Literature)",
    },
    {
      url: "https://statics.vinpearl.com/thap-rua-ho-guom-5_1691857514.jpg",
      title: "Hoàn Kiếm Lake (Tháp Rùa)",
    },
    {
      url: "https://vietnamtravel.com/images/2020/06/Intro-Hanoi-Old-Quater-for-visitors.jpg",
      title: "Hanoi Old Quarter",
    },
  ];

  // active link calculation
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHref]);

  useEffect(() => {
    const onResize = () => recalcSlider();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % hanoiScenery.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [hanoiScenery.length]);

  const nextSlide = () =>
    setCurrentSlide((p) => (p + 1) % hanoiScenery.length);
  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + hanoiScenery.length) % hanoiScenery.length);

  return (
    <div className="relative text-white">
      {/* NAVBAR: slightly transparent + blur, still dark */}
      <div className="fixed inset-x-0 top-0 z-[1000] border-b border-white/10 bg-neutral-950/90 backdrop-blur-md">
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
                <Link key={l.href} href={l.href} className="px-2">
                  <span
                    ref={(el) => (itemRefs.current[l.href] = el)}
                    className={[
                      "text-sm font-medium tracking-wide transition-colors",
                      isActive
                        ? "text-white font-semibold"
                        : "text-white/80 hover:text-white",
                    ].join(" ")}
                  >
                    {l.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* right side: Contact button (UNCHANGED) */}
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

        {/* mobile menu (same dark w/ slight opacity) */}
        {open && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-white/10 bg-neutral-950/90 backdrop-blur-md z-[1000]"
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
                      isActive ? "text-white" : "text-white/80 hover:text-white",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                );
              })}
              {/* Contact button (UNCHANGED) */}
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

      {/* CAROUSEL BANNER */}
      <section className="relative pt-16 overflow-hidden">
        {/* Carousel container */}
        <div className="relative h-[70vh] min-h-[500px]">
          {/* Image slides */}
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {hanoiScenery.map((image, index) => (
              <div
                key={index}
                className="relative w-full h-full flex-shrink-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${image.url})` }}
              >
                {/* darker overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all backdrop-blur-sm border border-white/20"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all backdrop-blur-sm border border-white/20"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center max-w-5xl px-4">
              {/* TITLE — two lines, balanced, with depth */}
              <div className="mb-4 space-y-1">
                {/* Line 1 */}
                <div className="relative inline-block">
                  {/* glow layer */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent blur-sm opacity-35"
                  >
                    Vietnam International School
                  </span>
                  {/* main text with deep shadow + subtle inner glow */}
                  <span
                    className="relative block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent drop-shadow"
                    style={{
                      filter:
                        "drop-shadow(0 1px 1px rgba(0,0,0,0.70)) drop-shadow(0 10px 26px rgba(0,0,0,0.35))",
                      textShadow:
                        "0 0 12px rgba(255,255,255,0.08), 0 0 2px rgba(255,255,255,0.15)",
                    }}
                  >
                    Vietnam International School
                  </span>
                </div>

                {/* Line 2 */}
                <div className="relative inline-block">
                  {/* glow layer */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent blur-sm opacity-35"
                  >
                    Counselor Association
                  </span>
                  {/* main text */}
                  <span
                    className="relative block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent drop-shadow"
                    style={{
                      filter:
                        "drop-shadow(0 1px 1px rgba(0,0,0,0.70)) drop-shadow(0 10px 26px rgba(0,0,0,0.35))",
                      textShadow:
                        "0 0 12px rgba(255,255,255,0.08), 0 0 2px rgba(255,255,255,0.15)",
                    }}
                  >
                    Counselor Association
                  </span>
                </div>
              </div>

              {/* CTA buttons (UNCHANGED) */}
              <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/events"
                  className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/20 transition backdrop-blur-sm"
                >
                  Explore Events
                </Link>
                <Link
                  href="/information"
                  className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/20 transition backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
            {hanoiScenery.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-110 shadow-[0_0_0_3px_rgba(255,255,255,0.25)]"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
