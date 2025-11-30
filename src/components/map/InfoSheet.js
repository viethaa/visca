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
import { MapPin, Phone, MessageCircle, Clock, X } from 'lucide-react'

// Hardcoded school logos
const SCHOOL_LOGOS = {
  'Concordia International School Hanoi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxFlfBXhFgeyiKsFJ0Kp20Jv7mk6qMItVqhg&s',
  'St. Paul American School Hanoi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTUhqW3ztSI5_DLUBwewAjuAhN8pjoNHqF9ZZk2O8sFempxs81Wh7XCfhaXjGOQWZhOU8&usqp=CAU',
  'British Vietnamese International School Hanoi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_b_K7kQMRwceuTgHI6_3aNvsFZkKTXk0yHg&s',
  'UNIS Hanoi': 'https://avatars.githubusercontent.com/u/8739604?s=100',
  'TH School': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCcDxdXMTbom7_7x6DBNdRFJ5CPC0hK7C1-3aNbY4GQQnM9h8p_L7HanegjqH95QM7UwY&usqp=CAU',
  'British International School Hanoi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzw8VF0MhMua8ZR3I-dCJ5jrn4z4jjz3FKaA&s',
  'The Olympia Schools': 'https://theolympiaschools.edu.vn/storage/favicon.png',
  'The Dewey Schools': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb88PR97WqVpcuxd6RiOiEWnMKEWAttf9f_g&s',
  'Delta Global School': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKGFw4cldcE6u0aRsYtAscux5EqSIx_tTQIlqkseT6ZYX-_mwm3AsZPbT9o2HuR7Y7vf0&usqp=CAU',
  'Hanoi International School': 'https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_2/v1690308110/hisvietnamcom/homfclrxcrpr1btxvsr3/tigercolortext_2.png',
  'Westlink International School': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc4pyuhM9E6F0_8v7IbI7Xeev4ZvuxSR7Inw&s'
}

export function InfoSheet({ open, setOpen, school }) {
  const logoUrl = SCHOOL_LOGOS[school?.name] || school?.logo
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
          {/* Logo */}
          {logoUrl && (
            <div className="flex justify-center">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-neutral-900/50 border border-white/20 shadow-lg">
                <img src={logoUrl} className='h-full w-full object-cover' alt={school.name} />
              </div>
            </div>
          )}

          {/* School Name */}
          <div>
            <SheetTitle className='text-2xl font-bold text-white text-center mb-3'>
              {school.name}
            </SheetTitle>

            {/* Address */}
            {school.address && (
              <div className='flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800/40 rounded-lg border border-white/10'>
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
                <span className="text-sm text-neutral-300">{school.address}</span>
              </div>
            )}
          </div>
        </SheetHeader>

        <div className='space-y-4 mt-6'>
          {/* Information Cards */}
          <div className='space-y-3'>
            {school?.counselor_phone && (
              <div className='p-4 rounded-lg bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-colors'>
                <div className='flex items-start gap-3'>
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                    <Phone className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <dt className='text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1'>Phone</dt>
                    <dd className='text-sm text-white'>{school.counselor_phone}</dd>
                  </div>
                </div>
              </div>
            )}

            {school?.preferred_time && (
              <div className='p-4 rounded-lg bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-colors'>
                <div className='flex items-start gap-3'>
                  <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                    <Clock className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <dt className='text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1'>Time Open</dt>
                    <dd className='text-sm text-white'>{school.preferred_time}</dd>
                  </div>
                </div>
              </div>
            )}

            {school?.contact_point && (
              <div className='p-4 rounded-lg bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-colors'>
                <div className='flex items-start gap-3'>
                  <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <MessageCircle className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <dt className='text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1'>Contact Point</dt>
                    <dd className='text-sm text-white break-words'>{school.contact_point}</dd>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* School Image */}
          {school.pic && (
            <div className='pt-4'>
              <div className='rounded-lg overflow-hidden border border-white/20 shadow-2xl'>
                <img className='w-full' src={school.pic} alt={school.name} />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
