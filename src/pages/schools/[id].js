import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FooterNote } from '@/components/layout/Footer'
import Stage from '@/components/schools/Stage'
import Linkify from '@/components/Linkify'
import { CopyButton } from '@/components/home/Directory'
import { Reveal, Sheet } from '@/components/Reveal'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { visitSlots, mailtoHref } from '@/lib/schools'
import { HOTELS } from '@/lib/hotels'
import { loadSchools } from '@/lib/loadSchools'

// OpenLayers needs the browser
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <div className='h-full w-full animate-pulse bg-mist' />,
})

export async function getStaticPaths() {
  const schools = await loadSchools()
  return {
    paths: schools.map((s) => ({ params: { id: s.id } })),
    fallback: 'blocking',
  }
}

// Keep spreadsheet order: DO NOT SORT.
export async function getStaticProps({ params }) {
  const schools = await loadSchools()
  const i = schools.findIndex((s) => s.id === params.id)
  if (i === -1) return { notFound: true, revalidate: 60 }
  return {
    props: {
      school: schools[i],
    },
    revalidate: 60,
  }
}

// Straight-line distance in km
function km(a, b) {
  const rad = (d) => (d * Math.PI) / 180
  const dLat = rad(b.latitude - a.latitude)
  const dLon = rad(b.longitude - a.longitude)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

// A full-width row: label on the left, detail and arrow on the right
function Row({ href, external, label, detail }) {
  const Tag = external ? 'a' : Link
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const Icon = external ? ArrowUpRight : ArrowRight
  return (
    <li className='border-b border-line'>
      <Tag href={href} {...ext} className='group flex items-center justify-between gap-6 py-5'>
        <span className='min-w-0'>
          <span className='block text-[1.2rem] leading-[1.2] tracking-[-0.01em]'>{label}</span>
          {detail && <span className='mt-1 block truncate font-mono text-[13px] text-muted'>{detail}</span>}
        </span>
        <Icon
          className='h-4 w-4 shrink-0 text-muted transition-all duration-300 group-hover:text-ink group-hover:translate-x-0.5'
          strokeWidth={1.75}
        />
      </Tag>
    </li>
  )
}

function Section({ id, label, title, children, className }) {
  return (
    <Reveal as='section' id={id} className={className}>
      {label && <p className='mb-2 font-mono text-[14px] text-muted'>{label}</p>}
      <h2 className='t-heading'>{title}</h2>
      <div className='mt-8'>{children}</div>
    </Reveal>
  )
}

function Fact({ label, children }) {
  return (
    <div className='border-t border-line py-5'>
      <dt className='t-mono text-muted'>{label}</dt>
      <dd className='mt-2 min-w-0 break-words'>{children}</dd>
    </div>
  )
}

export default function SchoolPage({ school }) {
  const slots = visitSlots(school)
  const firstName = school.counselor_name.split(/[\s,]+/)[0]
  const directions =
    school.latitude != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${school.latitude},${school.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address)}`
  const links = [
    { href: school.website, label: 'Website', detail: hostOf(school.website) },
    { href: school.profile, label: 'School profile' },
    { href: school.calendar, label: 'School calendar' },
  ].filter((l) => l.href)
  const emails = school.emails.length ? school.emails : school.counselor_email ? [school.counselor_email] : []

  const located = school.latitude != null && school.longitude != null
  const nearby = located
    ? HOTELS.map((h) => ({ ...h, distance: km(school, h) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
    : []
  const mapItems = located
    ? [{ ...school, type: 'school' }, ...nearby.map((h) => ({ ...h, type: 'hotel' }))]
    : []

  return (
    <>
      <Head>
        <title>{`${school.name} | VISCA`}</title>
        <meta
          name='description'
          content={`Counselor contact, preferred visit times and directions for ${school.name}, a VISCA member school in Hanoi.`}
        />
      </Head>

      <main id='main'>
        <Stage school={school} />

        <Sheet grow={false} className='band-light band !pb-0'>
          <div className='wrap grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12'>
            <div className='min-w-0 space-y-20 lg:col-span-7 lg:space-y-24 lg:pr-8'>
              {links.length > 0 && (
                <Section title='Read up on the school'>
                  <ul className='border-t border-line'>
                    {links.map((l) => (
                      <Row key={l.label} href={l.href} external label={l.label} detail={l.detail} />
                    ))}
                  </ul>
                </Section>
              )}

              {located && (
                <Section id='location' title='Where to find it'>
                  <p className='max-w-[52ch] text-muted'>{school.address}</p>
                  <div className='band-dark mt-6 aspect-[4/3] overflow-hidden rounded-[20px] sm:aspect-[16/10]'>
                    <MapView items={mapItems} visibleTypes={['school', 'hotel']} selected={null} onSelect={() => {}} embedded />
                  </div>
                </Section>
              )}

              {nearby.length > 0 && (
                <Section title='Closest recommended hotels'>
                  <ul className='border-t border-line'>
                    {nearby.map((h) => (
                      <li key={h.id} className='border-b border-line'>
                        <Link href={`/map?hotel=${h.id}`} className='group flex items-center gap-5 py-4'>
                          <span className='relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-mist'>
                            <Image src={h.exterior} alt='' fill sizes='80px' className='object-cover' />
                          </span>
                          <span className='min-w-0 flex-1'>
                            <span className='block text-[1.2rem] leading-[1.2] tracking-[-0.01em]'>{h.name}</span>
                            <span className='mt-1 block font-mono text-[13px] text-muted'>{h.area}</span>
                          </span>
                          <span className='shrink-0 font-mono text-[14px] tabular-nums text-muted'>
                            {h.distance < 10 ? h.distance.toFixed(1) : Math.round(h.distance)} km
                          </span>
                          <ArrowRight
                            className='hidden h-4 w-4 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ink sm:block'
                            strokeWidth={1.75}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>

            <aside className='order-first lg:order-none lg:col-span-5'>
              <div className='card p-8 lg:sticky lg:top-8'>
                <h2 className='t-heading'>Book a visit</h2>
                <dl className='mt-6'>
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
                  {school.counselor_name && <Fact label='Counselor'>{school.counselor_name}</Fact>}
                  {emails.length > 0 && (
                    <Fact label='Email'>
                      <span className='flex items-start gap-1'>
                        <span className='min-w-0'>
                          {emails.map((e) => (
                            <a key={e} href={`mailto:${e}`} className='link block break-words'>
                              {e}
                            </a>
                          ))}
                        </span>
                        <CopyButton value={school.counselor_email} label='email' />
                      </span>
                    </Fact>
                  )}
                  {school.counselor_phone && (
                    <Fact label='Phone'>
                      <a href={`tel:${school.counselor_phone.replace(/[^\d+]/g, '')}`} className='hover:underline'>
                        {school.counselor_phone}
                      </a>
                    </Fact>
                  )}
                  {school.contact_point && school.contact_point !== school.counselor_email && (
                    <Fact label='How to book'>
                      <Linkify text={school.contact_point} />
                    </Fact>
                  )}
                  {school.notes && (
                    <Fact label='Note'>
                      <Linkify text={school.notes} />
                    </Fact>
                  )}
                </dl>
                <div className='mt-4 grid gap-2 border-t border-line pt-6'>
                  {emails.length > 0 && (
                    <a href={mailtoHref(school, `University visit request: ${school.name}`)} className='btn-primary h-12'>
                      {emails.length > 1 ? 'Email the counselors' : `Email ${firstName || 'the counselor'}`}
                    </a>
                  )}
                  <a href={directions} target='_blank' rel='noopener noreferrer' className='btn-ghost h-12'>
                    Get directions
                  </a>
                </div>
              </div>
            </aside>
          </div>
          <div className='wrap'>
            <FooterNote className='mt-20 md:mt-28' />
          </div>
        </Sheet>
      </main>
    </>
  )
}
