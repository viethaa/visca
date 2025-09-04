import React from 'react'
import { ExternalLink, User, Calendar, Globe } from 'lucide-react'

export default function Links({ school }) {
  const links = [
    {
      key: 'profile',
      url: school?.profile,
      icon: User,
      label: 'Profile',
      color: 'hover:bg-blue-600/20 hover:border-blue-500/40'
    },
    {
      key: 'website',
      url: school?.website,
      icon: Globe,
      label: 'Website',
      color: 'hover:bg-green-600/20 hover:border-green-500/40'
    },
    {
      key: 'calendar',
      url: school?.calendar,
      icon: Calendar,
      label: 'Calendar',
      color: 'hover:bg-purple-600/20 hover:border-purple-500/40'
    }
  ]

  const validLinks = links.filter(link => link.url && link.url.trim() !== '')

  if (validLinks.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      {/* Grid container for consistent alignment - always shows 3 columns */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {/* Always render 3 slots for perfect alignment */}
        {[0, 1, 2].map((index) => {
          const link = validLinks[index]

          if (link) {
            return (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-center px-3 py-2 ${link.bgColor} ${link.hoverColor} border ${link.borderColor} ${link.hoverBorderColor} rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 backdrop-blur-sm min-h-[36px]`}
                title={`Visit ${school.name} ${link.label}`}
              >
                {/* Just the text label - no icons */}
                <span className={`text-xs font-semibold ${link.textColor} transition-colors duration-300 text-center leading-tight`}>
                  {link.label}
                </span>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            )
          } else {
            // Empty placeholder to maintain grid alignment
            return (
              <div key={`empty-${index}`} className="min-h-[36px] opacity-0 pointer-events-none">
                <div className="h-full w-full rounded-lg"></div>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}
