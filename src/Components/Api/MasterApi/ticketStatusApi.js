import axios from "axios";
import API_ENDPOINTS from "../../../config/apiConfig";

const API_BASE_URL = `${API_ENDPOINTS.BASE_URL}/api/ticket-status`;

export const getTicketStatuses = async () => {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data; // Should be sorted by sortOrder (ascending)
};

export const createTicketStatus = async (data) => {
    try {
        const payload = {
            ...data,
            sortOrder: parseInt(data.sortOrder, 10), // Convert to number
        };
        const response = await axios.post(`${API_BASE_URL}`, payload);
        return response.data;
    } catch (error) {
        console.error(
            "Create TicketStatus Error:",
            error.response?.data || error.message,
        );
        throw error;
    }
};

export const updateTicketStatus = async (id, data) => {
    try {
        const payload = {
            ...data,
            sortOrder: parseInt(data.sortOrder, 10), // Convert to number
        };
        const response = await axios.put(`${API_BASE_URL}/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error(
            "Update TicketStatus Error:",
            error.response?.data || error.message,
        );
        throw error;
    }
};

export const deleteTicketStatus = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(
            "Delete TicketStatus Error:",
            error.response?.data || error.message,
        );
        throw error;
    }
};
