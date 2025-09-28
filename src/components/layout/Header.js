"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ContactDialog from "../ContactDialog";
import { usePathname } from "next/navigation";
import AdDialog from "../AdDialog";

export default function HeaderBanner() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToMap = () => scrollToSection('map-container');
  const scrollToInformation = () => scrollToSection('information');
  const scrollToLocations = () => scrollToSection('locations');

  const [open, setOpen] = useState(false);
  const [adDialogOpen, setAdDialogOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('/');

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "#information", label: "School", isScroll: true },
      { href: "#locations", label: "VISCA Map", isScroll: true },
      { href: "/hotels", label: "Hotels" },
      { href: "#events", label: "University Visits" },
    ],
    []
  );

  const pathname = (usePathname() || "/").split("#")[0].split("?")[0] || "/";
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const [slider, setSlider] = useState({ left: 0, width: 0 });

  const activeHref = useMemo(() => {
    // If we're on the home page, check if we're in a specific section
    if (pathname === "/" && currentSection !== "/") {
      return currentSection;
    }

    const exact = navLinks.find((l) => l.href === pathname)?.href;
    if (exact) return exact;
    const pref = [...navLinks]
      .filter((l) => pathname.startsWith(l.href) && l.href !== "/")
      .sort((a, b) => b.href.length - a.href.length)[0];
    return pref?.href ?? "/";
  }, [pathname, navLinks, currentSection]);

  const recalcSlider = useCallback(() => {
    const el = itemRefs.current[activeHref];
    const wrap = containerRef.current;
    if (!el || !wrap) return;
    const elRect = el.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    setSlider({ left: elRect.left - wrapRect.left, width: elRect.width });
  }, [activeHref]);

  useEffect(() => {
    recalcSlider();
    const t = setTimeout(recalcSlider, 0);
    return () => clearTimeout(t);
  }, [activeHref, recalcSlider]);

  useEffect(() => {
    const onResize = () => recalcSlider();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcSlider]);

  // Scroll position detection
  useEffect(() => {
    const handleScroll = () => {
      const informationElement = document.getElementById('information');
      const locationsElement = document.getElementById('locations');

      if (!informationElement || !locationsElement) return;

      const windowHeight = window.innerHeight;
      const viewportCenter = windowHeight / 2;

      const informationRect = informationElement.getBoundingClientRect();
      const locationsRect = locationsElement.getBoundingClientRect();

      // Check if we're above the information section (homepage area)
      if (informationRect.top > viewportCenter) {
        setCurrentSection('/');
      }
      // Check if information section header is in the center area of viewport
      else if (informationRect.top <= viewportCenter && informationRect.top >= -100) {
        setCurrentSection('#information');
      }
      // Check if locations section header is in the center area of viewport
      else if (locationsRect.top <= viewportCenter && locationsRect.top >= -100) {
        setCurrentSection('#locations');
      }
      // If both sections are above viewport center, determine which one is closer
      else if (informationRect.top < -100 && locationsRect.top < -100) {
        // Both sections are above, choose the one that passed the center most recently
        if (Math.abs(informationRect.top) < Math.abs(locationsRect.top)) {
          setCurrentSection('#information');
        } else {
          setCurrentSection('#locations');
        }
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener with throttling for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes gentlePulse {
          0% { width: 55%; }
          50% { width: 75%; }
          100% { width: 55%; }
        }

        /* Calm breathing pill (single capsule) */
        @keyframes breathPill {
          0%, 100% { opacity: .35; transform: scaleX(0.95) scaleY(1.0); }
          50%      { opacity: .85; transform: scaleX(1.0) scaleY(1.08); }
        }
        .breathing {
          animation: breathPill 6.5s ease-in-out infinite;
          transform-origin: center;
          will-change: transform, opacity;
        }

        .card-hover { transition: transform 300ms ease, box-shadow 300ms ease, background-color 300ms ease, border-color 300ms ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.42); }
        .btn-hover { transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease, border-color 180ms ease, color 180ms ease; }
        .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(0,0,0,0.35); }
      `}</style>

      <div className="relative text-white">
        {/* NAVBAR */}
        <div className="fixed inset-x-0 top-0 z-[1000] border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="relative flex h-16 items-center px-4 md:px-6">
            <div className="flex-none">
              <div className="rounded-md bg-neutral-900/95 px-3 py-2 border border-white/10 shadow-sm">
                <span className="text-white font-bold tracking-widest text-xs">VISCA</span>
              </div>
            </div>

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

                if (l.isScroll) {
                  const scrollFunction = l.href === '#information' ? scrollToInformation :
                    l.href === '#locations' ? scrollToLocations :
                      scrollToMap;
                  return (
                    <button
                      key={l.href}
                      onClick={scrollFunction}
                      className="px-2"
                    >
                      <span
                        ref={(el) => (itemRefs.current[l.href] = el)}
                        className={[
                          "text-sm font-medium tracking-wide transition-colors cursor-pointer",
                          isActive ? "text-white font-semibold" : "text-white/80 hover:text-white",
                        ].join(" ")}
                      >
                        {l.label}
                      </span>
                    </button>
                  );
                }

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

            <div className="flex-none ml-auto">
              <ContactDialog asChild>
                <button className="btn-hover inline-flex items-center justify-center rounded-full border border-white/15 bg-black/60 px-5 py-2 text-sm font-medium text-white/90 shadow-md backdrop-blur hover:border-white/35 hover:text-white">
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

                  if (l.isScroll) {
                    const scrollFunction = l.href === '#information' ? scrollToInformation :
                      l.href === '#locations' ? scrollToLocations :
                        scrollToMap;
                    return (
                      <button
                        key={l.href}
                        onClick={() => {
                          scrollFunction();
                          setOpen(false);
                        }}
                        className={[
                          "rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left w-full",
                          isActive ? "text-white" : "text-white/85 hover:text-white",
                        ].join(" ")}
                      >
                        {l.label}
                      </button>
                    );
                  }

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

        <section className="relative pt-16 min-h-screen overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: "url('https://statics.vinpearl.com/thap-rua-ho-guom-5_1691857514.jpg')",
              backgroundPosition: "center 80%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/60" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="space-y-6 max-w-xl" style={{ animation: "fadeInUp .7s ease-out" }}>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                  <span className="">
                    Vietnam International
                  </span>
                  <br />{" "}
                  <span className="">
                    <span className="whitespace-nowrap">School&nbsp;Counselor</span>{" "}
                  </span>
                  <span className="">
                    Association
                  </span>
                </h1>

                <div className="mt-3 w-48 max-w-xs">
                  <div className="h-1.5 w-full rounded-full bg-neutral-200/40 breathing" />
                </div>

                <p className="text-base md:text-lg text-white/90 leading-relaxed mt-2">
                  Connecting universities to counselors across Hanoi to share resources, plan impactful
                  events, and support every student  <br></br>with consistent, high-quality guidance.
                </p>

                <div className="flex flex-wrap gap-3 pt-1">
                  <p onClick={() => setAdDialogOpen(true)}
                    className=" btn-hover rounded-lg border border-white/30 bg-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-md shadow-lg"
                  >
                    Explore Events
                  </p>
                  <Link
                    href=""
                    className="btn-hover rounded-lg border border-white/30 bg-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-md shadow-lg"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:gap-5" style={{ animation: "scaleIn .6s ease-out .05s both" }}>
                <div className="col-span-2 isolate relative overflow-hidden rounded-xl border border-white/25 bg-neutral-800/90 backdrop-blur-xl shadow-2xl p-5 card-hover
                                after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-neutral-900/20">
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl z-0" />
                  <div className="relative z-10 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">Featured Events</div>
                        <h3 className="mt-1 text-lg font-semibold tracking-tight">Hanoi University Fair 2025</h3>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 rounded-md bg-black/70 px-2.5 py-1.5 text-[12px] border border-white/10">
                          <span>Oct</span>
                          <span className="font-bold">01</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-white/90">
                      Connect with counselors, students, and parents at the summit.
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      {/* <Link
                        href="/even"
                        className="btn-hover rounded-2xl border border-white/25 bg-neutral-700/70 px-3.5 py-2 text-sm font-medium hover:bg-neutral-700/80"
                      >
                        View details
                      </Link> */}
                      <p onClick={() => setAdDialogOpen(true)} className="btn-hover rounded-2xl border border-white/25 bg-neutral-700/70 px-3.5 py-2 text-sm font-medium hover:bg-neutral-700/80>">
                        View details
                      </p>
                      <Link
                        href=""
                        className="btn-hover rounded-2xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm font-medium hover:bg-black/70"
                      >
                        Directions
                      </Link>
                    </div>
                  </div>
                </div>


                <div className="col-span-1 col-start-2 isolate relative overflow-hidden rounded-xl border border-white/25 bg-neutral-800/90 backdrop-blur-xl shadow-xl p-4 card-hover
                                after:content-[''] after:absolute after:inset-0 after:rounded-xl after:bg-neutral-900/20">
                  <div className="relative z-10 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">At a glance</div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-base font-bold">10+</div>
                        <div className="text-[10px] uppercase tracking-wide text-white/70">Schools</div>
                      </div>
                      <div>
                        <div className="text-base font-bold">30+</div>
                        <div className="text-[10px] uppercase tracking-wide text-white/70">Counselors</div>
                      </div>
                      <div>
                        <div className="text-base font-bold">50+</div>
                        <div className="text-[10px] uppercase tracking-wide text-white/70">Events</div>
                      </div>
                    </div>
                    <div className="mt-3 h-1 w-full bg-white/15 rounded-full overflow-hidden">
                      <div className="h-full bg-white/80 rounded-full" style={{ animation: "gentlePulse 8s ease-in-out infinite" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <AdDialog open={adDialogOpen} onOpenChange={setAdDialogOpen} />
    </>
  );
}

