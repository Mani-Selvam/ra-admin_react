import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/departments";

export const getDepartments = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const createDepartment = async (data) => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
};

export const updateDepartment = async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteDepartment = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};
