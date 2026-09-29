import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from 'lucide-react'
import { SchoolLogo, matchSchool } from '../home/Directory'
import { visitSlots, mailtoHref, districtOf } from '@/lib/schools'
import { HOTELS, directionsUrl } from '@/lib/hotels'
import { PLACES } from '@/lib/site'
import { cn } from '@/lib/utils'

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <div className='h-full w-full animate-pulse bg-mist' />,
})

const EASE = [0.16, 1, 0.3, 1]
const ALL = ['school', 'hotel', 'place']
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'school', label: 'Schools' },
  { key: 'hotel', label: 'Hotels' },
  { key: 'place', label: 'Places' },
]
const GROUP_LABEL = { school: 'Member schools', hotel: 'Hotels', place: 'Airport & center' }

const routeTo = (item) =>
  item.latitude != null
    ? `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`
    : directionsUrl(item.address)

function Thumb({ item }) {
  if (item.type === 'school') return <SchoolLogo school={item} size='h-10 w-10 rounded-xl' />
  return (
    <span className='relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white'>
      {item.type === 'hotel' ? (
        <Image src={item.exterior} alt='' fill sizes='40px' className='object-cover' />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.logo} alt='' className='h-6 w-6 object-contain' />
      )}
    </span>
  )
}

function Row({ item, onClick }) {
  return (
    <li className='border-b border-line last:border-0'>
      <button onClick={onClick} className='group flex w-full items-center gap-4 py-3 text-left'>
        <Thumb item={item} />
        <span className='min-w-0 flex-1'>
          <span className='block truncate text-[15px] leading-[1.3]'>{item.name}</span>
          <span className='mt-0.5 block truncate font-mono text-[12px] text-muted'>{item.subtitle}</span>
        </span>
        <ArrowRight
          className='h-4 w-4 shrink-0 -translate-x-1 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-ink group-hover:opacity-100'
          strokeWidth={1.75}
        />
      </button>
    </li>
  )
}

function Fact({ label, children }) {
  return (
    <div className='border-t border-line py-4'>
      <dt className='font-mono text-[12px] text-muted'>{label}</dt>
      <dd className='mt-1.5 min-w-0 break-words text-[15px] leading-[1.4]'>{children}</dd>
    </div>
  )
}

