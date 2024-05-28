import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <header className='bg-slate-800 text-white font-sans p-4'>
      <div className='flex items-center justify-end'>
        <div className='flex gap-8'>
          <Link href='/'>Home</Link>
          <Link href='/contact'>Contact Directory</Link>
        </div>
      </div>
      <div className='text-2xl md:text-4xl max-w-2xl mx-auto p-4 sm:p-8 text-center'>
        <h1 className='font-bold'>
          Counselor Contacts of International Schools in Hanoi for University
          Visits
        </h1>
      </div>
    </header>
  )
}
