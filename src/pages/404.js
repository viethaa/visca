import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Tag } from '@/components/Lab'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found | VISCA</title>
      </Head>
      {/* Fills the screen so the footer sits at the bottom, even on phones */}
      <div className='band-dark dots flex min-h-[100svh] flex-col'>
        <Header />
        <main id='main' className='wrap flex-1 pb-20 pt-14 md:pb-28 md:pt-20'>
          <Tag>Error 404</Tag>
          <h1 className='t-hero mt-8 max-w-[12ch]'>This page doesn’t exist.</h1>
          <div className='mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between'>
            <p className='t-sub max-w-[34ch] text-muted'>
              The link may be old, or the school may have moved. Find it in the directory or on the map.
            </p>
            <div className='flex flex-wrap gap-2'>
              <Link href='/#schools' className='btn-primary'>
                All schools
              </Link>
              <Link href='/map' className='btn-ghost'>
                Open the map
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
