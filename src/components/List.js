import React, { useState } from 'react'
import { MapPin, User, Mail, Phone, MessageCircle, Clock, ChevronRight, Copy, Check } from 'lucide-react'
import Links from './map/Links'

export default function List({ schools }) {
  const [expandedCard, setExpandedCard] = useState(null)
  const [copiedItems, setCopiedItems] = useState({})

  const toggleCard = (schoolName) => {
    setExpandedCard(expandedCard === schoolName ? null : schoolName)
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
    {
      icon: User,
      label: 'Counselor',
      value: school?.counselor_name,
      color: 'from-blue-600/30 to-cyan-600/30',
      copyable: false
    },
    {
      icon: Mail,
      label: 'Email',
      value: school?.counselor_email,
      color: 'from-purple-600/30 to-pink-600/30',
      copyable: true
    },
    {
      icon: Phone,
      label: 'Phone',
      value: school?.counselor_phone,
      color: 'from-emerald-600/30 to-teal-600/30',
      copyable: false
    },
    {
      icon: MessageCircle,
      label: 'Contact Point',
      value: school?.contact_point,
      color: 'from-orange-600/30 to-red-600/30',
      copyable: true
    },
    {
      icon: Clock,
      label: 'Preferred Time',
      value: school?.preferred_time,
      color: 'from-indigo-600/30 to-purple-600/30',
      copyable: false
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {schools.map((school) => (
        <div
          key={school.name}
          className="group relative bg-black backdrop-blur-md rounded-3xl border-2 border-gray-800/60 hover:border-blue-500/40 transition-all duration-500 hover:scale-[1.02] shadow-2xl hover:shadow-blue-500/10 hover:shadow-3xl overflow-hidden"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.05] via-purple-600/[0.02] to-cyan-600/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-900/40 rounded-3xl"></div>

          {/* Main card content */}
          <div className="relative z-10 p-7 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="relative shrink-0">
                <img
                  src={school.logo}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-gray-700/50 group-hover:ring-blue-500/30 transition-all duration-300 shadow-lg"
                  alt={`${school.name} logo`}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-blue-100 transition-colors duration-300">
                  {school.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  {/* Keep address truncated in header line */}
                  <span className="truncate">{school.address}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mb-6 flex-1">
              <div className="flex flex-wrap gap-2">
                <Links school={school} />
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => toggleCard(school.name)}
              aria-expanded={expandedCard === school.name}
              className="group w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gray-800/60 hover:bg-gray-700/70 border-2 border-gray-700/50 hover:border-blue-500/30 text-white text-sm font-semibold transition-all duration-300 mt-auto shadow-lg"
            >
              <span>
                {expandedCard === school.name ? 'Hide Details' : 'View Details'}
              </span>
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${
                  expandedCard === school.name ? 'rotate-90' : ''
                }`}
              />
            </button>

            {/* Expanded Details */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                expandedCard === school.name
                  ? 'max-h-[60vh] opacity-100 mt-6'
                  : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              {/* Scrollable content so the last row is always reachable */}
              <div className="space-y-4 overflow-y-auto pr-1">
                {infoItems(school).map((item, index) => (
                  item.value && (
                    <div
                      key={index}
                      className={`relative p-4 rounded-2xl bg-gradient-to-r ${item.color} backdrop-blur-sm border-2 border-gray-700/40 hover:border-gray-600/50 transition-all duration-300 shadow-lg`}
                    >
                      {item.copyable && (
                        <button
                          onClick={() => copyToClipboard(item.value, `${school.name}-${item.label}`)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700/70 border border-gray-600/40 hover:border-blue-500/40 transition-all duration-300 shadow-md"
                          title={`Copy ${item.label}`}
                        >
                          {copiedItems[`${school.name}-${item.label}`] ? (
                            <Check className="h-3.5 w-3.5 text-green-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-gray-300" />
                          )}
                        </button>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-xl bg-gray-800/50 shadow-md shrink-0">
                          <item.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                            {item.label}
                          </div>
                          {/* Wrap long content instead of truncating */}
                          <div className="text-sm font-medium text-white break-words whitespace-normal">
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
      ))}
    </div>
  )
}
