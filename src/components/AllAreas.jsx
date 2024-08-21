import axios from 'axios';
import React, { useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllAreas({ storedToken, onEdit, areas, setAreas, refreshKey }) {
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchAreas = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/areas`, {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
            setAreas(response.data);
        } catch (error) {
            console.error('Error fetching areas:', error);
            toast.error('Failed to load areas. Please try again later.');
        }
    };

    useEffect(() => {
        fetchAreas();
    }, [storedToken, refreshKey]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this area?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_URL}/api/areas/${id}`, {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
            fetchAreas();
            toast.success('Area deleted successfully!');
        } catch (error) {
            console.error('Error deleting area:', error);
            toast.error('Failed to delete area. Please try again.');
        }
    };

    const handleEdit = (area) => {
        onEdit(area);
    };

    return (
        <>
        <div>
            <ul className='flex flex-col text-sm'>
                {areas.map((area) => (
                    <li key={area._id} className="w-72 self-center px-4 py-2 border border-gray text-gray-700 rounded-md mb-2 flex items-center justify-between">
                        {area.areaName}
                        <div>
                            <FaEdit onClick={() => handleEdit(area)} className="inline ml-2 cursor-pointer hover:text-blue-700" />
                            <FaTrash onClick={() => handleDelete(area._id)} className="inline ml-2 cursor-pointer hover:text-red-700" />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
       
        </>
    );
}

export default AllAreas;
