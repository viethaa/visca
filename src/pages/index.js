import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import MapContainer from '@/components/map/MapContainer'
import Head from 'next/head'
import List from '@/components/List'
import data from '@/data.json'
import { fetchSchools } from '@/functions'
import Image from 'next/image'
import AdDialog from '@/components/AdDialog'

// Keep spreadsheet order: DO NOT SORT.
export async function getStaticProps() {
  let schools = []

  try {
    const SHEET_ID = process.env.SPREADSHEET_ID

    if (typeof SHEET_ID === 'string' && SHEET_ID.length > 0) {
      // Use the sheet order as returned by your fetcher
      schools = await fetchSchools(SHEET_ID)
    } else {
      // Fallback to local data.json (keeps file order)
      schools = Array.isArray(data?.schools) ? data.schools : (Array.isArray(data) ? data : [])
    }
  } catch (err) {
    // Safety net: never fail the build; use local data
    schools = Array.isArray(data?.schools) ? data.schools : (Array.isArray(data) ? data : [])
  }

  // Normalize only; DO NOT change order.
  schools = (Array.isArray(schools) ? schools : []).filter(Boolean)

  return {
    props: { schools },
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
      <div className="flex min-h-screen flex-col">
        <Header />
        <main
          id="map-container"
          className="flex-grow p-4 sm:p-8 bg-gradient-to-tr from-black/90 via-black/85 to-black/80 text-white"
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
              <div className="mx-auto text-center flex flex-col gap-1 sm:gap-2">
                <h2 className="text-xl font-semibold text-black">
                  Welcome to VISCA!
                </h2>
                <p className="sm:mb-4 max-w-4xl mx-auto text-center">
                  Welcome to the Vietnam International School Counselors
                  Association - Hanoi (VISCA).
                </p>
              </div>

              <div className="mx-auto w-full">
                <List schools={schools} />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-black"></div>
                  <span className="text-sm font-semibold">Schools</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-cyan-500"></div>
                  <span className="text-sm font-semibold">Hotels</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-gray-400"></div>
                  <span className="text-sm font-semibold">Places</span>
                </div>
              </div>

              <MapContainer schools={schools} />
            </div>
          </div>
        </main>

        <AdDialog />
        {/* <Footer /> */}
      </div>
    </>
  )
}
