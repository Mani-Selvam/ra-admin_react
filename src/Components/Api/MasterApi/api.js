import axios from "axios";
import API_ENDPOINTS from "@/config/apiConfig";

// API endpoint for companies (from centralized config)
const API_BASE_URL = API_ENDPOINTS.COMPANIES;

// 1. Get All Companies
export const getCompanies = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

// 2. Create Company (Handles Image Upload)
export const createCompany = async (formData) => {
    const response = await axios.post(API_BASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// 3. Update Company
export const updateCompany = async (id, formData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// 4. Delete Company
export const deleteCompany = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};
