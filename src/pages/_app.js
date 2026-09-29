import '@/styles/globals.css'
import { Inter_Tight, Roboto_Mono } from 'next/font/google'
import { MotionConfig } from 'framer-motion'

// One weight for everything; hierarchy comes from size and tracking (stand-in for Aspekta 400)
const sans = Inter_Tight({ subsets: ['latin', 'vietnamese'], weight: ['400'], display: 'swap' })
// Labels, nav, buttons, counters
const mono = Roboto_Mono({ subsets: ['latin', 'vietnamese'], weight: ['400'], display: 'swap' })

export default function App({ Component, pageProps }) {
  return (
    <MotionConfig reducedMotion='user'>
      {/* Set on :root so dialogs and sheets rendered in portals get them too */}
      <style jsx global>{`
        :root {
          --font-sans: ${sans.style.fontFamily};
          --font-mono: ${mono.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </MotionConfig>
  )
}
