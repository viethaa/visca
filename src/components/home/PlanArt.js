import { useReducedMotion } from 'framer-motion'

/*
  Backdrop for the "Plan a visit" panel. Same family as the banner art (soft light,
  grain, slow motion) but a different scene: rippling contour rings, like a
  topographic map, drifting over a deep-teal-to-copper field.
*/
const RINGS = Array.from({ length: 14 }, (_, i) => 90 + i * 58)

export default function PlanArt() {
  const reduce = useReducedMotion()
  return (
    <div className='plan-art absolute inset-0 overflow-hidden' aria-hidden='true'>
      <div className='blob plan-glow-a' />
      <div className='blob plan-glow-b' />

      <svg className='absolute inset-0 h-full w-full' viewBox='0 0 1440 900' preserveAspectRatio='xMidYMid slice'>
        <defs>
          <linearGradient id='contour' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0' stopColor='#cfe6d8' stopOpacity='0.05' />
            <stop offset='0.55' stopColor='#cfe6d8' stopOpacity='0.28' />
            <stop offset='1' stopColor='#f0d9b8' stopOpacity='0.4' />
          </linearGradient>
        </defs>
        {/* Two ring sets drifting in opposite directions make the contours shift */}
        <g className={reduce ? undefined : 'plan-rings-a'} style={{ transformOrigin: '1180px 380px' }}>
          {RINGS.map((r) => (
            <ellipse key={r} cx='1180' cy='380' rx={r * 1.25} ry={r} fill='none' stroke='url(#contour)' strokeWidth='1' />
          ))}
        </g>
        <g className={reduce ? undefined : 'plan-rings-b'} style={{ transformOrigin: '1240px 420px' }}>
          {RINGS.slice(0, 10).map((r) => (
            <ellipse
              key={r}
              cx='1240'
              cy='420'
              rx={r * 1.1 + 20}
              ry={r * 0.9 + 20}
              fill='none'
              stroke='url(#contour)'
              strokeWidth='0.8'
              opacity='0.6'
            />
          ))}
        </g>
      </svg>

      <div className='plan-art-shade absolute inset-0' />
      <div className='hero-art-grain absolute inset-0' />
    </div>
  )
}
