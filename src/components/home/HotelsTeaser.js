import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Reveal, Sheet } from '../Reveal'
import { FooterNote } from '../layout/Footer'
import { HOTELS } from '@/lib/hotels'
import { cn } from '@/lib/utils'

const N = HOTELS.length
const SLIDE = { duration: 1.1, ease: [0.65, 0, 0.35, 1] }

// Position of hotel i relative to the one in the middle: 0 = middle, -1 left, 1 right
const slotOf = (i, current) => {
  let d = (((i - current) % N) + N) % N
  if (d > N / 2) d -= N
  return d
}

// Each slot has a fixed place on the track, so every move is one continuous glide
const SLOT_STYLE = (slot) => {
  const visible = Math.abs(slot) <= 1
  return {
    x: `${-50 + Math.max(-2, Math.min(2, slot)) * 106}%`,
    scale: slot === 0 ? 1 : visible ? 0.84 : 0.72,
    opacity: slot === 0 ? 1 : visible ? 0.9 : 0,
    zIndex: slot === 0 ? 3 : visible ? 2 : 1,
  }
}

function Card({ hotel, featured }) {
  return (
    <div className='group relative aspect-[3/4] overflow-hidden rounded-[26px] bg-abyss'>
      <Image
        src={hotel.exterior || hotel.images[0]}
        alt={`${hotel.name} exterior`}
        fill
        sizes='(min-width: 768px) 420px, 80vw'
        className='object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]'
      />
      {/* Soft shade for legible text, and a fine inner frame */}
      <div className='absolute inset-0 bg-gradient-to-t from-[#0b1a17]/85 via-[#0b1a17]/10 to-transparent' />
      <div className='pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-white/15' />

      {hotel.credit && <p className='absolute right-4 top-4 font-mono text-[10px] text-white/55'>{hotel.credit}</p>}

      <div className='absolute inset-x-3 bottom-3 rounded-[18px] border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md'>
        <div className='flex items-end justify-between gap-4'>
          <div className='min-w-0'>
            <p className='font-mono text-[12px] uppercase tracking-[0.04em] text-white/70'>{hotel.area}</p>
            <h3 className='mt-1.5 text-[1.3rem] leading-[1.15] tracking-[-0.01em]'>{hotel.name}</h3>
          </div>
          <span
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors duration-500',
              featured ? 'bg-signal text-abyss' : 'bg-white/15 text-white'
            )}
            aria-hidden='true'
          >
            <ArrowUpRight className='h-4 w-4' strokeWidth={1.75} />
          </span>
        </div>
        <AnimatePresence initial={false}>
          {featured && (
            <motion.p
              key='desc'
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className='hidden overflow-hidden text-[14px] leading-[1.4] text-white/75 md:block'
            >
              <span className='block pt-3'>{hotel.description.split('. ')[0].replace(/\.$/, '')}.</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function HotelsTeaser() {
  const reduce = useReducedMotion()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const go = (d) => setCurrent((c) => (((c + d) % N) + N) % N)

  useEffect(() => {
    if (reduce || paused) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % N), 4200)
    return () => clearInterval(t)
  }, [reduce, paused])

  return (
    <Sheet id='stay' grow={false} className='band-light overflow-hidden pt-20 md:pt-28'>
      <div className='wrap'>
        <Reveal as='p' className='text-center font-mono text-[17px] text-muted'>
          Choose Your Hotel
        </Reveal>
        <Reveal as='h2' delay={0.06} className='t-display mx-auto mt-4 max-w-[14ch] text-center'>
          Sleep close to the schools.
        </Reveal>

        {/* Track: a centered spacer sets the height; cards glide between fixed slots */}
        <div
          className='relative mt-14 md:mt-16'
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          role='region'
          aria-roledescription='carousel'
          aria-label='Hotels near member schools'
        >
          <div className='invisible mx-auto aspect-[3/4] w-[74%] sm:w-[46%] md:w-[34%]' aria-hidden='true' />
          {HOTELS.map((hotel, i) => {
            const slot = slotOf(i, current)
            const featured = slot === 0
            const hidden = Math.abs(slot) > 1
            return (
              <motion.div
                key={hotel.id}
                initial={false}
                animate={SLOT_STYLE(slot)}
                transition={reduce ? { duration: 0 } : SLIDE}
                className={cn('absolute left-1/2 top-0 w-[74%] sm:w-[46%] md:w-[34%]', hidden && 'pointer-events-none')}
                aria-hidden={hidden || undefined}
              >
                {featured ? (
                  <Link href='/hotels' aria-label={`${hotel.name}, see all hotels`} className='block'>
                    <Card hotel={hotel} featured />
                  </Link>
                ) : (
                  <button
                    type='button'
                    tabIndex={hidden ? -1 : 0}
                    onClick={() => go(slot)}
                    aria-label={`Show ${hotel.name}`}
                    className='block w-full text-left'
                  >
                    <Card hotel={hotel} />
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className='mt-12 flex justify-center'>
          {/* Minimal text link: underline draws in on hover */}
          <Link href='/hotels' className='group inline-flex items-center gap-2 text-[17px] text-ink'>
            <span className='relative pb-1'>
              See hotel details
              <span className='absolute inset-x-0 bottom-0 h-px bg-ink/25' />
              <span className='absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-out group-hover:scale-x-100' />
            </span>
            <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' strokeWidth={1.5} />
          </Link>
        </div>

        <FooterNote className='mt-20 md:mt-24' />
      </div>
    </Sheet>
  )
}
