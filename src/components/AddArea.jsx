import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddArea({ storedToken, editingArea, setEditingArea, areas, setAreas, triggerRefresh, user }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [areaName, setAreaName] = useState("");

    useEffect(() => {
        if (editingArea) {
            setAreaName(editingArea.name);
        }
    }, [editingArea]);

    const clearFields = () => {
        setAreaName("");
        setEditingArea(null);
    };

    const handleValidation = () => {
        if (!areaName.trim()) {
            toast.error("Area name is required.");
            return false;
        }
        if (areaName.length > 50) {
            toast.error("Area name cannot exceed 50 characters.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!handleValidation()) {
            return; 
        }

        const requestBody = {
            areaName, 
            userId: user._id,
        };

        try {
            if (editingArea) {
                const response = await axios.put(
                    `${API_URL}/api/areas/${editingArea._id}`,
                    requestBody,
                    {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    }
                );
                const updatedAreas = areas.map((area) =>
                    area._id === editingArea._id ? response.data : area
                );
                setAreas(updatedAreas);
                toast.success("Area updated successfully!");
            } else {
                const response = await axios.post(
                    `${API_URL}/api/areas`,
                    requestBody,
                    {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    }
                );
                setAreas([...areas, response.data]);
                triggerRefresh();
                console.log("New Area:", response.data);
                toast.success("Area added successfully!",{
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error(`Area not ${editingArea ? "updated" : "added"}`, error);
            toast.error(`Failed to ${editingArea ? "update" : "add"} area.`);
        }

        clearFields();
    };

    return (
        <>
        <form onSubmit={handleSubmit} className="my-4 text-gray-700">
            <input
                type="text"
                value={areaName}
                name="areaName"
                id="areaName"
                placeholder="Area Name"
                required
                onChange={(e) => setAreaName(e.target.value)}
                className="px-3 py-2 border text-gray-700 border-gray-100 rounded-lg mr-4 text-sm w-48"
            />
            <button type="submit" className=" justify-center rounded-md px-3 py-2 text-sm font-normal opacity-70 hover:opacity-100 bg-[#8E7AB5]  leading-6  text-white">
                {editingArea ? "Update Area" : "Add Area"}
            </button>
            
        </form>
        
        </>
    );
}

export default AddArea;
