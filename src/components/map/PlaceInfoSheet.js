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

export function PlaceInfoSheet({ open, setOpen, place }) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className={'text-left overflow-y-scroll'}>
        <SheetHeader>
          <img src={place?.icon} className='h-10 w-10'></img>
          <div>
            <SheetTitle className={'pr-4 leading-6 mb-1 text-left'}>
              {place?.name}
            </SheetTitle>
            <SheetDescription className={'flex gap-0.5 text-left'}>
              <MapPin height={16} width={16} className='relative top-0.5' />
              {place?.address}
            </SheetDescription>
          </div>
        </SheetHeader>
        <div className='grid gap-4 mt-4'>
          <div className='grid grid-cols-1 gap-4 text-sm'>
            <div className='flex flex-col'>
              <dt className='font-semibold'>Website</dt>
              <dd>
                <a
                  className='text-blue-700 hover:underline'
                  href={place?.website}
                  target='_blank'
                >
                  {place?.website}
                </a>
              </dd>
            </div>
            <div className='flex flex-col '>
              <dt className='font-semibold'>Phone</dt>
              <dd>{place?.phone}</dd>
            </div>
          </div>
          <div>
            <img className='rounded-md mt-4' src={place?.pic} />
          </div>
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
