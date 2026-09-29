import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/*
  Moving abstract backdrop for the banner, after the Integrated Bio hero.
  Layers (back to front): colour field, drifting blurred forms, a lit tube ring,
  a folded brown ribbon with light and dark edges, a travelling
  glint, then shade and fine grain. Each layer also shifts slightly with the pointer.
  Nothing crosses the headline, the copy or the buttons.
*/

// Each path morphs between two curves with the same command structure
const RIBBON = {
  band: ['M 170 -120 C 410 260, 630 640, 1070 1040', 'M 250 -120 C 370 320, 750 580, 990 1040'],
  light: ['M 146 -120 C 386 260, 606 640, 1046 1040', 'M 226 -120 C 346 320, 726 580, 966 1040'],
  dark: ['M 196 -120 C 436 260, 656 640, 1096 1040', 'M 276 -120 C 396 320, 776 580, 1016 1040'],
}

function Morph({ d, dur, reduce, ...props }) {
  return (
    <path d={d[0]} fill='none' strokeLinecap='round' {...props}>
      {!reduce && (
        <animate
          attributeName='d'
          values={`${d[0]};${d[1]};${d[0]}`}
          dur={dur}
          repeatCount='indefinite'
          calcMode='spline'
          keySplines='0.45 0 0.55 1;0.45 0 0.55 1'
        />
      )}
    </path>
  )
}

export default function HeroArt() {
  const reduce = useReducedMotion()
  const root = useRef(null)

  // Slight pointer parallax: layers read --px / --py (-1..1) and move by their own depth
  useEffect(() => {
    if (reduce) return
    const el = root.current
    let frame = 0
    const target = { x: 0, y: 0 }
    const now = { x: 0, y: 0 }
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1
      target.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const tick = () => {
      now.x += (target.x - now.x) * 0.05
      now.y += (target.y - now.y) * 0.05
      el.style.setProperty('--px', now.x.toFixed(4))
      el.style.setProperty('--py', now.y.toFixed(4))
      frame = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [reduce])

  return (
    <div ref={root} className='hero-art absolute inset-0 overflow-hidden' aria-hidden='true'>
      <div className='depth' style={{ '--d': '10px' }}>
        <div className='blob blob-sage' />
        <div className='blob blob-tan' />
      </div>
      <div className='depth' style={{ '--d': '18px' }}>
        <div className='blob blob-deep' />
        <div className='blob blob-glint' />
      </div>

      <div className='depth' style={{ '--d': '26px' }}>
        <svg className='h-full w-full' viewBox='0 0 1440 900' preserveAspectRatio='xMidYMid slice'>
          <defs>
            {/* Tube: dark core, lit rim toward the top right */}
            <linearGradient id='tube' x1='0.1' y1='0.9' x2='0.9' y2='0.1'>
              <stop offset='0' stopColor='#07170f' />
              <stop offset='0.55' stopColor='#143a2d' />
              <stop offset='1' stopColor='#5f977c' />
            </linearGradient>
            <linearGradient id='rim' x1='0' y1='1' x2='1' y2='0'>
              <stop offset='0' stopColor='#b9dcc7' stopOpacity='0' />
              <stop offset='0.7' stopColor='#b9dcc7' stopOpacity='0.55' />
              <stop offset='1' stopColor='#e6f3ea' stopOpacity='0.8' />
            </linearGradient>
            <filter id='soft' x='-20%' y='-20%' width='140%' height='140%'>
              <feGaussianBlur stdDeviation='18' />
            </filter>
            <filter id='feather' x='-10%' y='-10%' width='120%' height='120%'>
              <feGaussianBlur stdDeviation='4' />
            </filter>
          </defs>

          <g className='tube-spin'>
            <ellipse
              cx='560'
              cy='230'
              rx='400'
              ry='340'
              fill='none'
              stroke='url(#tube)'
              strokeWidth='110'
              filter='url(#soft)'
            />
            <ellipse
              cx='560'
              cy='230'
              rx='452'
              ry='392'
              fill='none'
              stroke='url(#rim)'
              strokeWidth='3'
              opacity='0.5'
              filter='url(#feather)'
            />
          </g>

          <Morph
            d={RIBBON.band}
            dur='21s'
            reduce={reduce}
            stroke='#6e4d2e'
            strokeWidth='44'
            opacity='0.62'
            filter='url(#feather)'
          />
          <Morph d={RIBBON.light} dur='21s' reduce={reduce} stroke='#ecd9bb' strokeWidth='1.4' opacity='0.55' />
          <Morph d={RIBBON.dark} dur='21s' reduce={reduce} stroke='#140e08' strokeWidth='1.6' opacity='0.85' />
        </svg>
      </div>

      <div className='hero-art-shade absolute inset-0' />
      <div className='hero-art-grain absolute inset-0' />
    </div>
  )
}
