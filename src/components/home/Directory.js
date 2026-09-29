import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { X, Copy, Check, ArrowRight } from 'lucide-react'

import { Reveal, Sheet } from '../Reveal'
import { visitSlots, mailtoHref } from '@/lib/schools'
import { cn } from '@/lib/utils'

const fold = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()

export function matchSchool(school, query) {
  const q = fold(query.trim())
  if (!q) return true
  return [school.name, school.counselor_name, school.address, school.counselor_email].some((f) => fold(f).includes(q))
}

export function SchoolLogo({ school, size = 'h-10 w-10' }) {
  const [failed, setFailed] = useState(false)
  const initials = school.name
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <div className={cn('grid shrink-0 place-items-center overflow-hidden rounded-lg bg-white', size)}>
      {school.logo && !failed ? (
        <img src={school.logo} alt='' className='h-full w-full object-contain p-1' onError={() => setFailed(true)} />
      ) : (
        <span className='font-mono text-xs text-[#4d5757]'>{initials}</span>
      )}
    </div>
  )
}

export function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type='button'
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        } catch {}
      }}
      className='relative z-10 grid h-7 w-7 place-items-center rounded-md text-muted transition-colors hover:bg-mist hover:text-ink'
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      title={copied ? 'Copied' : `Copy ${label}`}
    >
      {copied ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
    </button>
  )
}

// Visit-time label; drops "Visits" when the sheet has words instead of times
export const visitLabel = (school) => {
  const slot = visitSlots(school)[0]
  if (!slot) return 'Visit times on request'
  return /\d/.test(slot) ? `Visits ${slot}` : slot
}

function SchoolCard({ school, index }) {
  const [photoFailed, setPhotoFailed] = useState(false)
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      className='card group relative flex min-w-0 flex-col p-3 transition-colors duration-500 hover:border-ink/25'
    >
      <div className='specimen aspect-[16/9] rounded-xl sm:aspect-[4/3]'>
        {school.pic && !photoFailed ? (
          <Image
            src={school.pic}
            alt=''
            fill
            sizes='(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw'
            className='object-cover'
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <div className='h-full bg-[radial-gradient(rgb(34_47_48/0.12)_1px,transparent_1.3px)] [background-size:18px_18px]' />
        )}
      </div>

      <div className='flex flex-1 flex-col px-3 pb-2'>
        {/* Logo tile sits on the photo's bottom edge */}
        <div className='relative z-10 -mt-8 w-fit rounded-xl bg-surface p-1.5 ring-1 ring-line'>
          <SchoolLogo school={school} size='h-12 w-12' />
        </div>
        <h3 className='t-sub mt-4'>
          <Link
            href={`/schools/${school.id}`}
            className='after:absolute after:inset-0 after:rounded-[20px] after:content-[""] focus-visible:outline-none focus-visible:ring-0 [&:focus-visible]:after:ring-2 [&:focus-visible]:after:ring-signal'
          >
            {school.name}
          </Link>
        </h3>

        <div className='mt-auto flex items-end justify-between gap-4 pt-8'>
          <div className='min-w-0 text-[15px] leading-[1.35]'>
            <p className='truncate'>{school.counselor_name || 'Counselor not listed'}</p>
            {school.counselor_email && (
              <a href={mailtoHref(school)} className='relative z-10 block truncate text-muted hover:text-ink hover:underline'>
                {school.emails[0] || school.counselor_email}
              </a>
            )}
          </div>
          <span className='arrow-btn' aria-hidden='true'>
            <ArrowRight className='h-4 w-4' strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </motion.li>
  )
}

export default function Directory({ schools, query, setQuery }) {
  // Shown A–Z (owner's request); the data itself stays in spreadsheet order
  const results = useMemo(
    () =>
      schools
        .filter((s) => matchSchool(s, query))
        .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })),
    [schools, query]
  )

  return (
    <Sheet id='schools' className='band-light band'>
      <div className='wrap'>
        <Reveal as='p' className='t-heading text-muted'>
          Member schools
        </Reveal>

        <Reveal delay={0.08} className='mt-6 grid gap-8 md:grid-cols-12 md:items-end'>
          <h2 className='t-display md:col-span-7'>Choose a school, then book with its counselor.</h2>
          <div className='md:col-span-5'>
            <label htmlFor='directory-search' className='sr-only'>
              Search schools
            </label>
            <div className='field'>
              <input
                id='directory-search'
                type='search'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search schools'
                autoComplete='off'
                className='min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted/70 [&::-webkit-search-cancel-button]:hidden'
              />
              {query && (
                <button onClick={() => setQuery('')} className='text-muted hover:text-ink' aria-label='Clear search'>
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>
          </div>
        </Reveal>

        <p className='sr-only' aria-live='polite'>
          {results.length} of {schools.length} schools shown
        </p>

        {results.length ? (
          <ul className='mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:mt-14 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3'>
            {results.map((school, i) => (
              <SchoolCard key={school.id} school={school} index={i} />
            ))}
          </ul>
        ) : (
          <div className='card mt-14 px-6 py-20 text-center'>
            <p className='t-sub'>No schools match “{query}”.</p>
            <p className='mt-2 text-muted'>Try a school name, a counselor or a district such as Tây Hồ.</p>
            <button onClick={() => setQuery('')} className='btn-ghost mt-8'>
              Show all schools
            </button>
          </div>
        )}

        {query && results.length > 0 && (
          <p className='t-mono mt-6 text-muted'>
            Showing {results.length} of {schools.length}.{' '}
            <button onClick={() => setQuery('')} className='text-link text-ink'>
              Show all
            </button>
          </p>
        )}
      </div>
    </Sheet>
  )
}
