import React from 'react'
import Calendar from '../components/Calendar'
import nodata from '../assets/no-data.png'

function HomePage() {
  return (
    <div className='flex flex-col justify-center '>
      <Calendar />
      <img src={nodata} width={200} height={200} className='mt-16 self-center'/>
    </div>
  )
}

export default HomePage