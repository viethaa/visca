import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import MapContainer from '@/components/map/MapContainer'
import Head from 'next/head'
import List from '@/components/List'
import data from '@/data.json'
import { fetchSchools } from '@/functions'
import Image from 'next/image'
import AdDialog from '@/components/AdDialog'

export async function getStaticProps() {
  const schools = await fetchSchools(process.env.SPREADSHEET_ID)

  //order schools by name
  schools.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })

  return {
    props: {
      schools,
    },

    revalidate: 60,
  }
}

export default function Home({ schools }) {
  console.log(schools)
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
              <div className='mx-auto text-center flex flex-col gap-1 sm:gap-2'>
                <h2 className='text-xl font-semibold text-black'>
                  Welcome to VISCA!
                </h2>
                <p className='sm:mb-4 max-w-4xl mx-auto text-center'>
                  Welcome to the Vietnam International School Counselors
                  Association - Hanoi (VISCA).
                </p>
              </div>
              <div className='flex gap-6'>
                <div className='flex items-center gap-1.5'>
                  <div className='w-4 h-4 rounded bg-black'></div>
                  <span className='text-sm font-semibold'>Schools</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <div className='w-4 h-4 rounded bg-cyan-500'></div>
                  <span className='text-sm font-semibold'>Hotels</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <div className='w-4 h-4 rounded bg-gray-400'></div>
                  <span className='text-sm font-semibold'>Places</span>
                </div>
              </div>

              <MapContainer schools={schools} />
              <div className='mx-auto w-full'>
                <List schools={schools} />
              </div>
            </div>
          </div>
        </main>
        <AdDialog />
        {/* <Footer /> */}
      </div>
    </>
  )
}
