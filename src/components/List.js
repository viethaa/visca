import React, { useState } from 'react'
import { MapPin, User, Mail, Phone, MessageCircle, Clock, ChevronRight } from 'lucide-react'
import Links from './map/Links'

export default function List({ schools }) {
  const [expandedCard, setExpandedCard] = useState(null)

  const toggleCard = (schoolName) => {
    setExpandedCard(expandedCard === schoolName ? null : schoolName)
  }

  const infoItems = (school) => [
    { icon: User, label: 'Counselor', value: school?.counselor_name, color: 'from-blue-500/20 to-cyan-500/20' },
    { icon: Mail, label: 'Email', value: school?.counselor_email, color: 'from-purple-500/20 to-pink-500/20' },
    { icon: Phone, label: 'Phone', value: school?.counselor_phone, color: 'from-emerald-500/20 to-teal-500/20' },
    { icon: MessageCircle, label: 'Contact Point', value: school?.contact_point, color: 'from-orange-500/20 to-red-500/20' },
    { icon: Clock, label: 'Preferred Time', value: school?.preferred_time, color: 'from-indigo-500/20 to-purple-500/20' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {schools.map((school) => (
        <div
          key={school.name}
          className="group relative bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] shadow-xl hover:shadow-2xl overflow-hidden"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

          {/* Main card content */}
          <div className="relative z-10 p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="relative">
                <img
                  src={school.logo}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-300"
                  alt={`${school.name} logo`}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white leading-tight mb-2 group-hover:text-blue-100 transition-colors duration-300">
                  {school.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="truncate">{school.address}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <Links school={school} />
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => toggleCard(school.name)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-300 group/btn"
            >
              <span>
                {expandedCard === school.name ? 'Hide Details' : 'View Details'}
              </span>
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 ${
                  expandedCard === school.name ? 'rotate-90' : ''
                }`}
              />
            </button>

            {/* Expanded Details */}
            <div className={`overflow-hidden transition-all duration-500 ${
              expandedCard === school.name ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
            }`}>
              <div className="space-y-3">
                {infoItems(school).map((item, index) => (
                  item.value && (
                    <div
                      key={index}
                      className={`p-3 rounded-xl bg-gradient-to-r ${item.color} backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/10">
                          <item.icon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-300 uppercase tracking-wide mb-1">
                            {item.label}
                          </div>
                          <div className="text-sm text-white truncate">
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

          {/* Decorative elements */}
        </div>
      ))}
    </div>
  )
}