function Detail({ item, onBack }) {
  const photo = item.type === 'school' ? item.pics?.[0] : item.type === 'hotel' ? item.exterior : null
  const slots = item.type === 'school' ? visitSlots(item) : []
  const emails = item.emails?.length ? item.emails : item.counselor_email ? [item.counselor_email] : []

  const primary =
    item.type === 'school'
      ? { href: `/schools/${item.id}`, label: 'School page', internal: true }
      : item.type === 'hotel'
        ? { href: item.website, label: 'Book a room' }
        : null

  return (
    <div className='px-5 pb-6 pt-4'>
      <button
        onClick={onBack}
        className='group inline-flex items-center gap-2 font-mono text-[13px] text-muted transition-colors hover:text-ink'
      >
        <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-0.5' strokeWidth={1.75} />
        All places
      </button>

      {photo && (
        <div className='relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl bg-mist'>
          <Image src={photo} alt='' fill sizes='360px' className='object-cover' />
        </div>
      )}

      <div className={cn('flex items-center gap-3', photo ? 'mt-5' : 'mt-4')}>
        {item.type === 'school' && <SchoolLogo school={item} size='h-9 w-9 rounded-lg' />}
        <p className='font-mono text-[13px] text-muted'>
          {item.type === 'school' ? districtOf(item.address) : item.type === 'hotel' ? item.area : 'Landmark'}
        </p>
      </div>
      <h2 className='mt-3 text-[1.6rem] leading-[1.15] tracking-[-0.02em]'>{item.name}</h2>

      <dl className='mt-5'>
        {item.type === 'school' && (
          <>
            <Fact label='Visit times'>
              {slots.length ? (
                <ul className='tabular-nums'>
                  {slots.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <span className='text-muted'>Ask the counselor</span>
              )}
            </Fact>
            {item.counselor_name && (
              <Fact label='Counselor'>
                {item.counselor_name}
                {emails.map((e) => (
                  <a key={e} href={`mailto:${e}`} className='link block break-all'>
                    {e}
                  </a>
                ))}
              </Fact>
            )}
          </>
        )}
        {item.type === 'hotel' && (
          <>
            <Fact label='Address'>{item.address}</Fact>
            {item.phone && (
              <Fact label='Phone'>
                <a href={`tel:${item.phone.replace(/[^\d+]/g, '')}`} className='hover:underline'>
                  {item.phone}
                </a>
              </Fact>
            )}
          </>
        )}
        {item.type === 'place' && <Fact label='Address'>{item.address}</Fact>}
      </dl>

      <div className='mt-2 grid gap-2 border-t border-line pt-5'>
        {primary &&
          (primary.internal ? (
            <Link href={primary.href} className='btn h-11 bg-white text-abyss hover:bg-white/85'>
              {primary.label}
              <ArrowRight className='h-4 w-4' strokeWidth={1.75} />
            </Link>
          ) : (
            <a
              href={primary.href}
              target='_blank'
              rel='noopener noreferrer'
              className='btn h-11 bg-white text-abyss hover:bg-white/85'
            >
              {primary.label}
              <ArrowUpRight className='h-4 w-4' strokeWidth={1.75} />
            </a>
          ))}
        {item.type === 'school' && emails.length > 0 && (
          <a href={mailtoHref(item, `University visit request: ${item.name}`)} className='btn-ghost h-11'>
            Email the counselor
          </a>
        )}
        <a href={routeTo(item)} target='_blank' rel='noopener noreferrer' className='btn-ghost h-11'>
          Get directions
        </a>
      </div>
    </div>
  )
}

/*
  Full-screen map with one floating glass panel: search, a filter with a sliding marker,
  a grouped list, and a detail view. On phones the panel is a bottom sheet.
*/
export default function MapExplorer({ schools }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [selected, setSelected] = useState(null)
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setWide(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Keep spreadsheet order: DO NOT SORT.
  const items = useMemo(
    () => [
      ...schools.map((s) => ({ ...s, type: 'school', subtitle: districtOf(s.address) })),
      ...HOTELS.map((h) => ({ ...h, type: 'hotel', subtitle: h.area })),
      ...PLACES.map((p) => ({ ...p, type: 'place', logo: p.icon, subtitle: districtOf(p.address) })),
    ],
    [schools]
  )

  // Deep links: /map?school=unis-hanoi or /map?hotel=sheraton
  useEffect(() => {
    if (!router.isReady) return
    const { school, hotel } = router.query
    if (school) setSelected({ type: 'school', id: school })
    else if (hotel) setSelected({ type: 'hotel', id: hotel })
    // Only on first load; later changes come from select()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const select = (next) => {
    setSelected(next)
    const q = next && next.type !== 'place' ? { [next.type]: next.id } : {}
    router.replace({ pathname: '/map', query: q }, undefined, { shallow: true, scroll: false })
  }

  const types = useMemo(() => (tab === 'all' ? ALL : [tab]), [tab])
  const current = selected && items.find((i) => i.type === selected.type && i.id === selected.id)
  const listed = items.filter(
    (i) =>
      types.includes(i.type) &&
      (matchSchool(i.type === 'school' ? i : { ...i, counselor_name: '' }, query) ||
        i.subtitle.toLowerCase().includes(query.trim().toLowerCase()))
  )
  const groups = ALL.map((t) => ({ type: t, items: listed.filter((i) => i.type === t) })).filter((g) => g.items.length)

  // Keep markers clear of the floating panel when fitting them into view
  const fitPadding = wide ? [110, 80, 60, 460] : [90, 40, 380, 40]
  // A selected marker lands in the open part of the map: right of the panel, or above the sheet
  const focusOffset = wide ? [200, 0] : [0, 190]

  return (
    <div className='relative h-full w-full'>
      <div className='absolute inset-0'>
        <MapView items={items} visibleTypes={types} selected={selected} onSelect={select} fitPadding={fitPadding} focusOffset={focusOffset} />
        {/* Soft shade under the header so map labels never fight with it */}
        <div className='pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#1b2627]/90 via-[#1b2627]/40 to-transparent' />
      </div>

      {/* Panel: bottom sheet on phones, floating column on desktop aligned with the header */}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 top-auto h-[48%] p-2 md:inset-y-0 md:h-auto md:p-0 md:pb-6 md:pt-24'>
        <div className='wrap h-full max-md:!px-0'>
          <aside className='pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#1b2627]/85 text-ink backdrop-blur-xl md:w-[380px]'>
            <AnimatePresence mode='wait' initial={false}>
              {current ? (
                <motion.div
                  key={`${current.type}:${current.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className='min-h-0 flex-1 overflow-y-auto'
                >
                  <Detail item={current} onBack={() => select(null)} />
                </motion.div>
              ) : (
                <motion.div
                  key='list'
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className='flex min-h-0 flex-1 flex-col'
                >
                  <div className='space-y-4 px-5 pb-4 pt-5'>
                    <div className='flex items-baseline justify-between'>
                      <h1 className='text-[1.6rem] leading-none tracking-[-0.02em]'>Map</h1>
                      <span className='font-mono text-[12px] text-muted'>Hanoi</span>
                    </div>

                    <label className='flex h-11 items-center gap-2.5 rounded-full border border-line px-4 transition-colors focus-within:border-ink/60'>
                      <Search className='h-4 w-4 shrink-0 text-muted' aria-hidden='true' />
                      <span className='sr-only'>Search the map</span>
                      <input
                        type='search'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Search by name or district'
                        className='min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden'
                      />
                      {query && (
                        <button
                          type='button'
                          onClick={() => setQuery('')}
                          aria-label='Clear search'
                          className='text-muted hover:text-ink'
                        >
                          <X className='h-4 w-4' />
                        </button>
                      )}
                    </label>

                    {/* Filter: one choice at a time, with a sliding white marker like the header */}
                    <div className='grid grid-cols-4 rounded-full border border-line p-1' role='group' aria-label='Show on map'>
                      {TABS.map((t) => {
                        const on = tab === t.key
                        return (
                          <button
                            key={t.key}
                            type='button'
                            onClick={() => setTab(t.key)}
                            aria-pressed={on}
                            className={cn(
                              'relative rounded-full py-1.5 text-[13px] transition-colors',
                              on ? 'text-abyss' : 'text-muted hover:text-ink'
                            )}
                          >
                            {on && (
                              <motion.span
                                layoutId='map-tab'
                                className='absolute inset-0 -z-10 rounded-full bg-white'
                                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                              />
                            )}
                            <span className='relative'>{t.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className='min-h-0 flex-1 overflow-y-auto border-t border-line px-5 pb-4'>
                    {groups.length ? (
                      groups.map((g) => (
                        <section key={g.type} className='pt-5'>
                          <h2 className='flex items-baseline justify-between font-mono text-[12px] text-muted'>
                            {GROUP_LABEL[g.type]}
                            <span className='tabular-nums'>{String(g.items.length).padStart(2, '0')}</span>
                          </h2>
                          <ul className='mt-1'>
                            {g.items.map((i) => (
                              <Row key={`${i.type}:${i.id}`} item={i} onClick={() => select({ type: i.type, id: i.id })} />
                            ))}
                          </ul>
                        </section>
                      ))
                    ) : (
                      <div className='py-12 text-center'>
                        <p>Nothing matches “{query}”.</p>
                        <button onClick={() => setQuery('')} className='link mt-2 text-sm'>
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </div>
  )
}
