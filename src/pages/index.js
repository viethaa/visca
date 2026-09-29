import { useState } from 'react'
import Head from 'next/head'
import Hero from '@/components/home/Hero'
import FairStrip from '@/components/home/FairStrip'
import Directory from '@/components/home/Directory'
import PlanVisit from '@/components/home/PlanVisit'
import HotelsTeaser from '@/components/home/HotelsTeaser'
import { loadSchools } from '@/lib/loadSchools'
import { ScrollProgress, useSectionSnap } from '@/components/ScrollCues'

const SECTIONS = [
  { id: 'top', label: 'Home' },
  { id: 'schools', label: 'Member schools' },
  { id: 'plan', label: 'Plan a visit' },
  { id: 'stay', label: 'Hotels' },
]
const SECTION_IDS = SECTIONS.map((s) => s.id)

// Keep spreadsheet order: DO NOT SORT.
export async function getStaticProps() {
  return {
    props: { schools: await loadSchools() },
    revalidate: 60,
  }
}

export default function Home({ schools }) {
  useSectionSnap(SECTION_IDS)
  // Shared by the hero search and the directory filter
  const [query, setQuery] = useState('')

  return (
    <>
      <Head>
        <title>VISCA | Hanoi international school counselors</title>
        <meta
          name='description'
          content='Counselor contacts, visit times and directions for VISCA member schools in Hanoi, for visiting university representatives.'
        />
        <meta property='og:title' content='VISCA | Visit Hanoi’s international schools' />
        <meta
          property='og:description'
          content='Counselor contacts and preferred visit times for VISCA member schools in Hanoi.'
        />
        <meta property='og:type' content='website' />
      </Head>

      <ScrollProgress />
      <Hero />
      <main id='main'>
        <Directory schools={schools} query={query} setQuery={setQuery} />
        <PlanVisit />
        <HotelsTeaser />
        <FairStrip />
      </main>
    </>
  )
}
