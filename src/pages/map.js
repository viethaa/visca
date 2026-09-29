import Head from 'next/head'
import Header from '@/components/layout/Header'
import MapExplorer from '@/components/map/MapExplorer'
import { loadSchools } from '@/lib/loadSchools'

// Keep spreadsheet order: DO NOT SORT.
export async function getStaticProps() {
  return {
    props: { schools: await loadSchools() },
    revalidate: 60,
  }
}

// One inset rounded map filling the screen, with the header floating on it (like the other page openers)
export default function MapPage({ schools }) {
  return (
    <>
      <Head>
        <title>Map | VISCA</title>
        <meta name='description' content='Map of VISCA member schools, nearby hotels, the airport and central Hanoi.' />
      </Head>

      <div className='band-dark h-[100dvh] p-2 md:p-3'>
        <main
          id='main'
          className='relative h-full overflow-hidden rounded-[22px] [clip-path:inset(0_round_22px)] md:rounded-[28px] md:[clip-path:inset(0_round_28px)]'
        >
          <MapExplorer schools={schools} />
          <Header overlay />
        </main>
      </div>
    </>
  )
}
