import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import MapContainer from '@/components/map/MapContainer'
import { Button } from '@/components/ui/button'
import Head from 'next/head'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import List from '@/components/List'
import data from '@/data.json'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | VISCA</title>
      </Head>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-grow p-4 sm:p-8'>
          {/* <div className='flex flex-row m-4 sm:m-8 justify-center gap-4'>
            <Link
              href={'/schools'}
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Schools List
            </Link>
          </div> */}

          <div className='max-w-5xl mx-auto'>
            <div className='flex flex-col gap-4'>
              <p className='sm:mb-4 max-w-4xl mx-auto text-center'>
                Welcome to VISCA, your go-to resource for comprehensive
                counselor contacts and detailed school information for
                international schools in Hanoi. Simplifying your search for the
                best educational opportunities and support.
              </p>
              <MapContainer />
              <div className='mx-auto w-full'>
                <List schools={data.schools} />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
