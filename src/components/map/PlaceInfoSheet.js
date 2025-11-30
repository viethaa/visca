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
import { MapPin, Globe, Phone, X } from 'lucide-react'

export function PlaceInfoSheet({ open, setOpen, place }) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='bg-gradient-to-br from-black via-neutral-950 to-black text-white border-l border-white/20 overflow-y-auto pt-20'>
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <SheetHeader className="space-y-4">
          {/* Icon */}
          {place?.icon && (
            <div className="flex justify-center">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-neutral-900/50 border border-white/20 shadow-lg p-4">
                <img src={place.icon} className='h-full w-full object-contain' alt={place.name} />
              </div>
            </div>
          )}

          {/* Place Name */}
          <div>
            <SheetTitle className='text-2xl font-bold text-white text-center mb-3'>
              {place?.name}
            </SheetTitle>

            {/* Address */}
            {place?.address && (
              <div className='flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800/40 rounded-lg border border-white/10'>
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
                <span className="text-sm text-neutral-300">{place.address}</span>
              </div>
            )}
          </div>
        </SheetHeader>

        <div className='space-y-4 mt-6'>
          {/* Information Cards */}
          <div className='space-y-3'>
            {place?.website && (
              <div className='p-4 rounded-lg bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-colors'>
                <div className='flex items-start gap-3'>
                  <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <Globe className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <dt className='text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1'>Website</dt>
                    <dd>
                      <a
                        className='text-blue-400 hover:text-blue-300 hover:underline text-sm break-all'
                        href={place.website}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {place.website}
                      </a>
                    </dd>
                  </div>
                </div>
              </div>
            )}

            {place?.phone && (
              <div className='p-4 rounded-lg bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-colors'>
                <div className='flex items-start gap-3'>
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                    <Phone className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <dt className='text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1'>Phone</dt>
                    <dd className='text-sm text-white'>{place.phone}</dd>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Place Image */}
          {place?.pic && (
            <div className='pt-4'>
              <div className='rounded-lg overflow-hidden border border-white/20 shadow-2xl'>
                <img className='w-full' src={place.pic} alt={place.name} />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
