// Worker API - Get tickets assigned only to the logged-in worker

import API_ENDPOINTS from "../../../config/apiConfig";

const API_BASE_URL = `${API_ENDPOINTS.BASE_URL}/api`;

/**
 * Get tickets assigned to the current logged-in worker only
 * @returns {Promise} - Array of tickets assigned to this worker
 */
export const getWorkerAssignedTickets = async () => {
    try {
        const token = localStorage.getItem("token");
        console.log("getWorkerAssignedTickets - Token:", token ? "✓ Found" : "✗ Not found");
        
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/tickets/worker/assigned`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        console.log("getWorkerAssignedTickets - Response Status:", response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error("getWorkerAssignedTickets - Error response:", error);
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("getWorkerAssignedTickets - Success, count:", data.length);
        return data;
    } catch (error) {
        console.error("Error fetching worker assigned tickets:", error);
        throw error;
    }
};

/**
 * Get work analysis for worker's assigned tickets only
 * @returns {Promise} - Array of work analyses for this worker's tickets
 */
export const getWorkerWorkAnalysis = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/work-analysis/worker`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching worker work analysis:", error);
        throw error;
    }
};

/**
 * Submit work analysis for a ticket
 * @param {string} ticketId - Ticket ID
 * @param {Object} analysisData - Work analysis data
 * @returns {Promise} - Response from server
 */
export const submitWorkerAnalysis = async (ticketId, analysisData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `${API_BASE_URL}/work-analysis`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ticket_id: ticketId,
                    ...analysisData,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error submitting work analysis:", error);
        throw error;
    }
};

/**
 * Get single ticket details (only if assigned to worker)
 * @param {string} ticketId - Ticket ID
 * @returns {Promise} - Ticket details
 */
export const getWorkerTicketDetail = async (ticketId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `${API_BASE_URL}/tickets/worker/${ticketId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching worker ticket detail:", error);
        throw error;
    }
};
