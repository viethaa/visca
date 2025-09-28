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
    <>
      {validLinks.map((link) => (
        <a
          key={link.key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative flex items-center justify-center px-3 py-2 bg-gray-800/40 border border-gray-600/40 hover:bg-gray-700/50 hover:border-gray-500/60 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 backdrop-blur-sm min-h-[36px]`}
          title={`Visit ${school.name} ${link.label}`}
        >
          {/* Just the text label - no icons */}
          <span className={`text-xs font-semibold text-white transition-colors duration-300 text-center leading-tight`}>
            {link.label}
          </span>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      ))}
    </>
  )
}
