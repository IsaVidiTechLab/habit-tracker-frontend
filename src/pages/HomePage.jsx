import React, { useState } from 'react'
import Calendar from '../components/Calendar'
import nodata from '../assets/no-data.png'
import AllHabits from '../components/AllHabits'

function HomePage() {

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  
  return (
    <div className='flex flex-col justify-center '>
      <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
      <AllHabits selectedDate = {selectedDate}/>
    </div>
  )
}

export default HomePage