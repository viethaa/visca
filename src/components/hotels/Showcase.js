import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Header from '../layout/Header'
import { NextCue } from '../ScrollCues'
import { HOTELS, PHOTO_CREDITS } from '@/lib/hotels'

const HOTEL_MS = 5500
const EASE = [0.16, 1, 0.3, 1]

/*
  Hotels page opener: an inset rounded stage showing each hotel's main exterior
  photo (crossfade + slow zoom), advancing hotel by hotel, with a single Next hotel button.
*/
export default function Showcase({ index, setIndex }) {
  const reduce = useReducedMotion()
  const hotel = HOTELS[index]
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduce || paused) return
    const t = setTimeout(() => setIndex((index + 1) % HOTELS.length), HOTEL_MS)
    return () => clearTimeout(t)
  }, [index, reduce, paused, setIndex])

  const go = (d) => setIndex((index + d + HOTELS.length) % HOTELS.length)
  const src = hotel.exterior

  return (
    <div id='showcase' className='band-dark p-2 md:p-3'>
      <section
        className='relative isolate flex min-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[22px] [clip-path:inset(0_round_22px)] md:min-h-[calc(100svh-1.5rem)] md:rounded-[28px] md:[clip-path:inset(0_round_28px)]'
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-roledescription='carousel'
        aria-label='Recommended hotels'
      >
        {/* Photo stage */}
        <div className='absolute inset-0 -z-10 bg-abyss'>
          <AnimatePresence initial={false}>
            <motion.div
              key={src}
              className='absolute inset-0'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              <motion.div
                className='absolute inset-0'
                initial={{ scale: reduce ? 1 : 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: reduce ? 0 : HOTEL_MS / 1000 + 1.5, ease: 'linear' }}
              >
                <Image
                  src={src}
                  alt={`${hotel.name} exterior`}
                  fill
                  priority
                  quality={90}
                  sizes='100vw'
                  className='object-cover'
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <div className='absolute inset-0 bg-gradient-to-t from-[#07120f]/90 via-[#07120f]/25 to-[#07120f]/45' />
        </div>

        <Header overlay />

        <div className='wrap relative mt-auto pb-12 pt-40 text-white md:pb-14'>
          <p className='font-mono text-[18px] text-white/80'>Our Recommended Hotels</p>

          <div className='flex flex-col gap-8 md:flex-row md:items-end md:justify-between'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <h1 className='t-display mt-4 max-w-[16ch] md:text-[4.5rem] md:leading-[1.02]'>{hotel.name}</h1>
                <p className='mt-4 font-mono text-[14px] text-white/80'>{hotel.area}</p>
                <p className='mt-2 max-w-[46ch] text-white/75'>
                  {hotel.description.split('. ')[0].replace(/\.$/, '')}.
                </p>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => go(1)}
              aria-label='Next hotel'
              className='group inline-flex h-12 shrink-0 items-center gap-3 self-start rounded-full bg-white pl-6 pr-5 text-[15px] text-abyss transition-colors hover:bg-white/85 md:self-auto'
            >
              Next hotel
              <ArrowRight
                className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1'
                strokeWidth={1.75}
              />
            </button>
          </div>
        </div>

        {PHOTO_CREDITS[src] && (
          <p className='absolute bottom-3 right-5 font-mono text-[10px] text-white/45'>{PHOTO_CREDITS[src]}</p>
        )}
        <NextCue target='hotel-list' className='absolute bottom-5 left-1/2 hidden -translate-x-1/2 md:grid' />
      </section>
    </div>
  )
}
