import axios from "axios";
import API_ENDPOINTS from "../../../config/apiConfig";

const API_URL = `${API_ENDPOINTS.BASE_URL}/api/users`; // Adjust port if needed

const getJSONHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
};

// Get All Users
export const getUsers = async () => {
    try {
        console.log("Fetching users from:", API_URL);
        const response = await axios.get(API_URL, getJSONHeader());
        console.log("Users response:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Get users error:",
            error.response?.data || error.message,
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch users",
        );
    }
};

// Get User by ID
export const getUserById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, getJSONHeader());
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch user");
    }
};
