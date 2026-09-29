import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import PlanArt from './PlanArt'
import { Reveal, Sheet } from '../Reveal'

const STEPS = [
  { title: 'Choose schools', body: 'Browse and shortlist the schools you want to see.', href: '#schools', cta: 'See schools' },
  { title: 'Book your visit', body: 'Email the counselor and use the school’s booking link.' },
  { title: 'Plan your route', body: 'Group nearby schools on the same day.', href: '/map', cta: 'Open the map' },
  { title: 'Find a hotel', body: 'Stay close to the schools on your list.', href: '/hotels', cta: 'See hotels' },
]

// Its own panel: contour-ring artwork behind a frosted list of steps
export default function PlanVisit() {
  return (
    <Sheet id='plan' className='band-dark relative isolate'>
      <div className='absolute inset-0 -z-10'>
        <PlanArt />
      </div>

      <div className='wrap grid min-h-[calc(100svh-1rem)] content-center gap-12 py-24 md:min-h-[calc(100svh-1.5rem)] md:py-32 lg:grid-cols-12 lg:items-center lg:gap-16'>
        <div className='lg:col-span-5'>
          <Reveal as='p' className='t-heading text-white/70'>
            Plan a visit
          </Reveal>
          <Reveal as='h2' delay={0.08} className='t-display mt-6 max-w-[12ch] text-white'>
            Your Hanoi visit, made simple.
          </Reveal>
          <Reveal as='p' delay={0.16} className='t-sub mt-6 max-w-[30ch] text-white/75'>
            Plan campus visits across Hanoi in four easy steps.
          </Reveal>
        </div>

        <Reveal
          as='ol'
          delay={0.1}
          className='rounded-[24px] border border-white/15 bg-[#0f2620]/45 p-2 backdrop-blur-xl lg:col-span-7'
        >
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className='grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-b border-white/10 px-4 py-6 last:border-0 sm:grid-cols-[5rem_1fr_auto] sm:px-6'
            >
              <span className='text-[2.5rem] leading-none tracking-[-0.04em] tabular-nums text-white/35 sm:text-[3.25rem]'>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className='min-w-0'>
                <h3 className='t-sub text-white'>{step.title}</h3>
                <p className='mt-1 text-[15px] leading-[1.4] text-white/65'>{step.body}</p>
              </div>
              {step.href ? (
                <Link href={step.href} aria-label={step.cta} className='arrow-btn'>
                  <ArrowRight className='h-4 w-4' strokeWidth={1.75} />
                </Link>
              ) : (
                <span className='h-10 w-10' aria-hidden='true' />
              )}
            </motion.li>
          ))}
        </Reveal>
      </div>
    </Sheet>
  )
}
