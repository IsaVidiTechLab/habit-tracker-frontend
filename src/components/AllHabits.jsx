import React, { useEffect, useState } from 'react'
import axios from 'axios';


function AllHabits({selectedDate}) {
    const API_URL = import.meta.env.VITE_API_URL;
    const storedToken = localStorage.getItem("authToken");
    const [habits, setHabits] = useState([]);
    const [doneHabits, setDoneHabits] = useState({});


    useEffect(()=>{
        fetchHabits();
    },[])

    const fetchHabits = async() => {
        try {
            const response = await axios.get(`${API_URL}/api/habits`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            setHabits(response.data);
            console.log("All Habits", response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDailyHabits = async(habitId, userId,habitColor) => {
       
        const requestBody = {   
            userId: userId,
            habitId: habitId,
            completion: true,
            date: selectedDate
          };

          try {
            const response = await axios.post(
                `${API_URL}/api/dailyHabits`,
                requestBody,
                {
                    headers: { Authorization: `Bearer ${storedToken}` },
                }
            );

            console.log("New DailyHabit:", response.data);

            setDoneHabits((prev) => ({
                ...prev,
                [habitId]: habitColor,
            }));
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='self-center mt-9'>
      {habits && 
      <div className='flex flex-col gap-4'>
        {habits.map((habit)=>(
            <div 
            key={habit._id}
            className=" flex flex-row justify-between border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 text-center items-center align-middle gap-16"
            style={{
                    backgroundColor: doneHabits[habit._id]
                    ? doneHabits[habit._id]
                    : 'bg-purple-50', // Default background if not done
                    }}
            >
                <div className=" flex flex-row gap-8">
                    <img src='./vite.svg' width="24" alt="" />
                    <p className='font-semibold'>{habit.name}</p>
                </div>         
                <button className='font-semibold text-green-600 hover:text-green-800' onClick={()=>{handleDailyHabits(habit._id, habit.userId,habit.color)}}>Done</button>
            </div>
        ))}
      </div>}

    </div>
  )
}

export default AllHabits
