import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import MapContainer from '@/components/map/MapContainer'
import { Button } from '@/components/ui/button'
import Head from 'next/head'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | VISCA</title>
      </Head>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-grow'>
          <div className='flex flex-row mx-8 mt-8 justify-center gap-4'>
            <Link
              href={'/schools'}
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Schools List
            </Link>
          </div>
          <MapContainer />
        </main>
        <Footer />
      </div>
    </>
  )
}
