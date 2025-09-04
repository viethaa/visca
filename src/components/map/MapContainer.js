import React, { useState } from 'react'
import Map from './Map'
import { Dialog } from '@headlessui/react'
import data from '@/data.json'
import { InfoSheet } from './InfoSheet'
import { PlaceInfoSheet } from './PlaceInfoSheet'

export default function MapContainer({ schools }) {
  const [schoolOpen, setSchoolOpen] = useState(false)
  const [school, setSchool] = useState({})
  const [placeOpen, setPlaceOpen] = useState(false)
  const [place, setPlace] = useState({})

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
        places={data.places}
        setSchoolOpen={setSchoolOpen}
        setSchool={setSchool}
        setPlaceOpen={setPlaceOpen}
        setPlace={setPlace}
        schools={schools}
        hotels={data.hotels}
      />
      <InfoSheet open={schoolOpen} setOpen={setSchoolOpen} school={school} />
      <PlaceInfoSheet open={placeOpen} setOpen={setPlaceOpen} place={place} />
    </div>
  )
}
