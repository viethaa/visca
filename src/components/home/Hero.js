import HeroArt from './HeroArt'
import { SlantCTA } from '../Lab'
import Header from '../layout/Header'
import { NextCue } from '../ScrollCues'

const HEADLINE = 'Visit Hanoi’s international schools.'

// Inset, rounded banner with moving artwork, after the Integrated Bio hero
export default function Hero() {
  return (
    <div id='top' className='band-dark p-2 md:p-3'>
      <div className='relative isolate flex min-h-[calc(100svh-1rem)] flex-col overflow-hidden rounded-[22px] [clip-path:inset(0_round_22px)] md:min-h-[calc(100svh-1.5rem)] md:rounded-[28px] md:[clip-path:inset(0_round_28px)]'>
        <HeroArt />
        <Header overlay />

        <section className='wrap relative flex flex-1 flex-col justify-between pb-8 pt-36 md:pb-10 md:pt-44'>
          <h1 className='t-hero max-w-[15ch] text-white' aria-label={HEADLINE}>
            {HEADLINE.split(' ').map((word, i) => (
              <span key={i} className='inline-block overflow-hidden pb-[0.08em] align-top' aria-hidden='true'>
                <span className='inline-block animate-word' style={{ animationDelay: `${0.15 + i * 0.09}s` }}>
                  {word}&nbsp;
                </span>
              </span>
            ))}
          </h1>

          <div className='mt-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between'>
            <div className='animate-rise' style={{ animationDelay: '0.7s' }}>
              <p className='font-mono text-[14px] tracking-[-0.01em] text-white/75'>
                Vietnam Int. School Counselor Association (VISCA)
              </p>
              <p className='t-sub mt-4 max-w-[36ch] text-white'>
                Counselor contacts and preferred visit times for every VISCA member school, in one place.
              </p>
            </div>

            <div className='animate-rise' style={{ animationDelay: '0.8s' }}>
              <SlantCTA href='#schools'>Browse schools</SlantCTA>
            </div>
          </div>
        </section>

        <NextCue target='schools' className='absolute bottom-5 left-1/2 hidden -translate-x-1/2 md:grid' />
      </div>
    </div>
  )
}
