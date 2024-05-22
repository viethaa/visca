import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import MapContainer from '@/components/map/MapContainer'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | VISCA</title>
      </Head>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <div className='flex-grow'>
          <MapContainer />
        </div>
        <Footer />
      </div>
    </>
  )
}
