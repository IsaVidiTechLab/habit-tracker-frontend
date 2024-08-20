import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddHabit from '../components/AddHabit';
import HabitsList from '../components/HabitsList';

function HabitPage() {
    const storedToken = localStorage.getItem("authToken");
    const [editingHabit, setEditingHabit] = useState(null);
    const [habits, setHabits] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchHabits = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/habits`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            setHabits(response.data.reverse());
        } catch (error) {
            console.log("Error fetching habits:", error);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, [API_URL, storedToken]);

    const handleHabitAdded = async () => {
        await fetchHabits(); // Refetch habits after adding a new one
    };

    const handleEdit = (habit) => {
        setEditingHabit(habit);
    };

    return (
        <div className='flex flex-col items-center p-5 h-screen pt-20 md:pt-10 overflow-auto'>
            <h1 className='font-semibold text-2xl text-gray-700 mb-4'>Create Your Habits</h1>
            <div className='habit-info'>
                <AddHabit 
                    storedToken={storedToken} 
                    editingHabit={editingHabit} 
                    setEditingHabit={setEditingHabit} 
                    habits={habits}
                    setHabits={setHabits}
                    onHabitAdded={handleHabitAdded}
                />
                <HabitsList 
                    storedToken={storedToken} 
                    onEdit={handleEdit} 
                    habits={habits}
                    setHabits={setHabits}
                />
            </div>
        </div>
    );
}

export default HabitPage;
