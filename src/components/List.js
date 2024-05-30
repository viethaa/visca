import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function List({ schools }) {
  return (
    <Accordion type='multiple' collapsible className='w-full'>
      {schools.map((school) => (
        <AccordionItem value={school.school_name}>
          <AccordionTrigger className={'text-left'}>
            {school.school_name}
          </AccordionTrigger>
          <AccordionContent>
            <div className='grid grid-cols-3 gap-4 text-sm'>
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
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
