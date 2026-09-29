import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { scrollToId } from './ScrollCues'

// Pill with the section number, e.g. "01 / 03", plus a mono label
export function Counter({ n, total, label, className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className='t-mono rounded-full border border-line px-3 py-1.5 tabular-nums text-muted'>
        {String(n).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
      {label && <span className='t-mono text-muted'>{label}</span>}
    </div>
  )
}

// Category label with the lime signal dot
export function Tag({ children, className }) {
  return (
    <span className={cn('t-mono inline-flex items-center gap-2 text-muted', className)}>
      <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-signal' aria-hidden='true' />
      {children}
    </span>
  )
}

// 40px lime square with an arrow; the only place the accent fills a shape
export function ArrowLink({ href, label, external = false, className }) {
  const cls = cn('arrow-btn', className)
  const icon = <ArrowRight className='h-4 w-4' strokeWidth={1.75} aria-hidden='true' />
  if (external) {
    return (
      <a href={href} target='_blank' rel='noopener noreferrer' aria-label={label} className={cls}>
        {icon}
      </a>
    )
  }
  return (
    <Link href={href} aria-label={label} className={cls}>
      {icon}
    </Link>
  )
}

/*
  Two-part CTA with slanted inner edges: dark label + lime arrow, after the Integrated Bio button.
  Each part is a rounded block plus a skewed rounded block, so the slant keeps soft corners.
*/
// In-page links (#id) glide to their section instead of jumping
const glide = (href) => (e) => {
  if (!href?.startsWith('#')) return
  e.preventDefault()
  scrollToId(href.slice(1))
}

export function SlantCTA({ href, children, className }) {
  const skew = 'absolute inset-y-0 w-8 -skew-x-[14deg] rounded-[10px] transition-colors duration-200'
  return (
    <div className={cn('flex items-stretch gap-2', className)}>
      <a href={href} onClick={glide(href)} className='group relative isolate inline-flex h-12 items-center pl-6 pr-9 text-white'>
        <span className='absolute inset-y-0 left-0 right-4 -z-10 rounded-l-[10px] bg-abyss transition-colors duration-200 group-hover:bg-[#2e3f40]' />
        <span className={cn(skew, 'right-1 -z-10 bg-abyss group-hover:bg-[#2e3f40]')} />
        <span className='t-mono'>{children}</span>
      </a>
      <a href={href} onClick={glide(href)} aria-label={typeof children === 'string' ? children : undefined} className='group relative isolate grid h-12 w-14 place-items-center text-abyss'>
        <span className='absolute inset-y-0 left-4 right-0 -z-10 rounded-r-[10px] bg-signal transition-colors duration-200 group-hover:bg-[#dcfbb7]' />
        <span className={cn(skew, 'left-1 -z-10 bg-signal group-hover:bg-[#dcfbb7]')} />
        <ArrowRight className='h-4 w-4 translate-x-0.5 transition-transform duration-200 group-hover:translate-x-1.5' strokeWidth={1.75} aria-hidden='true' />
      </a>
    </div>
  )
}
