import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import AddArea from "../components/AddArea";
import AllAreas from "../components/AllAreas";

function AreasPage() {
    const storedToken = localStorage.getItem("authToken");
    const [editingArea, setEditingArea] = useState(null);
    const [areas, setAreas] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const { user } = useContext(AuthContext);
    const API_URL = import.meta.env.VITE_API_URL;

    const triggerRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    }

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/areas`, {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });
                setAreas(response.data);
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
        };

        fetchAreas();
    }, [storedToken, refreshKey]);

    const handleEdit = (area) => {
        setEditingArea(area);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/areas/${id}`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            triggerRefresh();
        } catch (error) {
            console.error('Area not deleted:', error);
        }
    };

    const handleAreaChange = (updatedAreas) => {
        setAreas(updatedAreas);
    };

    return (
        <div className="text-center my-10 ">
            <h1 className="pb-4 font-semibold text-lg text-gray-700">Areas</h1>
            <AddArea 
                storedToken={storedToken} 
                editingArea={editingArea} 
                setEditingArea={setEditingArea} 
                areas={areas} 
                setAreas={handleAreaChange} 
                triggerRefresh={triggerRefresh} 
                user={user}
            />
            <AllAreas 
                storedToken={storedToken} 
                onEdit={handleEdit} 
                areas={areas} 
                setAreas={handleAreaChange} 
                refreshKey={refreshKey} 
            />
        </div>
    );
}

export default AreasPage;
