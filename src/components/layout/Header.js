import React from 'react'

export default function Header() {
  return (
    <header class='bg-slate-800 text-white font-sans p-4'>
      <div class='flex items-center justify-end'>
        <div class='flex gap-8'>
          <a href='/'>Home</a>
          <a href='/contact'>Contact Directory</a>
        </div>
      </div>
      <div class='text-2xl md:text-4xl max-w-2xl mx-auto p-4 sm:p-8 text-center'>
        <h1 class='font-bold'>
          Counselor Contacts of International Schools in Hanoi for University
          Visits
        </h1>
      </div>
    </header>
  )
}
