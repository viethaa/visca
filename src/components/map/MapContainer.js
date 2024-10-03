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

export default function MapContainer({ schools }) {
  const [open, setOpen] = useState(false)
  const [school, setSchool] = useState({})

  console.log(school)

  return (
    <div className='relative'>
      <Map
        markers={schools.map((school) => ({
          location: [school.longitude, school.latitude],
          pin: '/pin.png',
          logo: school.logo,
          name: school.name,
        }))}
        setOpen={setOpen}
        setSchool={setSchool}
        schools={schools}
      />
      <InfoSheet open={open} setOpen={setOpen} school={school} />
    </div>
  )
}
