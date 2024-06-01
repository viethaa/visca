import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <>
      <header
        className="relative bg-slate-800 text-white font-sans"
        style={{
          backgroundImage: "url('https://cdn.pixabay.com/photo/2020/04/23/14/16/water-5082682_1280.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-black opacity-20"></div>
        <div className="flex items-center justify-between p-4">
          <div className="p-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/2000px-Flag_of_Vietnam.svg.png" 
              alt="Vietnam Flag" 
              className="h-12 w-16 object-cover"
            />
          </div>

          <div className="flex gap-4">
            <div className="bg-gray-700 p-2 rounded hover:bg-gray-500 flex items-center justify-center">
              <Link href="/">Home</Link>
            </div>
            <div className="bg-gray-700 p-2 rounded hover:bg-gray-500 flex items-center justify-center">
              <Link href="/contact">Contact Directory</Link>
            </div>
            <div className="bg-gray-700 p-2 rounded hover:bg-gray-500 flex items-center justify-center">
              <Link href="/search">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center my-8">
          <h1 className="font-bold text-3xl md:text-5xl mb-4 text-center animate-fadeIn">
            Vietnam International School Counselors Association (VISCA)
          </h1>
          <p className="text-xl md:text-2xl text-center animate-fadeIn mb-6">
            Empowering Education, Building Futures
          </p>
        </div>
      </header>
      <div
        className="body-section flex-grow text-white p-8 flex items-center justify-center"
      >
        <div className="max-w-6xl mx-auto text-center p-4">
          <h2 className="text-3xl mb-2 text-black">Welcome to VISCA</h2>
          <p className="text-lg text-black mb-4">
            Welcome to the Vietnam International School Counselors Association (VISCA). We are
            committed to providing exceptional counseling services to students and educators across
            Vietnam. Our mission is to empower education and build futures by fostering a
            supportive and nurturing environment for academic and personal growth.
          </p>
        </div>
      </div>
    </>
  )
}
