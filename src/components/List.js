import React, { useEffect, useRef, useState } from 'react'
import {
  MapPin,
  User,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react'
import Links from './map/Links'

// Normalize helper: lowercase + strip non-alphanumerics
const normalizeName = (name = '') => name.toLowerCase().replace(/[^a-z0-9]/g, '')

/* ---------- color maps (unchanged) ---------- */
const buttonColors = {
  concordiainternationalschoolhanoi: {
    gradient: 'from-green-400/50 via-emerald-500/40 to-teal-500/50',
    border: 'border-emerald-400/70',
    ring: 'ring-emerald-300/30 hover:ring-emerald-200/50',
    hoverShadow: 'hover:shadow-emerald-500/20',
  },
  stpaulamericanschoolhanoi: {
    gradient: 'from-red-700/80 via-red-600/70 to-white/80',
    border: 'border-red-600/70',
    ring: 'ring-red-400/30 hover:ring-red-300/50',
    hoverShadow: 'hover:shadow-red-600/20',
  },
  britishvietnameseinternationalschoolhanoi: {
    gradient: 'from-sky-600/70 via-sky-500/60 to-white/80',
    border: 'border-sky-500/70',
    ring: 'ring-sky-300/30 hover:ring-sky-200/50',
    hoverShadow: 'hover:shadow-sky-500/20',
  },
  unishanoi: {
    gradient: 'from-sky-400/50 via-blue-500/40 to-indigo-500/50',
    border: 'border-sky-400/70',
    ring: 'ring-sky-300/30 hover:ring-sky-200/50',
    hoverShadow: 'hover:shadow-sky-500/20',
  },
  thschool: {
    gradient: 'from-pink-400/50 via-rose-500/40 to-fuchsia-600/50',
    border: 'border-fuchsia-400/70',
    ring: 'ring-fuchsia-300/30 hover:ring-fuchsia-200/50',
    hoverShadow: 'hover:shadow-fuchsia-500/20',
  },
  britishinternationalschoolhanoi: {
    gradient: 'from-yellow-400/50 via-amber-500/40 to-orange-500/50',
    border: 'border-amber-400/70',
    ring: 'ring-amber-300/30 hover:ring-amber-200/50',
    hoverShadow: 'hover:shadow-amber-500/20',
  },
  theolympiaschools: {
    gradient: 'from-purple-700/70 via-purple-600/60 to-violet-500/70',
    border: 'border-purple-500/70',
    ring: 'ring-purple-400/30 hover:ring-purple-300/50',
    hoverShadow: 'hover:shadow-purple-600/20',
  },
  hanoiinternationalschool: {
    gradient: 'from-gray-900/80 via-blue-800/70 to-blue-500/70',
    border: 'border-blue-500/70',
    ring: 'ring-blue-400/30 hover:ring-blue-300/50',
    hoverShadow: 'hover:shadow-blue-600/20',
  },
  deltaglobalschool: {
    gradient: 'from-lime-400/70 via-green-300/60 to-emerald-400/70',
    border: 'border-lime-400/70',
    ring: 'ring-lime-300/30 hover:ring-lime-200/50',
    hoverShadow: 'hover:shadow-lime-500/20',
  },
  thedeweyschools: {
    gradient: 'from-teal-400/70 via-cyan-400/60 to-sky-400/70',
    border: 'border-teal-400/70',
    ring: 'ring-teal-300/30 hover:ring-teal-200/50',
    hoverShadow: 'hover:shadow-teal-500/20',
  },
}

const defaultButtonColors = {
  gradient: 'from-zinc-300/40 via-zinc-500/30 to-zinc-800/50',
  border: 'border-zinc-400/60',
  ring: 'ring-zinc-300/20 hover:ring-zinc-200/40',
  hoverShadow: 'hover:shadow-black/20',
}

export default function List({ schools = [] }) {
  const [openByName, setOpenByName] = useState({})
  const [copiedItems, setCopiedItems] = useState({})

  // refs for syncing header heights per row
  const containerRef = useRef(null)
  const headerRefs = useRef([]) // array of DOM nodes, index matches sortedSchools index

  // Keep a state to trigger re-measure if layout changes (images load)
  const [measureTrigger, setMeasureTrigger] = useState(0)

  // copy & toggle helpers (unchanged)
  const toggleCard = (schoolName) => {
    setOpenByName((prev) => ({ ...prev, [schoolName]: !prev[schoolName] }))
  }

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedItems((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const infoItems = (school) => [
    { icon: MapPin, label: 'Location', value: school?.address, color: 'from-amber-400/40 via-yellow-500/30 to-orange-400/30', copyable: false, clamp: 0 },
    { icon: User, label: 'Counselor', value: school?.counselor_name, color: 'from-blue-600/30 to-cyan-600/30', copyable: false, clamp: 0 },
    { icon: Mail, label: 'Email', value: school?.counselor_email, color: 'from-purple-600/30 to-pink-600/30', copyable: true, clamp: 1 },
    { icon: Phone, label: 'Phone', value: school?.counselor_phone, color: 'from-emerald-600/30 to-teal-600/30', copyable: false, clamp: 1 },
    { icon: MessageCircle, label: 'Contact Point', value: school?.contact_point, color: 'from-orange-600/30 to-red-600/30', copyable: true, clamp: 1 },
    { icon: Clock, label: 'Preferred Time', value: school?.preferred_time, color: 'from-indigo-600/30 to-purple-600/30', copyable: false, clamp: 0 },
  ]

  // Sort schools alphabetically (stable)
  const sortedSchools = [...schools].sort((a, b) =>
    (a?.name || '').localeCompare(b?.name || '', 'en', { sensitivity: 'base' })
  )

  // effect: measure header heights per row and apply minHeight to each header in that row
  useEffect(() => {
    if (!containerRef.current) return

    const syncHeaderHeights = () => {
      const container = containerRef.current
      // get computed grid-template-columns - returns pixel values separated by spaces
      const style = window.getComputedStyle(container)
      const colsString = style.getPropertyValue('grid-template-columns') || ''
      const columns = colsString.split(' ').filter(Boolean).length || 1

      // reset heights first
      headerRefs.current.forEach((el) => {
        if (el) {
          el.style.minHeight = '' // clear previous
        }
      })

      // group indices into rows by column count
      for (let i = 0; i < headerRefs.current.length; i += columns) {
        const rowIndices = []
        for (let j = 0; j < columns; j++) {
          if (headerRefs.current[i + j]) rowIndices.push(i + j)
        }
        if (rowIndices.length === 0) continue

        // compute max height among headers in this row
        let max = 0
        rowIndices.forEach((idx) => {
          const el = headerRefs.current[idx]
          if (el) {
            // measure offsetHeight (includes padding)
            const h = el.offsetHeight
            if (h > max) max = h
          }
        })

        // apply max as minHeight to each header in that row so links align
        if (max > 0) {
          rowIndices.forEach((idx) => {
            const el = headerRefs.current[idx]
            if (el) {
              el.style.minHeight = `${max}px`
            }
          })
        }
      }
    }

    // initial sync and some delayed re-sync to account for images loading
    syncHeaderHeights()
    const t1 = setTimeout(syncHeaderHeights, 120) // quick re-run
    const t2 = setTimeout(syncHeaderHeights, 450) // another pass for slower images

    // re-run on resize and on images load (listen to window 'load' once)
    window.addEventListener('resize', syncHeaderHeights)
    window.addEventListener('load', syncHeaderHeights)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', syncHeaderHeights)
      window.removeEventListener('load', syncHeaderHeights)
    }
  }, [sortedSchools.length, measureTrigger]) // re-run whenever schools length changes or measureTrigger toggles

  // If any logo images inside the card load later, we can bump measureTrigger to re-measure.
  // Attach small onLoad handlers to images to trigger re-measure.
  const onImageLoad = () => {
    // slight debounce - bump state to cause effect to re-run
    setTimeout(() => setMeasureTrigger((s) => s + 1), 40)
  }

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 items-stretch">
      {sortedSchools.map((school, idx) => {
        const isOpen = !!openByName[school.name]
        const slug = normalizeName(school.name)
        const colors = buttonColors[slug] || defaultButtonColors

        return (
          <div
            key={school.name || `school-${idx}`}
            className="group relative bg-neutral-900/90 backdrop-blur-xl shadow-2xl rounded-3xl border-2 border-white/60 hover:border-white/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-blue-500/10 overflow-hidden h-full"
          >
            {/* Hover tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.05] via-purple-600/[0.02] to-cyan-600/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/40 rounded-3xl" />

            <div className="relative z-10 p-6 flex flex-col h-full">
              {/* HEADER: measure target (we set ref here) */}
              <div
                ref={(el) => (headerRefs.current[idx] = el)}
                className="flex items-start gap-3.5 mb-6"
              >
                <div className="relative shrink-0">
                  {school.logo ? (
                    <img
                      src={school.logo}
                      onLoad={onImageLoad}
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-gray-700/50 group-hover:ring-blue-500/30 transition-all duration-300 shadow-lg"
                      alt={`${school.name} logo`}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-2xl bg-gray-800 ring-2 ring-gray-700/50 shadow-lg" />
                  )}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* NO truncation — allow wrapping */}
                  <h3 className="text-[1.35rem] font-bold leading-snug bg-gradient-to-r from-white via-sky-100 to-blue-200 bg-clip-text text-transparent tracking-normal drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                    {school.name}
                  </h3>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mb-8 flex-1 min-h-[72px] sm:min-h-[88px]">
                <div className="flex flex-wrap gap-2">
                  <Links school={school} />
                </div>
              </div>

              {/* View Details button */}
              <button
                onClick={() => toggleCard(school.name)}
                aria-expanded={isOpen}
                className={`
                  group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl
                  bg-gradient-to-r ${colors.gradient}
                  border-2 ${colors.border}
                  ${colors.ring}
                  text-white text-sm font-semibold transition-all duration-300 mt-auto
                  shadow-lg ${colors.hoverShadow}
                `}
              >
                <span>{isOpen ? 'Hide Details' : 'View Details'}</span>
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Details */}
              <div
                className={`
                  overflow-hidden transition-all duration-500
                  ${isOpen ? 'max-h-[60vh] opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'}
                `}
              >
                <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1 overscroll-contain no-scrollbar">
                  {infoItems(school).map(
                    (item, i2) =>
                      item.value && (
                        <div
                          key={i2}
                          className={`
                            group/info relative p-3 rounded-xl
                            bg-gradient-to-r ${item.color}
                            backdrop-blur-sm border border-white/40 hover:border-white/60
                            transition-all duration-300 shadow
                          `}
                        >
                          {item.copyable && (
                            <button
                              onClick={() =>
                                copyToClipboard(item.value, `${school.name}-${item.label}`)
                              }
                              className="absolute top-2 right-2 p-1 rounded-md bg-gray-800/60 hover:bg-gray-700/70 border border-white/40 hover:border-white/60 opacity-0 group-hover/info:opacity-100 focus-visible:opacity-100 transition-all duration-200 shadow"
                              title={`Copy ${item.label}`}
                            >
                              {copiedItems[`${school.name}-${item.label}`] ? (
                                <Check className="h-3 w-3 text-green-400" />
                              ) : (
                                <Copy className="h-3 w-3 text-gray-200" />
                              )}
                            </button>
                          )}

                          <div className="flex items-start gap-3">
                            <div className="p-1.5 rounded-lg bg-gray-800/50 shadow shrink-0">
                              <item.icon className="h-4 w-4 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] font-semibold text-gray-200 uppercase tracking-wider mb-1">
                                {item.label}
                              </div>

                              <div
                                className={[
                                  'text-sm text-white',
                                  item.clamp === 1
                                    ? 'truncate whitespace-nowrap overflow-hidden'
                                    : 'break-words whitespace-normal',
                                ].join(' ')}
                                title={item.clamp === 1 ? String(item.value) : undefined}
                              >
                                {item.value}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
