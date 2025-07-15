import { useState, useEffect } from 'react'
import FontAwesomeLibrary from './icons/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './App.css'

function App() {
  

  return (
    <>
      <header className={`bg-gray-700 text-center p-4 rounded-lg text-sky-100`}>
        <img className={`w-40 rounded-full mx-auto border-6 border-dotted border-pink-300`} src='https://randomuser.me/api/portraits/women/44.jpg'></img>
        <div>
          <p >Hi, my name is...</p>
          <p className='text-pink-300 text-4xl my-8 '>(Samira)</p>
        </div>
        <button className='bg-sky-100 text-gray-700 p-4 w-3/5 font-mono font-bold text-xl rounded-xl hover:shadow-md hover:shadow-red-500 hover:cursor-pointer'>Refresh</button>
      </header>
      <main className={`bg-gray-700 text-sky-100 rounded-lg p-4 my-4`}>
        <h2 className='font-mono font-bold text-xl text-center underline my-8'>Here's more about me:</h2>
        <div className='flex flex-wrap justify-center gap-4'>
          <section className='flex items-center gap-x-2'>
            <FontAwesomeIcon icon="fa-solid fa-envelope" className='text-xl text-rose-500'/>
            <p>(example@gmail.com)</p>
          </section>
          <section className='flex items-center gap-x-2 mx-auto'>
            <FontAwesomeIcon icon="fa-solid fa-map-location-dot" className='text-xl text-green-500' />
            <p>(London, UK)</p>
          </section>
          <section className='flex items-center gap-x-2'>
            <FontAwesomeIcon icon="fa-solid fa-phone" className='text-xl text-violet-500' />
            <p>(+1-849-678-971)</p>
          </section>
          <section className='flex items-center gap-x-2'>
            <FontAwesomeIcon icon="fa-solid fa-cake-candles" className='text-xl text-amber-500' />
            <p>(04/05/1960)</p>
          </section>
        </div>
      </main>
    </>
  )
}

export default App
