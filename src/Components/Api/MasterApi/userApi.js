import axios from "axios";
import API_ENDPOINTS from "../../../config/apiConfig";

const API_BASE_URL = `${API_ENDPOINTS.BASE_URL}/api/users`;

// 1. Dropdown Data (For Forms)
export const getDropdowns = async () => {
    const response = await axios.get(`${API_BASE_URL}/dropdowns`);
    return response.data; // Returns { companies: [], designations: [] }
};

// 2. CRUD Operations
export const getUsers = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const getUserById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const createUser = async (data) => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteUser = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};
