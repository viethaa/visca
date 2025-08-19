"use client";

import React, { useState } from "react";
import Link from "next/link";
import ContactDialog from "../ContactDialog";

export default function HeaderBanner() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/locations", label: "Locations" },
    { href: "/information", label: "Information" },
  ];

  const linkClass =
    "rounded-lg px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition";

  return (
    <div className="relative text-white">
      <div className="fixed inset-x-0 top-0 z-[1000] border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="group inline-flex items-center gap-3">
            <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15 bg-white/5">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/2000px-Flag_of_Vietnam.svg.png"
                alt="Vietnam flag"
                className="h-8 w-8 object-cover"
              />
            </span>
            <span className="text-base font-semibold tracking-wide">VISCA</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass}>
                {l.label}
              </Link>
            ))}
            <ContactDialog asChild>
              <button className={linkClass}>Contact</button>
            </ContactDialog>
          </nav>

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

        {open && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur z-[1000]"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  {l.label}
                </Link>
              ))}
              <ContactDialog asChild>
                <button onClick={() => setOpen(false)} className={`mt-2 ${linkClass}`}>
                  Contact
                </button>
              </ContactDialog>
            </div>
          </div>
        )}
      </div>

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
