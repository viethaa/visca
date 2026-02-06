import Footer from '@/components/layout/Footer'
import Head from 'next/head'
import MapContainer from '@/components/map/MapContainer'
import data from '@/data.json'
import { fetchSchools } from '@/functions'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import ContactDialog from '@/components/ContactDialog'

// Keep spreadsheet order: DO NOT SORT.
export async function getStaticProps() {
  let schools = []

  try {
    const SHEET_ID = process.env.SPREADSHEET_ID

    if (typeof SHEET_ID === 'string' && SHEET_ID.length > 0) {
      // Use the sheet order as returned by your fetcher
      schools = await fetchSchools(SHEET_ID)
    } else {
      // Fallback to local data.json (keeps file order)
      schools = Array.isArray(data?.schools) ? data.schools : (Array.isArray(data) ? data : [])
    }
  } catch (err) {
    // Safety net: never fail the build; use local data
    schools = Array.isArray(data?.schools) ? data.schools : (Array.isArray(data) ? data : [])
  }

  // Normalize only; DO NOT change order.
  schools = (Array.isArray(schools) ? schools : []).filter(Boolean)

  return {
    props: { schools },
    revalidate: 60,
  }
}

export default function MapPage({ schools }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const itemRefs = useRef({})
  const [slider, setSlider] = useState({ left: 0, width: 0 })

  const pathname = usePathname()

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/#information", label: "College Registration" },
      { href: "/map", label: "VISCA Map" },
      { href: "/hotels", label: "Hotels" },
    ],
    []
  )

  const activeHref = "/map" // Current page

  const recalcSlider = useCallback(() => {
    const el = itemRefs.current[activeHref]
    const wrap = containerRef.current
    if (!el || !wrap) return
    const elRect = el.getBoundingClientRect()
    const wrapRect = wrap.getBoundingClientRect()
    setSlider({ left: elRect.left - wrapRect.left, width: elRect.width })
  }, [activeHref])

  useEffect(() => {
    recalcSlider()
    const t = setTimeout(recalcSlider, 0)
    return () => clearTimeout(t)
  }, [activeHref, recalcSlider])

  useEffect(() => {
    const onResize = () => recalcSlider()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [recalcSlider])

  return (
    <>
      <Head>
        <title>VISCA Map | VISCA</title>
        <meta name="description" content="Interactive map showing all VISCA member schools, hotels, and key locations in Hanoi" />
      </Head>

      <div className="flex h-screen flex-col overflow-hidden">
        {/* Custom Navbar with Slider */}
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
              {navLinks.map((link) => {
                const isActive = link.href === activeHref
                return (
                  <Link key={link.href} href={link.href} className="px-2">
                    <span
                      ref={(el) => (itemRefs.current[link.href] = el)}
                      className={[
                        "text-sm font-medium tracking-wide transition-colors",
                        isActive ? "text-white font-semibold" : "text-white/80 hover:text-white",
                      ].join(" ")}
                    >
                      {link.label}
                    </span>
                  </Link>
                )
              })}
            </nav>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
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
                <button className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/60 px-5 py-2 text-sm font-medium text-white/90 shadow-md backdrop-blur hover:border-white/35 hover:text-white">
                  Contact
                </button>
              </ContactDialog>
            </div>
          </div>

          {open && (
            <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-md z-[1000]">
              <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
                {navLinks.map((link) => {
                  const isActive = link.href === activeHref
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={[
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? "text-white" : "text-white/85 hover:text-white",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                <ContactDialog asChild>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-flex items-center justify-center rounded-full border border-white/15 bg-black/70 px-5 py-2 text-sm font-medium text-white/90 shadow-md backdrop-blur hover:border-white/35 hover:text-white"
                  >
                    Contact
                  </button>
                </ContactDialog>
              </div>
            </div>
          )}
        </div>

        <main className="flex-1 bg-gradient-to-br from-black via-neutral-950 to-black text-white overflow-hidden pt-16">
          {/* Map Section - Full Screen */}
          <div className="h-full w-full">
            <MapContainer schools={schools} />
          </div>
        </main>
      </div>
    </>
  )
}
