import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import MapContainer from '@/components/map/MapContainer'
import Head from 'next/head'
import List from '@/components/List'
import data from '@/data.json'
import { fetchSchools } from '@/functions'
import Image from 'next/image'
import AdDialog from '@/components/AdDialog'
import { ChevronRight } from 'lucide-react'

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
          className="flex-grow p-4 sm:p-8 bg-gradient-to-br from-black via-neutral-950 to-black text-white"
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col gap-10">

              {/* Section Header (arrow shown, always open) */}
              <div className="flex items-center gap-3 mt-10 sm:mt-12 mb-6">
                <div className="inline-flex items-center select-none cursor-default">
                  {/* Arrow bigger + spacing */}
                  <ChevronRight className="h-6 w-6 rotate-90 text-zinc-300 mr-2" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    School Information
                  </span>
                </div>
                {/* brighter divider line */}
                <div className="ml-3 h-[1px] flex-1 bg-gradient-to-r from-zinc-300/90 via-zinc-200/70 to-transparent" />
              </div>
              {/* Content (always visible) */}
              <div className="space-y-6">
                <div className="w-full">
                  <List schools={schools} />
                </div>

                {/* Legend */}
                {/* <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-black border border-zinc-600"></div>
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
                </div> */}
              </div>

              <div className="flex items-center gap-3 mt-10 sm:mt-12 mb-6">
                <div className="inline-flex items-center select-none cursor-default">
                  {/* Arrow bigger + spacing */}
                  <ChevronRight className="h-6 w-6 rotate-90 text-zinc-300 mr-2" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    Locations
                  </span>
                </div>
                {/* brighter divider line */}
                <div className="ml-3 h-[1px] flex-1 bg-gradient-to-r from-zinc-300/90 via-zinc-200/70 to-transparent" />
              </div>

              {/* Map always visible below */}
              <MapContainer schools={schools} />
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </>
  )
}
