import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style/monthlyCalendar.css';
import CompletionChart from '../components/CompletionChart';

function DailyHabitsPage() {
  const [date, setDate] = useState(new Date());
  const [monthlyCompletionPercentage, setMonthlyCompletionPercentage] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchMonthlyCompletionPercentage();
  }, [date]);

  const fetchMonthlyCompletionPercentage = async () => {
    try {
      const habitResponse = await axios.get(`${API_URL}/api/habits`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });

      const dailyHabitsResponse = await axios.get(`${API_URL}/api/dailyHabits`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      });

      const currentMonth = new Date(date).getMonth();
      const currentYear = new Date(date).getFullYear();

      // Filter to get only the habits for the selected month
      const monthlyHabits = dailyHabitsResponse.data.filter(dailyHabit => {
        const habitDate = new Date(dailyHabit.date);
        return (
          habitDate.getMonth() === currentMonth &&
          habitDate.getFullYear() === currentYear
        );
      });

      // Total number of habits expected in the month
      const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const totalHabitsForMonth = habitResponse.data.length * totalDaysInMonth;

      // Count the completed habits for the month
      const completedHabitsForMonth = monthlyHabits.filter(dailyHabit => dailyHabit.completion).length;

      // Calculate the percentage
      const percentage = totalHabitsForMonth > 0 ? (completedHabitsForMonth / totalHabitsForMonth) * 100 : 0;
      setMonthlyCompletionPercentage(percentage);

    } catch (error) {
      console.error("Error fetching monthly completion stats:", error);
    }
  };

  return (
    <div className='flex flex-col items-center p-5 h-screen pt-20 md:pt-10 overflow-auto'>
      <h1 className='font-semibold text-2xl text-gray-700 mb-4'>Monthly Stats</h1>
      <div className='flex flex-col mt-4 p-8 items-center justify-center text-center border rounded-lg text-sm bg-white shadow-lg'>
        <Calendar
          onChange={setDate}
          value={date}
          tileClassName={({ date, view }) =>
            date.toDateString() === new Date().toDateString() ? 'highlight' : null
          }
        />
      </div>
      <div className='mt-10'>
        <CompletionChart percentage={monthlyCompletionPercentage} />
      </div>
    </div>
  );
}

export default DailyHabitsPage;
