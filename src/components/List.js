import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MapPin } from 'lucide-react'
import Links from './map/Links'

export default function List({ schools }) {
  return (
    <Accordion type='multiple' collapsible className='w-full'>
      {schools.map((school) => (
        <AccordionItem key={school.name} value={school.name}>
          <AccordionTrigger className={'flex'}>
            <img src={school.logo} className='h-5 w-5' />
            {school.name}
          </AccordionTrigger>
          <AccordionContent>
            <div className={'mx-auto w-fit'}>
              <div className={'flex gap-0.5 text-center mb-4 text-gray-600'}>
                <MapPin height={16} width={16} className='relative top-0.5' />
                {school.address}
              </div>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm'>
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
            <div className='font-semibold justify-center flex flex-row flex-wrap gap-4 text-sm mt-4'>
              <Links school={school} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
