import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Links from './Links'
import { MapPin } from 'lucide-react'

export function InfoSheet({ open, setOpen, school }) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className={'text-left overflow-y-scroll'}>
        <SheetHeader>
          <img src={school.logo} className='h-10 w-10'></img>
          <div>
            <SheetTitle className={'pr-4 leading-6 mb-1 text-left'}>
              {school.name}
            </SheetTitle>
            <SheetDescription className={'flex gap-0.5 text-left'}>
              <MapPin height={16} width={16} className='relative top-0.5' />
              {school.address}
            </SheetDescription>
          </div>
        </SheetHeader>
        <div className='grid gap-4 mt-4'>
          <div className='grid grid-cols-1 gap-4 text-sm'>
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
          <div>
            <img className='rounded-md mt-4' src={school.pic} />
          </div>
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
