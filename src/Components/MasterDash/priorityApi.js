import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/priorities";

export const getPriorities = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const createPriority = async (data) => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
};

export const updatePriority = async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deletePriority = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};
