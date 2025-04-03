import Link from 'next/link'
import React from 'react'
import ContactDialog from '../ContactDialog'

export default function Page() {
  return (
    <>
      <header
        className='relative bg-slate-800 text-white font-sans'
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/04/23/14/16/water-5082682_1280.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='bg-black absolute w-full h-full opacity-30 z-0'></div>
        <div className='flex items-center justify-between relative z-10 p-4'>
          <div className='p-2'>
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/2000px-Flag_of_Vietnam.svg.png'
              alt='Vietnam Flag'
              className='w-12 sm:w-16 object-cover'
            />
          </div>
          <div className='flex gap-4'>
            <Link
              className='bg-gray-700 px-3 py-1.5 rounded hover:bg-gray-500 flex items-center justify-center'
              href='/'
            >
              Home
            </Link>
            <ContactDialog />
          </div>
        </div>
        <div className='flex z-10 relative flex-col items-center justify-center my-8 gap-4'>
          <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center max-w-3xl'>
            Vietnam International School Counselors Association - Hanoi
          </h1>
        </div>
      </header>
    </>
  )
}
