import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Crossfading photo slideshow.
 * slides: [{ src, alt, title?, href? }]
 * Broken images are skipped. Autoplay pauses on hover, on focus and for reduced motion.
 * onChange(slide) lets a parent show details for the current photo.
 */
export default function Slideshow({
  slides,
  className,
  sizes = '100vw',
  interval = 6000,
  priority = false,
  label = 'Photos',
  fallback = null,
  showCaption = true,
  onChange,
}) {
  const [failed, setFailed] = useState(() => new Set())
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  const visible = useMemo(() => slides.filter((s) => !failed.has(s.src)), [slides, failed])
  const count = visible.length
  const i = count ? index % count : 0
  const slide = visible[i]

  useEffect(() => {
    if (count < 2 || paused || reduce) return
    const t = setInterval(() => setIndex((n) => n + 1), interval)
    return () => clearInterval(t)
  }, [count, paused, reduce, interval])

  useEffect(() => {
    if (slide && onChange) onChange(slide)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide?.src])

  const go = (d) => setIndex((n) => (((n % count) + d) % count + count) % count)
  const markFailed = (src) => setFailed((prev) => new Set(prev).add(src))

  if (!slide) {
    return <div className={cn('grid place-items-center rounded-xl bg-mist', className)}>{fallback}</div>
  }

  const Title = slide.href ? Link : 'span'

  return (
    <div
      className={cn('group relative isolate overflow-hidden rounded-xl bg-mist', className)}
      role='region'
      aria-roledescription='carousel'
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          className='absolute inset-0'
          initial={{ opacity: 0, scale: 1.015 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes={sizes}
            priority={priority && i === 0}
            className='object-cover'
            onError={() => markFailed(slide.src)}
          />
        </motion.div>
      </AnimatePresence>

      {showCaption && slide.title && (
        <div className='pointer-events-none absolute bottom-0 left-0 z-10 max-w-[75%] p-4'>
          <Title
            {...(slide.href ? { href: slide.href } : {})}
            className='pointer-events-auto block truncate rounded-lg bg-black/45 px-3 py-1.5 text-sm text-white backdrop-blur-md transition-colors hover:bg-black/60'
          >
            {slide.title}
          </Title>
        </div>
      )}

      {count > 1 && (
        <div className='absolute bottom-4 right-4 z-10 flex gap-1.5'>
          {[
            { d: -1, Icon: ChevronLeft, text: 'Previous photo' },
            { d: 1, Icon: ChevronRight, text: 'Next photo' },
          ].map(({ d, Icon, text }) => (
            <button
              key={d}
              onClick={() => go(d)}
              aria-label={text}
              className='grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-[#1e2321] transition-[background-color,transform] hover:bg-white active:scale-95'
            >
              <Icon className='h-4 w-4' />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
