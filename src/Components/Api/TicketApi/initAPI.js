import axios from "axios";
import API_ENDPOINTS from "../../../config/apiConfig";

const API_URL = `${API_ENDPOINTS.BASE_URL}/api/ticket-status`;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` },
    };
};

// Initialize Material Request and Material Approved statuses
export const initMaterialStatuses = async () => {
    try {
        console.log("🔵 Initializing Material Statuses...");
        const response = await axios.post(
            `${API_URL}/init/material-statuses`,
            {},
            getAuthHeader()
        );
        console.log("✅ Material Statuses Initialized:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error initializing material statuses:",
            error.response?.data || error.message
        );
        throw error;
    }
};
