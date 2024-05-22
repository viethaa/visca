import React from 'react'

export default function Links({ school }) {
  const links = [
    {
      name: 'Profile',
      href: school.school_profile,
    },
    {
      name: 'Website',
      href: school.school_website,
    },
    {
      name: 'Calendar',
      href: school.calendar,
    },
  ]

  return links.map((link) => (
    <a
      href={link.href}
      target='_blank'
      className='flex gap-0.5 hover:underline underline-offset-2 flex-row items-center hover:text-black'
      key={link.name}
    >
      {link.name}{' '}
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 16 16'
        fill='currentColor'
        className='w-4 h-4'
      >
        <path d='M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z' />
        <path d='M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z' />
      </svg>
    </a>
  ))
}
