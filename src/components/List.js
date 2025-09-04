import React, { useState } from 'react'
import { MapPin, User, Mail, Phone, MessageCircle, Clock, ChevronRight, Copy, Check } from 'lucide-react'
import Links from './map/Links'

export default function List({ schools = [] }) {
  const [openByName, setOpenByName] = useState({})
  const [copiedItems, setCopiedItems] = useState({})

  const toggleCard = (schoolName) => {
    setOpenByName(prev => ({ ...prev, [schoolName]: !prev[schoolName] }))
  }

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const infoItems = (school) => [
    // 1) Location first — warm yellow/amber gradient box
    {
      icon: MapPin,
      label: 'Location',
      value: school?.address,
      color: 'from-amber-400/40 via-yellow-500/30 to-orange-400/30',
      copyable: false,
      clamp: 0, // wrap fully
    },
    {
      icon: User,
      label: 'Counselor',
      value: school?.counselor_name,
      color: 'from-blue-600/30 to-cyan-600/30',
      copyable: false,
      clamp: 0,
    },
    {
      icon: Mail,
      label: 'Email',
      value: school?.counselor_email,
      color: 'from-purple-600/30 to-pink-600/30',
      copyable: true,
      clamp: 1, // one-line with …
    },
    {
      icon: Phone,
      label: 'Phone',
      value: school?.counselor_phone,
      color: 'from-emerald-600/30 to-teal-600/30',
      copyable: false,
      clamp: 1,
    },
    {
      icon: MessageCircle,
      label: 'Contact Point',
      value: school?.contact_point,
      color: 'from-orange-600/30 to-red-600/30',
      copyable: true,
      clamp: 1,
    },
    {
      icon: Clock,
      label: 'Preferred Time',
      value: school?.preferred_time,
      color: 'from-indigo-600/30 to-purple-600/30',
      copyable: false,
      clamp: 0, // wrap fully
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {schools.map((school) => {
        const isOpen = !!openByName[school.name]
        return (
          <div
            key={school.name}
            className="
              group relative bg-black backdrop-blur-md rounded-3xl
              border-2 border-white/60 hover:border-white/80
              transition-all duration-500 hover:scale-[1.02]
              shadow-2xl hover:shadow-blue-500/10 overflow-hidden
            "
          >
            {/* Hover tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.05] via-purple-600/[0.02] to-cyan-600/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/40 rounded-3xl" />

            {/* Main content */}
            <div className="relative z-10 p-6 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start gap-3.5 mb-6">
                <div className="relative shrink-0">
                  <img
                    src={school.logo}
                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-gray-700/50 group-hover:ring-blue-500/30 transition-all duration-300 shadow-lg"
                    alt={`${school.name} logo`}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* School name — gradient tint + cleaner spacing */}
                  <h3
                    className="
                      text-[1.35rem] font-bold leading-[1.28]
                      bg-gradient-to-r from-white via-sky-100 to-blue-200
                      bg-clip-text text-transparent
                      tracking-normal
                      drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]
                    "
                  >
                    {school.name}
                  </h3>
                </div>
              </div>

              {/* Extra space before Quick Links */}
              <div className="mb-8 flex-1">
                <div className="flex flex-wrap gap-2">
                  <Links school={school} />
                </div>
              </div>

              {/* View Details button (white but not too bright) */}
              <button
                onClick={() => toggleCard(school.name)}
                aria-expanded={isOpen}
                className="
                  group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl
                  bg-gray-800/60 hover:bg-gray-700/70
                  border-2 border-white/40 hover:border-white/60
                  ring-2 ring-white/30 hover:ring-white/50
                  text-white text-sm font-semibold transition-all duration-300 mt-auto
                  shadow-lg
                "
              >
                <span>{isOpen ? 'Hide Details' : 'View Details'}</span>
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Details (start closed) */}
              <div
                className={`
                  overflow-hidden transition-all duration-500
                  ${isOpen ? 'max-h-[60vh] opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'}
                `}
              >
                {/* Scrollable info area */}
                <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1 overscroll-contain">
                  {infoItems(school).map((item, idx) => (
                    item.value && (
                      <div
                        key={idx}
                        className={`
                          group/info relative p-3 rounded-xl
                          bg-gradient-to-r ${item.color}
                          backdrop-blur-sm border border-white/40 hover:border-white/60
                          transition-all duration-300 shadow
                        `}
                      >
                        {/* Smaller copy button pinned top-right; shows on hover/focus */}
                        {item.copyable && (
                          <button
                            onClick={() => copyToClipboard(item.value, `${school.name}-${item.label}`)}
                            className="
                              absolute top-2 right-2 p-1 rounded-md
                              bg-gray-800/60 hover:bg-gray-700/70
                              border border-white/40 hover:border-white/60
                              opacity-0 group-hover/info:opacity-100 focus-visible:opacity-100
                              transition-all duration-200 shadow
                            "
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

                            {/* Clamp 1 line for Email/Phone/Contact Point; wrap for Location/Counselor/Preferred Time */}
                            <div
                              className={[
                                'text-sm text-white',
                                item.clamp === 1
                                  ? 'truncate whitespace-nowrap overflow-hidden'
                                  : 'break-words whitespace-normal'
                              ].join(' ')}
                              title={item.clamp === 1 ? String(item.value) : undefined}
                            >
                              {item.value}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
