import React, { useState } from 'react'
import Map from './Map'
import { Dialog } from '@headlessui/react'
import data from '@/data.json'
import Links from './Links'
import { InfoSheet } from './InfoSheet'

const links = [
  {
    name: 'Profile',
    href: '#',
  },
  {
    name: 'Website',
    href: '#',
  },
  {
    name: 'Calendar',
    href: '#',
  },
]

export default function MapContainer() {
  const [open, setOpen] = useState(false)
  const [school, setSchool] = useState({})

  return (
    <div className='relative px-4 sm:px-8'>
      <Map
        markers={data.schools.map((school) => ({
          location: [school.longitude, school.latitude],
          pin: '/pin.png',
          logo_url: school.logo_url,
          name: school.school_name,
        }))}
        setOpen={setOpen}
        setSchool={setSchool}
        schools={data.schools}
      />
      <InfoSheet open={open} setOpen={setOpen} school={school} />
      {/* <Dialog
        className='fixed inset-0 flex items-center justify-center bg-black/70'
        open={open}
        onClose={() => setOpen(false)}
      >
        <Dialog.Panel className='bg-white min-w-[480px] gap-4 flex flex-col p-6 rounded-lg leading-none relative'>
          <div>
            <Dialog.Title className='text-lg font-semibold whitespace-nowrap leading-none tracking-tight'>
              {school?.school_name}
            </Dialog.Title>
            <h3 className='text-sm text-gray-500 mt-1'>
              {school?.school_address}
            </h3>
          </div>
          <div className='grid gap-4 text-sm'>
            <div className='grid grid-cols-2 gap-3 text-sm'>
              <div className='flex flex-col'>
                <dt className='font-semibold'>Counselor</dt>
                <dd>{school?.counselor_name}</dd>
              </div>
              <div className='flex flex-col '>
                <dt className='font-semibold'>Email</dt>
                <dd>{school?.counselor_email}</dd>
              </div>
              <div className='flex flex-col '>
                <dt className='font-semibold'>Phone</dt>
                <dd>{school?.counselor_phone}</dd>
              </div>
              <div className='flex flex-col '>
                <dt className='font-semibold'>Contact Point</dt>
                <dd>{school?.contact_point}</dd>
              </div>
              <div className='flex flex-col '>
                <dt className='font-semibold'>Preferred time</dt>
                <dd>{school?.preferred_time}</dd>
              </div>
            </div>
            <div className='font-semibold flex flex-row gap-4 text-sm'>
              <Links school={school} />
            </div>
          </div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='w-4 h-4 absolute right-4 top-4 text-gray-600 hover:text-gray-900 focus:text-gray-900 cursor-pointer transition-all'
            onClick={() => setOpen(false)}
          >
            <path d='M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z' />
          </svg>
        </Dialog.Panel>
      </Dialog> */}
    </div>
  )
}
