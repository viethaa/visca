import React, { useState } from 'react'
import { MapPin, User, Mail, Phone, MessageCircle, Clock, ChevronRight, Copy, Check, Building } from 'lucide-react'
import Links from './Links'

export default function List({ schools }) {
  const [expandedCard, setExpandedCard] = useState(null)
  const [copiedItems, setCopiedItems] = useState({})

  const toggleCard = (schoolName) => {
    setExpandedCard(expandedCard === schoolName ? null : schoolName)
  }

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const infoItems = (school) => [
    {
      icon: User,
      label: 'Counselor',
      value: school?.counselor_name,
      color: 'from-blue-600/30 to-cyan-600/30',
      copyable: false,
      truncate: true
    },
    {
      icon: Mail,
      label: 'Email',
      value: school?.counselor_email,
      color: 'from-purple-600/30 to-pink-600/30',
      copyable: true,
      truncate: true
    },
    {
      icon: Phone,
      label: 'Phone',
      value: school?.counselor_phone,
      color: 'from-emerald-600/30 to-teal-600/30',
      copyable: false,
      truncate: true
    },
    {
      icon: MessageCircle,
      label: 'Contact Point',
      value: school?.contact_point,
      color: 'from-orange-600/30 to-red-600/30',
      copyable: true,
      truncate: true
    },
    {
      icon: Clock,
      label: 'Preferred Time',
      value: school?.preferred_time,
      color: 'from-indigo-600/30 to-purple-600/30',
      copyable: false,
      truncate: false
    }
  ]

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
