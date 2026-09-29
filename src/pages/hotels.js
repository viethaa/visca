import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Showcase from '@/components/hotels/Showcase'
import { ScrollProgress, useSectionSnap } from '@/components/ScrollCues'

const SNAP_IDS = ['showcase', 'hotel-list']
import { FooterNote } from '@/components/layout/Footer'
import { Reveal, Sheet } from '@/components/Reveal'
import { HOTELS, HOTEL_AREAS, directionsUrl } from '@/lib/hotels'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1]

// Large preview of the selected hotel: photo with a thumbnail strip, facts and actions
function Preview({ hotel }) {
  const [photo, setPhoto] = useState(0)
  useEffect(() => setPhoto(0), [hotel.id])
  const photos = hotel.images.slice(0, 4)

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className='relative aspect-[4/3] overflow-hidden rounded-[22px] bg-mist'>
        <AnimatePresence initial={false}>
          <motion.div
            key={photos[photo]}
            className='absolute inset-0'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={photos[photo]}
              alt={`${hotel.name}, photo ${photo + 1}`}
              fill
              sizes='(min-width: 1024px) 640px, 100vw'
              className='object-cover'
            />
          </motion.div>
        </AnimatePresence>
        {hotel.credit && photo === 0 && (
          <p className='absolute bottom-3 right-4 font-mono text-[10px] text-white/70'>{hotel.credit}</p>
        )}
      </div>

      {photos.length > 1 && (
        <div className='mt-3 grid grid-cols-4 gap-3' role='group' aria-label='Photos'>
          {photos.map((src, i) => (
            <button
              key={src}
              onClick={() => setPhoto(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={photo === i}
              className={cn(
                'relative aspect-[4/3] overflow-hidden rounded-xl transition-opacity',
                photo === i ? 'opacity-100 ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'opacity-60 hover:opacity-100'
              )}
            >
              <Image src={src} alt='' fill sizes='160px' className='object-cover' />
            </button>
          ))}
        </div>
      )}

      <div className='mt-8'>
        <p className='font-mono text-[14px] text-muted'>{hotel.area}</p>
        <h2 className='t-heading mt-2'>{hotel.name}</h2>
        <p className='mt-4 max-w-[52ch] text-muted'>{hotel.description}</p>
      </div>

      <dl className='mt-8 grid gap-x-8 border-t border-line sm:grid-cols-3'>
        {[
          ['Per night', hotel.priceRange],
          ['Phone', hotel.phone],
          ['Address', hotel.address],
        ].map(([k, v]) => (
          <div key={k} className='border-b border-line py-4 sm:border-b-0'>
            <dt className='font-mono text-[13px] text-muted'>{k}</dt>
            <dd className='mt-1 text-[15px] leading-[1.4]'>
              {k === 'Phone' ? (
                <a href={`tel:${v.replace(/[^\d+]/g, '')}`} className='hover:underline'>
                  {v}
                </a>
              ) : (
                v
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className='mt-6 flex flex-wrap items-center gap-x-8 gap-y-4'>
        <a
          href={hotel.website}
          target='_blank'
          rel='noopener noreferrer'
          className='group inline-flex h-12 items-center gap-3 rounded-full bg-abyss px-6 text-white transition-colors hover:bg-[#2c3d3e]'
        >
          Book a room
          <ArrowUpRight
            className='h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
            strokeWidth={1.75}
          />
        </a>
        <a href={directionsUrl(hotel.address)} target='_blank' rel='noopener noreferrer' className='link text-ink'>
          Directions
        </a>
        <Link href={`/map?hotel=${hotel.id}`} className='link text-ink'>
          Show on map
        </Link>
      </div>
    </motion.article>
  )
}

export default function Hotels() {
  useSectionSnap(SNAP_IDS)
  const [area, setArea] = useState(HOTEL_AREAS[0])
  const shown = area === HOTEL_AREAS[0] ? HOTELS : HOTELS.filter((h) => h.area === area)
  const [selectedId, setSelectedId] = useState(HOTELS[0].id)
  const [showIndex, setShowIndex] = useState(0)
  const selected = shown.find((h) => h.id === selectedId) || shown[0]

  return (
    <>
      <Head>
        <title>Hotels | VISCA</title>
        <meta name='description' content='Hotels in Hanoi for university representatives visiting VISCA member schools.' />
      </Head>

      <ScrollProgress />
      <main id='main'>
        <Showcase
          index={showIndex}
          setIndex={setShowIndex}
        />

        <Sheet id='hotel-list' grow={false} className='band-light pt-20 md:pt-28'>
          <div className='wrap'>
            {/* Area filter */}
            <Reveal className='flex flex-wrap gap-2' role='group' aria-label='Filter by area'>
              {HOTEL_AREAS.map((a) => {
                const on = a === area
                return (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    aria-pressed={on}
                    className={cn(
                      'rounded-full border px-4 py-2 text-[15px] transition-colors',
                      on ? 'border-ink bg-ink text-paper' : 'border-line text-muted hover:border-ink/40 hover:text-ink'
                    )}
                  >
                    {a}
                  </button>
                )
              })}
            </Reveal>

            <div className='mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16'>
              {/* Index of hotels */}
              <ol className='border-t border-line lg:col-span-5'>
                {shown.map((h) => {
                  const on = selected?.id === h.id
                  const n = HOTELS.findIndex((x) => x.id === h.id) + 1
                  return (
                    <li key={h.id} className='border-b border-line'>
                      {/* Desktop: selects the preview */}
                      <button
                        onClick={() => setSelectedId(h.id)}
                        aria-current={on ? 'true' : undefined}
                        className='group hidden w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 text-left lg:grid'
                      >
                        <span className={cn('font-mono text-[13px] tabular-nums', on ? 'text-ink' : 'text-muted')}>
                          {String(n).padStart(2, '0')}
                        </span>
                        <span className='min-w-0'>
                          <span
                            className={cn(
                              'block text-[1.25rem] leading-[1.2] tracking-[-0.01em] transition-colors',
                              on ? 'text-ink' : 'text-muted group-hover:text-ink'
                            )}
                          >
                            {h.name}
                          </span>
                          <span className='mt-1 block font-mono text-[13px] text-muted'>{h.area}</span>
                        </span>
                        <ArrowRight
                          className={cn(
                            'h-4 w-4 transition-all duration-300',
                            on
                              ? 'translate-x-0 text-ink opacity-100'
                              : '-translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                          )}
                          strokeWidth={1.75}
                        />
                      </button>

                      {/* Phones and tablets: every hotel shows in full */}
                      <div className='py-8 lg:hidden'>
                        <Preview hotel={h} />
                      </div>
                    </li>
                  )
                })}
              </ol>

              {/* Sticky preview (desktop) */}
              <div className='hidden lg:col-span-7 lg:block'>
                <div className='sticky top-8'>
                  <AnimatePresence mode='wait'>
                    {selected && <Preview key={selected.id} hotel={selected} />}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <FooterNote className='mt-20 md:mt-28' />
          </div>
        </Sheet>
      </main>
    </>
  )
}
