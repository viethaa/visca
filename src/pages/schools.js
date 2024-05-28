import React from 'react'
import Head from 'next/head'
import Footer from '@/components/layout/Footer'

export default function SchoolsListPage() {
  return (
    <>
      <Head>
        <title>Schools List | VISCA</title>
      </Head>
      <div className='flex min-h-screen flex-col'>
        <div className='flex-grow'></div>
        <Footer />
      </div>
    </>
  )
}
