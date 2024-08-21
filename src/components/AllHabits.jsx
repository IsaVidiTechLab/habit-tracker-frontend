import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CompletionChart from './CompletionChart';
import Nodata from '../assets/no-data.png'
import { FaCheck } from "react-icons/fa";

function AllHabits({ selectedDate }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const storedToken = localStorage.getItem("authToken");
  const [habits, setHabits] = useState([]);
  const [doneHabits, setDoneHabits] = useState({});
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    fetchHabitsAndCompletion();
  }, [selectedDate]);

  const fetchHabitsAndCompletion = async () => {
    try {
      const habitResponse = await axios.get(`${API_URL}/api/habits`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });
      setHabits(habitResponse.data);

      const dailyHabitsResponse = await axios.get(`${API_URL}/api/dailyHabits`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });

      const doneHabitsMap = dailyHabitsResponse.data.reduce((acc, dailyHabit) => {
        if (new Date(dailyHabit.date).toDateString() === new Date(selectedDate).toDateString() && dailyHabit.completion) {
          acc[dailyHabit.habitId] = true;
        }
        return acc;
      }, {});

      setDoneHabits(doneHabitsMap);

      const totalHabits = habitResponse.data.length;
      const completedHabits = Object.keys(doneHabitsMap).length;
      const percentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
      setCompletionPercentage(percentage);
      
    } catch (error) {
      console.error("Error fetching habits and completion status:", error);
    }
  };

  const handleDailyHabits = async (habitId, userId, habitColor) => {
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
        [habitId]: true,
      }));
      
      const totalHabits = habits.length;
      const completedHabits = Object.keys(doneHabits).length + 1;
      const percentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
      setCompletionPercentage(percentage);
    } catch (error) {
      console.error("Error posting daily habit:", error);
    }
  };

  return (
    <div className='self-center mt-9'>
      
      {habits.length > 0 ? (
        <div className='flex flex-col gap-4 mb-9'>
          {habits.map((habit) => (
            <div
              key={habit._id}
              className="flex flex-row justify-between border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 text-center items-center align-middle gap-16"
              style={{
                backgroundColor: doneHabits[habit._id] ? habit.color : `${habit.color}50`, 
              }}
            >
              <div className="flex flex-row gap-8">
                <img src='./vite.svg' width="24" alt="" />
                <p className='font-semibold'>{habit.name}</p>
              </div>         
              <button
                className='text-green-600 hover:text-green-800'
                onClick={() => { handleDailyHabits(habit._id, habit.userId, habit.color); }}
              >
                <FaCheck />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <img src={Nodata} alt="No habits found for this date." />
      )}

      <CompletionChart percentage={completionPercentage} />
    </div>
  );
}

export default AllHabits;
