import axios from "axios";
import API_ENDPOINTS from "../../../config/apiConfig";

const API_BASE_URL = `${API_ENDPOINTS.BASE_URL}/api/departments`;

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
