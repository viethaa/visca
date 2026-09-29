import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Gap left above a section when we land on it, so its rounded top edge shows
const LAND_OFFSET = 12
let animating = false

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Smooth scroll to a y position with a fixed, calm easing
export function glideTo(y, duration = 900) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const start = window.scrollY
  const dist = y - start
  if (reduce || Math.abs(dist) < 2) {
    window.scrollTo(0, y)
    return Promise.resolve()
  }
  animating = true
  return new Promise((resolve) => {
    const t0 = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration)
      window.scrollTo(0, start + dist * easeInOut(t))
      if (t < 1) requestAnimationFrame(step)
      else {
        animating = false
        resolve()
      }
    }
    requestAnimationFrame(step)
  })
}

const sectionTop = (el) => Math.max(0, el.getBoundingClientRect().top + window.scrollY - (el.id === 'top' ? 0 : LAND_OFFSET))
export const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (el) glideTo(sectionTop(el))
}

/*
  Section snapping (desktop): one wheel/key gesture glides to the start of the next
  section. Tall sections (like the school list) scroll normally until their end is
  reached, then the next gesture moves on.
*/
export function useSectionSnap(ids) {
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    if (!desktop.matches) return
    let lockedUntil = 0

    const sections = () => ids.map((id) => document.getElementById(id)).filter(Boolean)
    const current = (els) => {
      const y = window.scrollY + LAND_OFFSET + 4
      let idx = 0
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top + window.scrollY <= y) idx = i
      })
      return idx
    }

    const move = (dir, e) => {
      const els = sections()
      if (!els.length) return
      const now = performance.now()
      if (animating || now < lockedUntil) {
        e?.preventDefault()
        return
      }
      const i = current(els)
      const el = els[i]
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight

      if (dir > 0) {
        // Still content below inside this section: let it scroll, but stop exactly at its end
        if (rect.bottom > vh + 2) {
          const delta = e?.deltaY ?? vh * 0.8
          if (rect.bottom - delta < vh) {
            e?.preventDefault()
            window.scrollTo(0, window.scrollY + rect.bottom - vh)
            lockedUntil = now + 450
          }
          return
        }
        if (i + 1 >= els.length) return
        e?.preventDefault()
        lockedUntil = now + 1300
        glideTo(sectionTop(els[i + 1]))
      } else {
        // Inside a tall section above its start: scroll up normally, stopping at its start
        const top = sectionTop(el)
        if (window.scrollY > top + 2) {
          const delta = e?.deltaY ?? -vh * 0.8
          if (window.scrollY + delta < top) {
            e?.preventDefault()
            window.scrollTo(0, top)
            lockedUntil = now + 450
          }
          return
        }
        if (i === 0) return
        e?.preventDefault()
        lockedUntil = now + 1300
        // Land where the previous section fits: its start, or its end if it is taller than the screen
        const prev = els[i - 1]
        const prevTop = sectionTop(prev)
        const prevEnd = prev.getBoundingClientRect().bottom + window.scrollY - vh
        glideTo(Math.max(prevTop, prevEnd))
      }
    }

    const onWheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      if (Math.abs(e.deltaY) < 2) return
      move(Math.sign(e.deltaY), e)
    }
    const onKey = (e) => {
      if (e.target.closest('input, textarea, select, [contenteditable]')) return
      const down = ['PageDown', 'ArrowDown', ' '].includes(e.key) && !e.shiftKey
      const up = ['PageUp', 'ArrowUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)
      if (down || up) move(down ? 1 : -1, { preventDefault: () => e.preventDefault(), deltaY: down ? 120 : -120 })
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [ids])
}

// Small, faint chevron that bobs gently; click to glide to the next section
export function NextCue({ target, className }) {
  const reduce = useReducedMotion()
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const on = () => setHidden(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <button
      type='button'
      onClick={() => scrollToId(target)}
      aria-label='Next section'
      className={cn(
        'grid h-8 w-8 place-items-center text-white/45 transition-opacity duration-500 hover:text-white',
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
        className
      )}
    >
      <motion.span
        animate={reduce ? undefined : { y: [0, 4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className='h-4 w-4' strokeWidth={1.5} />
      </motion.span>
    </button>
  )
}

// Thin progress line along the top edge of the window
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 })
  return (
    <motion.div
      aria-hidden='true'
      style={{ scaleX }}
      className='fixed inset-x-0 top-0 z-[1001] h-0.5 origin-left bg-signal'
    />
  )
}
