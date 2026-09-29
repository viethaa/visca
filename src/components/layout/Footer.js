import { Sheet } from '../Reveal'
import { cn } from '@/lib/utils'

// A hairline and a small copyright line. On the home page it sits inside the last section.
export function FooterNote({ className }) {
  return (
    <footer className={cn('border-t border-line py-6', className)}>
      <p className='font-mono text-[14px] text-muted'>
        © {new Date().getFullYear()} Vietnam Int. School Counselor Association (VISCA)
      </p>
    </footer>
  )
}

// Other pages: the same note in a light closing panel
export default function Footer() {
  return (
    <Sheet as='div' grow={false} className='band-light'>
      <div className='wrap'>
        <FooterNote className='border-t-0' />
      </div>
    </Sheet>
  )
}
