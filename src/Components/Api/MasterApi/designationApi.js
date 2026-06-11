import axios from "axios";
import API_ENDPOINTS from "../../../config/apiConfig";

const API_BASE_URL = `${API_ENDPOINTS.BASE_URL}/api/designations`;

export const getDesignations = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const createDesignation = async (data) => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
};

export const updateDesignation = async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteDesignation = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};
