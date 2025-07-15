import { useState, useEffect, useCallback } from 'react'
import FontAwesomeLibrary from './icons/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './App.css'
import { faL } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

function App() {
  const [ userInfo, setUserInfo ] = useState({})
  const [ isWomen, setIsWomen ] = useState(true)
  const bgGenderColor = isWomen ? "border-pink-300" : "border-blue-500"
  const textGenderColor = isWomen ? "text-pink-300" : "text-blue-500"

    const handleRefresh = useCallback(async() => {
      try {
        const response = await axios.get('https://randomuser.me/api/')
        const data = response.data.results[0]
        console.log(data.gender)
        const date =new Date(data.dob.date)
        setUserInfo({
          "gender" : data.gender,
          "name": `${data.name.first} ${data.name.last}`,
          "location": `${data.location.state} ${data.location.country}`,
          "email": data.email,
          "birthday": date.toLocaleDateString(),
          "phone": date.phone,
          "image": data.picture.large
        })

        setIsWomen(data.gender === "female" ? true : false)
      } catch(err) {
        console.error("An error has ocurred: " + err)
      }
    }
  )

  useEffect(() => {
    handleRefresh
  }, [handleRefresh])

  

  return (
    <>
      <header className={`bg-gray-700 text-center p-4 rounded-lg text-sky-100 md:w-3/5`}>
        <img className={`w-40 rounded-full mx-auto border-6 border-dotted ${bgGenderColor} lg:w-60`} src={userInfo.image || "https://randomuser.me/api/portraits/women/32.jpg"}></img>
        <div>
          <p >Hi, my name is...</p>
          <p className={`${textGenderColor} text-4xl my-8 lg:text-6xl`}>{ userInfo.name || "Samira"}</p>
        </div>
        <button onClick={handleRefresh} className='bg-sky-100 text-gray-700 p-4 w-3/5 font-mono font-bold text-xl rounded-xl hover:shadow-md hover:shadow-red-500 hover:cursor-pointer lg:w-full'>Refresh</button>
      </header>
      <main className={`bg-gray-700 text-sky-100 rounded-lg p-4 my-4 md:2/5 md:my-0`}>
        <h2 className='font-mono font-bold text-xl text-center underline my-8'>Here's more about me:</h2>
        <div className='flex flex-wrap justify-center gap-4 md:flex-col md:items-center'>
          <section className='flex items-center gap-x-2'>
            <FontAwesomeIcon icon="fa-solid fa-envelope" className='text-xl text-rose-500'/>
            <p>{ userInfo.email ||" example@gmail.com"}</p>
          </section>
          <section className='flex items-center gap-x-2 mx-auto'>
            <FontAwesomeIcon icon="fa-solid fa-map-location-dot" className='text-xl text-green-500' />
            <p>{ userInfo.location || "London, UK"}</p>
          </section>
          <section className='flex items-center gap-x-2'>
            <FontAwesomeIcon icon="fa-solid fa-phone" className='text-xl text-violet-500' />
            <p>{ userInfo.phone || "+1-849-678-971"}</p>
          </section>
          <section className='flex items-center gap-x-2'>
            <FontAwesomeIcon icon="fa-solid fa-cake-candles" className='text-xl text-amber-500' />
            <p>{ userInfo.birthday || "04/05/1960"}</p>
          </section>
        </div>
      </main>
    </>
  )
}

export default App
