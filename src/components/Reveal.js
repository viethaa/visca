import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1]

// Fades and lifts its children in once, when they scroll into view
export function Reveal({ as = 'div', delay = 0, y = 32, className, children, ...rest }) {
  const M = motion[as]
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </M>
  )
}

/*
  A section drawn as an inset rounded panel on the dark page, like the banner,
  so each section reads as its own block. It eases from 96% to 100% scale as it scrolls in.
*/
// grow: scale in on scroll; turn off for the last panel, which never reaches mid-screen
export function Sheet({ as = 'section', grow = true, className, children, ...rest }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 45%'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1])
  const M = motion[as]
  return (
    <M ref={ref} className='bg-abyss px-2 pb-2 md:px-3 md:pb-3' {...rest}>
      <motion.div
        style={reduce || !grow ? undefined : { scale, transformOrigin: 'top center' }}
        className={cn('overflow-hidden rounded-[22px] md:rounded-[28px]', className)}
      >
        {children}
      </motion.div>
    </M>
  )
}
