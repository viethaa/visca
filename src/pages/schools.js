import React from 'react'
import Head from 'next/head'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import List from '@/components/List'
import data from '@/data.json'

export default function SchoolsListPage() {
  return (
    <>
      <Head>
        <title>Schools List | VISCA</title>
      </Head>
      <div className='flex min-h-screen flex-col font-sans'>
        <Header />
        <div className='flex-grow p-8'>
          <h2 className='scroll-m-20 w-fit mx-auto text-3xl font-semibold tracking-tight first:mt-0 text-center'>
            International Schools Database
          </h2>
          <div className='mx-auto mt-4'>
            <List schools={data.schools} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
