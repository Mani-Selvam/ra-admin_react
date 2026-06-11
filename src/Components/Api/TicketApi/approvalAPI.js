import axios from "axios";
import API_ENDPOINTS from "../../../config/apiConfig";

const API_URL = `${API_ENDPOINTS.BASE_URL}/api/approvals`;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debug log

    if (!token) {
        throw new Error("No authentication token found. Please login first.");
    }

    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
};

export const createApproval = async (approvalData) => {
    try {
        const headers = getAuthHeader();
        console.log("Auth headers:", headers); // Debug log

        const response = await axios.post(API_URL, approvalData, headers);
        return response.data;
    } catch (error) {
        console.error("Approval creation error:", error); // Debug log
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                "Failed to submit approval",
        );
    }
};

export const getApprovals = async () => {
    try {
        const headers = getAuthHeader();
        const response = await axios.get(API_URL, headers);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch approvals");
    }
};

export const getApprovalByTicketId = async (ticketId) => {
    try {
        const headers = getAuthHeader();
        const response = await axios.get(
            `${API_URL}?ticket_id=${ticketId}`,
            headers,
        );
        return Array.isArray(response.data) ? response.data[0] : response.data;
    } catch (error) {
        console.error("Get approval by ticket ID error:", error);
        return null;
    }
};
