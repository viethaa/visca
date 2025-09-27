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
  FileText,
  CalendarDays,
  StickyNote,
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
    gradient: 'from-red-700/80 via-red-600/70 to-red-500/60',
    border: 'border-red-600/70',
    ring: 'ring-red-400/30 hover:ring-red-300/50',
    hoverShadow: 'hover:shadow-red-600/20',
  },
  britishvietnameseinternationalschoolhanoi: {
    gradient: 'from-sky-600/70 via-sky-500/60 to-sky-400/50',
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
  // Initialize all schools to hide details by default
  const [openByName, setOpenByName] = useState(() => {
    const initialState = {}
    schools.forEach(school => {
      if (school?.name) {
        initialState[school.name] = false
      }
    })
    return initialState
  })
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
    { icon: User, label: 'Counselor', value: school?.counselor_name, color: 'from-blue-600/30 to-cyan-600/30', copyable: false, clamp: 0 },
    { icon: Mail, label: 'Email', value: school?.counselor_email, color: 'from-amber-400/40 via-yellow-500/30 to-orange-400/30', copyable: true, clamp: 1 },
    { icon: Phone, label: 'Phone', value: school?.counselor_phone, color: 'from-emerald-600/30 to-teal-600/30', copyable: false, clamp: 1 },
    { icon: MessageCircle, label: 'Contact Point', value: school?.contact_point, color: 'from-purple-600/30 to-pink-600/30', copyable: true, clamp: 1 },
  ]

  const visitTimesItem = (school) => ({
    icon: CalendarDays,
    label: 'School Visit Times',
    value: school?.preferred_time,
    color: 'from-amber-400/40 via-yellow-500/30 to-orange-400/30',
    copyable: false,
    clamp: 0
  })

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
    <div ref={containerRef} className="space-y-6">
      {sortedSchools.map((school, idx) => {
        const isOpen = !!openByName[school.name]
        const slug = normalizeName(school.name)
        const colors = buttonColors[slug] || defaultButtonColors

        return (
          <div
            key={school.name || `school-${idx}`}
            className="group relative bg-neutral-900/90 backdrop-blur-xl shadow-xl rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden"
          >
            {/* Hover tint */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/[0.02] via-purple-600/[0.01] to-cyan-600/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

            <div className="relative z-10 p-6">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="relative shrink-0">
                    {school.logo ? (
                      <img
                        src={school.logo}
                        onLoad={onImageLoad}
                        className="h-16 w-16 rounded-xl object-cover ring-2 ring-gray-700/50 group-hover:ring-blue-500/30 transition-all duration-300 shadow-lg"
                        alt={`${school.name} logo`}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-gray-800 ring-2 ring-gray-700/50 shadow-lg" />
                    )}
                  </div>

                  {/* School Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-white via-sky-100 to-blue-200 bg-clip-text text-transparent">
                      {school.name}
                    </h3>
                    {school.address && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-800/40 rounded-md border border-gray-600/40">
                        <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-300 font-medium leading-tight">{school.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Links and Toggle */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-wrap gap-2 justify-start">
                    <Links school={school} />
                  </div>

                  <button
                    onClick={() => toggleCard(school.name)}
                    aria-expanded={isOpen}
                    className={`
                      flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all duration-300
                      bg-gradient-to-r ${colors.gradient}
                      border ${colors.border}
                      ${colors.ring}
                      text-white shadow-sm ${colors.hoverShadow}
                      hover:scale-105
                    `}
                  >
                    <span>{isOpen ? 'Hide Details' : 'Show Details'}</span>
                    <ChevronRight
                      className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Mobile Links */}
              <div className="sm:hidden mb-4">
                <div className="flex flex-wrap gap-2 justify-start">
                  <Links school={school} />
                </div>
              </div>

              {/* Details Section */}
              <div
                className={`
                  overflow-hidden transition-all duration-500
                  ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="pt-4 border-t border-white/10 space-y-4">
                  {/* Main Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {infoItems(school).map(
                      (item, i2) =>
                        item.value && (
                          <div
                            key={i2}
                            className={`
                              group/info relative p-3 rounded-lg
                              bg-gradient-to-br ${item.color}
                              backdrop-blur-sm border border-white/20 hover:border-white/40
                              transition-all duration-300 shadow-sm hover:shadow-md
                            `}
                          >
                            {item.copyable && (
                              <button
                                onClick={() =>
                                  copyToClipboard(item.value, `${school.name}-${item.label}`)
                                }
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700/70 border border-white/30 hover:border-white/50 opacity-0 group-hover/info:opacity-100 focus-visible:opacity-100 transition-all duration-200 shadow-sm"
                                title={`Copy ${item.label}`}
                              >
                                {copiedItems[`${school.name}-${item.label}`] ? (
                                  <Check className="h-3 w-3 text-green-400" />
                                ) : (
                                  <Copy className="h-3 w-3 text-gray-200" />
                                )}
                              </button>
                            )}

                            <div className="flex items-start gap-2">
                              <div className="p-1.5 rounded-md bg-gray-800/50 shadow-sm shrink-0">
                                <item.icon className="h-3.5 w-3.5 text-white" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="text-[9px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                                  {item.label}
                                </div>

                                <div
                                  className={[
                                    'text-xs text-white font-medium',
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

                  {/* Visit Times - Dark Boxes */}
                  {(() => {
                    const visitTimes = visitTimesItem(school)
                    if (!visitTimes.value) return null

                    const timeSlots = visitTimes.value.split(';').map(time => time.trim()).filter(Boolean)

                    return (
                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-300 uppercase tracking-wide text-xs">
                            {visitTimes.label}:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {timeSlots.map((timeSlot, index) => (
                            <div
                              key={index}
                              className="px-3 py-2 bg-gray-800/60 border border-white rounded-lg text-sm text-gray-100 font-medium"
                            >
                              {timeSlot}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Notes Section */}
                  {school.notes && (
                    <div className="pt-3 border-t border-white/10">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="font-medium text-gray-300 uppercase tracking-wide text-xs">
                          Notes:
                        </span>
                      </div>
                      <div className="text-sm text-gray-200 leading-relaxed">
                        {school.notes}
                      </div>
                    </div>
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
