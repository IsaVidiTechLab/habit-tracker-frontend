import React, { useState } from 'react';
import AddHabit from '../components/AddHabit';
import HabitsList from '../components/HabitsList';

function HabitPage() {

    const storedToken = localStorage.getItem("authToken");
    const [editingHabit, setEditingHabit] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
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
                    triggerRefresh={triggerRefresh}
                />
                <HabitsList 
                    storedToken={storedToken} 
                    onEdit={handleEdit} 
                    refreshKey={refreshKey}  
                />
            </div>
        </div>
    );
}

export default HabitPage;
