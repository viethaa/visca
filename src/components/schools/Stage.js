import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import Header from '../layout/Header'
import { SchoolLogo } from '../home/Directory'
import { glideTo } from '../ScrollCues'
import { cn } from '@/lib/utils'
import { districtOf } from '@/lib/schools'

const PHOTO_MS = 5500
const EASE = [0.16, 1, 0.3, 1]

/*
  School page opener: an inset rounded stage that is also the photo carousel.
  Photos crossfade with a slow zoom; thin segments show where you are and fill over time.
  Broken photos are skipped; with none left, the stage shows the school's logo.
*/
export default function Stage({ school }) {
  const reduce = useReducedMotion()
  const [failed, setFailed] = useState(() => new Set())
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const photos = useMemo(() => school.pics.filter((src) => !failed.has(src)), [school.pics, failed])
  const count = photos.length
  const i = count ? index % count : 0
  const src = photos[i]

  useEffect(() => setIndex(0), [school.id])
  useEffect(() => {
    if (reduce || paused || count < 2) return
    const t = setTimeout(() => setIndex((n) => (n + 1) % count), PHOTO_MS)
    return () => clearTimeout(t)
  }, [i, reduce, paused, count])

  const go = (d) => setIndex((((i + d) % count) + count) % count)

  return (
    <div id='top' className='band-dark p-2 md:p-3'>
      <section
        className='relative isolate flex min-h-[calc(92svh-1rem)] flex-col overflow-hidden rounded-[22px] [clip-path:inset(0_round_22px)] md:min-h-[calc(100svh-1.5rem)] md:rounded-[28px] md:[clip-path:inset(0_round_28px)]'
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-roledescription='carousel'
        aria-label={`${school.name} photos`}
      >
        <div className='absolute inset-0 -z-10 bg-abyss'>
          {src ? (
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
                  transition={{ duration: reduce ? 0 : PHOTO_MS / 1000 + 1.5, ease: 'linear' }}
                >
                  <Image
                    src={src}
                    alt={`${school.name}, photo ${i + 1} of ${count}`}
                    fill
                    priority={i === 0}
                    quality={85}
                    sizes='100vw'
                    className='object-cover'
                    onError={() => setFailed((prev) => new Set(prev).add(src))}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className='dots absolute inset-0 grid place-items-center'>
              <SchoolLogo school={school} size='h-24 w-24' />
            </div>
          )}
          <div className='absolute inset-0 bg-gradient-to-t from-[#07120f]/90 via-[#07120f]/20 to-[#07120f]/45' />
        </div>

        <Header overlay back={{ href: '/#schools', label: 'Back to all schools' }} />

        <div className='wrap relative mt-auto flex flex-col gap-8 pb-10 pt-40 text-white md:flex-row md:items-end md:justify-between md:pb-14'>
          <div className='min-w-0'>
            {/* Logo and area on one line, so the name below gets the full width */}
            <div className='flex items-center gap-3'>
              <SchoolLogo school={school} size='h-11 w-11 rounded-xl' />
              <a
                href='#location'
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById('location')
                  if (el) glideTo(el.getBoundingClientRect().top + window.scrollY - 40)
                }}
                className='inline-flex h-11 min-w-0 items-center gap-1.5 rounded-full border border-white/15 bg-black/20 px-4 text-[14px] text-white/85 backdrop-blur-md transition-colors hover:border-white/40'
              >
                <MapPin className='h-3.5 w-3.5 shrink-0 text-white/60' strokeWidth={1.75} />
                <span className='truncate'>{districtOf(school.address)}</span>
              </a>
            </div>
            <h1
              className={cn(
                't-display mt-6 max-w-[20ch] animate-rise text-balance md:leading-[1.02]',
                // Long names step down a size so they stay on two lines
                school.name.length > 24 ? 'md:text-[3.75rem]' : 'md:text-[4.75rem]'
              )}
            >
              {school.name}
            </h1>
          </div>

          {count > 1 && (
            <div className='flex shrink-0 items-center gap-5 md:pb-3'>
              {/* One thin segment per photo; the current one fills over its time on screen */}
              <div className='flex items-center gap-1.5' role='group' aria-label='Choose photo'>
                {photos.map((p, n) => (
                  <button
                    key={p}
                    type='button'
                    onClick={() => setIndex(n)}
                    aria-label={`Show photo ${n + 1}`}
                    aria-current={n === i ? 'true' : undefined}
                    className='group py-3'
                  >
                    <span className='relative block h-0.5 w-7 overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/45 md:w-9'>
                      {n === i && (
                        <motion.span
                          key={`${p}-${paused}`}
                          className='absolute inset-y-0 left-0 bg-white'
                          initial={{ width: reduce || paused ? '100%' : '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: reduce || paused ? 0 : PHOTO_MS / 1000, ease: 'linear' }}
                        />
                      )}
                      {n < i && <span className='absolute inset-0 bg-white/70' />}
                    </span>
                  </button>
                ))}
              </div>
              <div className='flex gap-2'>
                {[
                  { d: -1, Icon: ArrowLeft, label: 'Previous photo' },
                  { d: 1, Icon: ArrowRight, label: 'Next photo' },
                ].map(({ d, Icon, label }) => (
                  <button
                    key={label}
                    type='button'
                    onClick={() => go(d)}
                    aria-label={label}
                    className={cn(
                      'grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white backdrop-blur-sm transition-colors',
                      'hover:border-white hover:bg-white hover:text-abyss',
                    )}
                  >
                    <Icon className='h-4 w-4' strokeWidth={1.75} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
