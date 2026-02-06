import axios from "axios";
import API_ENDPOINTS from "../../../config/apiConfig";

const API_URL = `${API_ENDPOINTS.BASE_URL}/api/tickets`; // Adjust port if needed

// Helper to get token from localStorage for FormData
const getFormDataHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            // DO NOT set Content-Type - axios/FormData will handle it
            Authorization: `Bearer ${token}`,
        },
    };
};

const getJSONHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
};

// 1. Create Ticket (With Image)
export const createTicket = async (ticketData) => {
    // ticketData should be a FormData object
    try {
        console.log("Creating ticket with FormData:", ticketData);
        const response = await axios.post(
            API_URL,
            ticketData,
            getFormDataHeader(),
        );
        return response.data;
    } catch (error) {
        console.error(
            "Create ticket error:",
            error.response?.data || error.message,
        );
        throw new Error(
            error.response?.data?.message || "Failed to create ticket",
        );
    }
};

// 2. Get All Tickets
export const getTickets = async (assignedOnly = false) => {
    try {
        const url = assignedOnly ? `${API_URL}?assigned=true` : API_URL;
        console.log("Fetching tickets from:", url);
        const response = await axios.get(url, getJSONHeader());
        console.log("Tickets response:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Get tickets error:",
            error.response?.data || error.message,
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch tickets",
        );
    }
};

// 3. Update Ticket (e.g., Change Status)
export const updateTicket = async (id, updateData) => {
    try {
        console.log("Updating ticket:", id, "with data:", updateData);
        const response = await axios.put(
            `${API_URL}/${id}`,
            updateData,
            getJSONHeader(),
        );
        console.log("Ticket update response:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Update ticket error:",
            error.response?.data || error.message,
        );
        throw new Error(
            error.response?.data?.message || "Failed to update ticket",
        );
    }
};

// 4. Delete Ticket
export const deleteTicket = async (id) => {
    try {
        const response = await axios.delete(
            `${API_URL}/${id}`,
            getJSONHeader(),
        );
        return response.data;
    } catch (error) {
        throw new Error("Failed to delete ticket");
    }
};
