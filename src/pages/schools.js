import React from 'react'
import Head from 'next/head'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function SchoolsListPage() {
  return (
    <>
      <Head>
        <title>Schools List | VISCA</title>
      </Head>
      <div className='flex min-h-screen flex-col font-sans'>
        <Header />
        <div className='flex-grow'></div>
        <Footer />
      </div>
    </>
  )
}
