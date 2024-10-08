import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function HabitsList({ storedToken, onEdit, habits, setHabits }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [areas, setAreas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const fetchAreas = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/areas`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            setAreas(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, [API_URL, storedToken]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this Habit?');
        if (!confirmDelete) return;
        try {
            await axios.delete(`${API_URL}/api/habits/${id}`, {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
            setHabits(habits.filter(habit => habit._id !== id)); // Remove the deleted habit
            toast.success('Habit deleted successfully!');
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete Habit. Please try again.');
        }
    };

    const getAreaName = (areaId) => {
        const area = areas.find(area => area._id === areaId);
        return area ? area.areaName : 'Unknown Area';
    };

    const indexOfLastHabit = currentPage * itemsPerPage;
    const indexOfFirstHabit = indexOfLastHabit - itemsPerPage;
    const currentHabits = habits.slice(indexOfFirstHabit, indexOfLastHabit);

    const totalPages = Math.ceil(habits.length / itemsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className=''>
            <h2 className='mt-10 text-lg font-semibold'>Habits List</h2>
            <ul className='flex flex-col'>
                {currentHabits.map((habit) => (
                    <li 
                        key={habit._id} 
                        className="border rounded-md w-96 p-4 my-2"
                        style={{
                            backgroundColor: habit.color ? `${habit.color}50` : 'rgba(200, 200, 200)' 
                        }}
                    >  
                        <div className='flex justify-between items-center'>
                            <div className='flex items-start'>
                                <img 
                                    src={habit.icon} 
                                    alt="icon" 
                                    className='w-8 h-8 mr-5 self-center'
                                />
                                <div className='flex flex-col'>
                                    <p className='font-bold text-gray-700'>{habit.name}</p>
                                    <p className='text-gray-700 pr-2'><b>Description:</b> {habit.description}</p>
                                </div>
                            </div>
                            <div className='flex gap-2'>
                                <FaEdit 
                                    onClick={() => onEdit(habit)} 
                                    className="cursor-pointer text-gray-700 hover:text-blue-500" 
                                />
                                <FaTrash 
                                    onClick={() => handleDelete(habit._id)} 
                                    className="cursor-pointer text-gray-700 hover:text-red-800" 
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
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
        </div>
    );
}

export default HabitsList;
