import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import AppleEmoji from '../assets/apple-emoji.png';
import BicepEmoji from '../assets/bicep-emoji.png';
import BookEmoji from '../assets/book-emoji.png';
import MoonEmoji from '../assets/moon-emoji.png';
import RelaxEmoji from '../assets/relax-emoji.png';
import SmileEmoji from '../assets/smile-emoji.png';
import WineEmoji from '../assets/wine-emoji.png';


function AddHabit({ storedToken, editingHabit, setEditingHabit, habits, setHabits, onHabitAdded }) {

    const API_URL = import.meta.env.VITE_API_URL;
    const { user } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [icon, setIcon] = useState("");
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState("");
    const [areaId, setAreaId] = useState("");

    const availableColors = ["#8E7AB5" , "#B784B7", "#E493B3", "#EEA5A6", "#FAB38E", "#FFD88A", "#FFD88A"];
    const availableIcons = [
        { src: AppleEmoji, alt: "Apple" },
        { src: BicepEmoji, alt: "Bicep" },
        { src: BookEmoji, alt: "Book" },
        { src: MoonEmoji, alt: "Moon" },
        { src: RelaxEmoji, alt: "Relax" },
        { src: SmileEmoji, alt: "Smile" },
        { src: WineEmoji, alt: "Wine" }
    ];

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
            icon, // This should store the URL of the image
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
                console.log("New Habit:", response.data);
                onHabitAdded(); 
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
                        <img
                            key={availableIcon.alt}
                            src={availableIcon.src}
                            alt={availableIcon.alt}
                            className={`w-10 h-10 p-2 rounded-full cursor-pointer ${icon === availableIcon.src ? 'ring-2 ring-blue-500' : ''}`}
                            onClick={() => setIcon(availableIcon.src)}
                        />
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
