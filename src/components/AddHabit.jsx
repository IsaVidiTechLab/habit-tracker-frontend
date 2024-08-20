import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";

function AddHabit({ storedToken, editingHabit, setEditingHabit, habits, setHabits, triggerRefresh }) {

    const API_URL = import.meta.env.VITE_API_URL;
    const { user } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [icon, setIcon] = useState("");
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState("");
    const [areaId, setAreaId] = useState("");

    const availableColors = ["#FF5731", "#2257FF", "#F333FF", "#FFBD33", "#33FFD4", "#FF3213", "#33FF33", "#3333FF"];
    const availableIcons = ["🍎", "🏋️‍♂️", "🎨", "📚", "🍷", "🌿", "🌙"];

    useEffect(() => {
        const fetchAreas = () => {
            axios
                .get(`${API_URL}/api/areas`, { headers: { Authorization: `Bearer ${storedToken}`} })
                .then((response) => {
                    setAreas(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        fetchAreas();
    }, [API_URL, storedToken]);

    useEffect(() => {
        if (editingHabit) {
            setName(editingHabit.name);
            setDescription(editingHabit.description);
            setColor(editingHabit.color);
            setIcon(editingHabit.icon);
            setSelectedArea(editingHabit.areaId);
            setAreaId(editingHabit.areaId);
        }
    }, [editingHabit]);

    const handleAreaChange = (e) => {
        setSelectedArea(e.target.value);
        setAreaId(e.target.value);
    };

    const clearFields = () => {
        setName("");
        setDescription("");
        setColor("");
        setIcon("");
        setSelectedArea("");
        setEditingHabit(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestBody = {
            name,
            description,
            color,
            icon,
            userId: user._id,
            areaId
        };

        try {
            if (editingHabit) {
                const response = await axios.put(`${API_URL}/api/habits/${editingHabit._id}`, requestBody, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                const updatedHabits = habits.map((habit) =>
                    habit._id === editingHabit._id ? response.data : habit
                );
                setHabits(updatedHabits);
            } else {
                const response = await axios.post(`${API_URL}/api/habits`, requestBody, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                setHabits([...habits, response.data]);
                triggerRefresh();  // This triggers the refresh after a habit is added
                console.log("New Habit:", response.data);
            }
        } catch (error) {
            console.log(error);
        }

        clearFields();
    }

    return (
        <form onSubmit={handleSubmit} className="my-4 text-gray-700 flex flex-col items-start">
            <input
                type="text"
                value={name}
                name="name"
                id="name"
                placeholder="Habit Name"
                required
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 border text-gray-700 border-gray-100 rounded-lg mr-4 text-sm w-96"
            />
            <textarea
                value={description}
                name="description"
                id="description"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                className="px-3 py-2 border text-gray-700 border-gray-100 rounded-lg mr-4 mt-2 text-sm w-96"
            />
            <div className="my-4">
                <label className="block text-sm font-medium text-gray-700">Select Color:</label>
                <div className="flex space-x-2 mt-2">
                    {availableColors.map((availableColor) => (
                        <div
                            key={availableColor}
                            className={`w-8 h-8 rounded-full cursor-pointer ${color === availableColor ? 'ring-2 ring-blue-500' : ''}`}
                            style={{ backgroundColor: availableColor }}
                            onClick={() => setColor(availableColor)}
                        />
                    ))}
                </div>
            </div>
            <div className="my-4">
                <label className="block text-sm font-medium text-gray-700">Select Icon:</label>
                <div className="flex space-x-2 mt-2">
                    {availableIcons.map((availableIcon) => (
                        <button
                            key={availableIcon}
                            type="button"
                            className={`px-2 py-1 border rounded-full cursor-pointer ${icon === availableIcon ? 'ring-2 ring-blue-500' : ''}`}
                            onClick={() => setIcon(availableIcon)}
                        >
                            {availableIcon}
                        </button>
                    ))}
                </div>
            </div>
            <select
                name="areaId"
                value={selectedArea}
                onChange={handleAreaChange}
                required
                className="px-3 py-2 border text-gray-700 border-gray-100 rounded-lg mr-4 text-sm w-96"
            >
                <option value="">Select Area</option>
                {areas.map(area => (
                    <option key={area._id} value={area._id}>
                        {area.areaName}
                    </option>
                ))}
            </select>
            <button type="submit" className="mt-4 justify-center rounded-md px-3 py-2 text-sm font-normal opacity-70 hover:opacity-100 bg-[#8E7AB5] leading-6 text-white">
                {editingHabit ? "Update Habit" : "Add Habit"}
            </button>
        </form>
    );
}

export default AddHabit;
