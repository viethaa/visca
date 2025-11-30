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

  // Define the 4 featured hotels for the map
  const featuredHotels = [
    {
      name: "JW Marriott Hotel Hanoi",
      address: "8 Đỗ Đức Dục, Mễ Trì, Nam Từ Liêm, Hà Nội, Vietnam",
      latitude: 21.0025056,
      longitude: 105.7620046,
      phone: "+84 024 3833 5588",
      icon: "/hotel.png",
      website: "https://www.marriott.com/en-us/hotels/hanjw-jw-marriott-hotel-hanoi/overview/"
    },
    {
      name: "Sheraton Hanoi Hotel",
      address: "K5 Nghi Tàm, 11 Xuân Diệu, Tây Hồ, Hà Nội, Vietnam",
      latitude: 21.0597,
      longitude: 105.8317,
      phone: "+84 024 3719 9000",
      icon: "/hotel.png",
      website: "https://www.marriott.com/en-us/hotels/hanhs-sheraton-hanoi-hotel/overview/"
    },
    {
      name: "InterContinental Hanoi Westlake",
      address: "5 Từ Hoa, Quảng An, Tây Hồ, Hà Nội, Vietnam",
      latitude: 21.0584,
      longitude: 105.8315,
      phone: "+84 024 6270 8888",
      icon: "/hotel.png",
      website: "https://hanoi.intercontinental.com/"
    },
    {
      name: "Lotte Hotel Hanoi",
      address: "54 Liễu Giai, Cống Vị, Ba Đình, Hà Nội, Vietnam",
      latitude: 21.0349,
      longitude: 105.8158,
      phone: "+84 024 3333 1000",
      icon: "/hotel.png",
      website: "https://www.lottehotel.com/hanoi-hotel/"
    }
  ]

  console.log(school)

  return (
    <div className='relative h-full w-full'>
      <Map
        markers={schools
          .filter((school) => school.latitude != null && school.longitude != null)
          .map((school) => ({
            location: [school.longitude, school.latitude],
            pin: '/pin.png',
            logo: (school.logo && typeof school.logo === 'string' && school.logo.trim() !== '') ? school.logo : null,
            name: school.name,
          }))}
        places={data.places}
        setSchoolOpen={setSchoolOpen}
        setSchool={setSchool}
        setPlaceOpen={setPlaceOpen}
        setPlace={setPlace}
        schools={schools}
        hotels={featuredHotels}
      />
      <InfoSheet open={schoolOpen} setOpen={setSchoolOpen} school={school} />
      <PlaceInfoSheet open={placeOpen} setOpen={setPlaceOpen} place={place} />
    </div>
  )
}
