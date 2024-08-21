import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CompletionChart from './CompletionChart';
import Nodata from '../assets/no-data.png';

function AllHabits({ selectedDate }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const storedToken = localStorage.getItem("authToken");
    const [habits, setHabits] = useState([]);
    const [doneHabits, setDoneHabits] = useState({});
    const [completionPercentage, setCompletionPercentage] = useState(0);

   
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 

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
                if (new Date(dailyHabit.date).toDateString() === new Date(selectedDate).toDateString()) {
                    acc[dailyHabit.habitId] = dailyHabit.completion;
                }
                return acc;
            }, {});

            setDoneHabits(doneHabitsMap);

            const totalHabits = habitResponse.data.length;
            const completedHabits = Object.values(doneHabitsMap).filter(Boolean).length;
            const percentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
            setCompletionPercentage(percentage);

        } catch (error) {
            console.error("Error fetching habits and completion status:", error);
        }
    };

    const toggleCompletion = async (habitId, userId) => {
        const isCompleted = doneHabits[habitId];

        const requestBody = {
            userId: userId,
            habitId: habitId,
            completion: !isCompleted, 
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

            console.log("Updated DailyHabit:", response.data);

            setDoneHabits((prev) => ({
                ...prev,
                [habitId]: !isCompleted, 
            }));

            const totalHabits = habits.length;
            const completedHabits = Object.values(doneHabits).filter(Boolean).length + (!isCompleted ? 1 : -1);
            const percentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
            setCompletionPercentage(percentage);
        } catch (error) {
            console.error("Error updating daily habit:", error);
        }
    };

    // Pagination logic
    const indexOfLastHabit = currentPage * itemsPerPage;
    const indexOfFirstHabit = indexOfLastHabit - itemsPerPage;
    const currentHabits = habits.slice(indexOfFirstHabit, indexOfLastHabit);

    const totalPages = Math.ceil(habits.length / itemsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='self-center mt-9'>
            {habits.length > 0 ? (
                <div className='flex flex-col gap-4 mb-9'>
                    {currentHabits.map((habit) => (
                        <div
                            key={habit._id}
                            className="flex flex-row justify-between border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 text-center items-center align-middle gap-16"
                            style={{
                                backgroundColor: doneHabits[habit._id] ? habit.color : `${habit.color}50`,
                            }}
                        >
                            <div className="flex flex-row gap-8">
                                <img src={habit.icon} width="24" alt="" />
                                <p className='font-semibold'>{habit.name}</p>
                            </div>
                            <div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={doneHabits[habit._id] || false}
                                        onChange={() => toggleCompletion(habit._id, habit.userId)}
                                    />
                                    <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
                                     dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
                                      peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white
                                       after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-800"></div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <img src={Nodata} alt="No habits found for this date." />
            )}

            {/* Pagination Controls */}
            {habits.length > itemsPerPage && (
                <div className='flex justify-center mt-4'>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handleClick(index + 1)}
                            style={{
                                margin: "0 5px",
                                padding: "5px 10px",
                                backgroundColor: currentPage === index + 1 ? '#76ABAE' : '#eeeeee',
                                color: currentPage === index + 1 ? '#ffffff' : '#000000',
                                border: '1px solid #76ABAE',
                                cursor: 'pointer'
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}

            <CompletionChart percentage={completionPercentage} />
        </div>
    );
}

export default AllHabits;
