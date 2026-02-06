import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
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

              {/* Clean Modern College Registration Header */}
              <div id="information" className="flex items-center mt-8 sm:mt-10 mb-6">
                <div className="flex items-center gap-3">
                  {/* Sleek accent dot */}
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                  <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-wide">
                    Register for VISCA Schools
                  </h2>
                </div>
                {/* Minimal divider */}
                <div className="flex-1 ml-6 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>
              {/* Content (always visible) */}
              <div className="space-y-6">
                <div className="w-full">
                  <List schools={schools} />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </>
  )
}
