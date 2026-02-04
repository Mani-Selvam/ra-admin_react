import axios from "axios";

const API_URL = "http://localhost:5000/api/work-logs";

const getJSONHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
};

export const createWorkLog = async (workLogData) => {
    try {
        console.log("📝 Creating Work Log via API:", workLogData);
        const response = await axios.post(API_URL, workLogData, getJSONHeader());
        console.log("✅ Work Log created successfully:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("❌ Error creating work log:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create work log");
    }
};

export const getWorkLogsByTicket = async (ticketId) => {
    try {
        console.log("📊 Fetching Work Logs for Ticket:", ticketId);
        const response = await axios.get(`${API_URL}/ticket/${ticketId}`, getJSONHeader());
        console.log("✅ Work Logs retrieved:", response.data);
        return response.data.data || [];
    } catch (error) {
        console.error("❌ Error fetching work logs:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch work logs");
    }
};

export const getWorkLogsByAnalysis = async (analysisId) => {
    try {
        console.log("📊 Fetching Work Logs for Analysis:", analysisId);
        const response = await axios.get(`${API_URL}/analysis/${analysisId}`, getJSONHeader());
        console.log("✅ Work Logs retrieved:", response.data);
        return response.data.data || [];
    } catch (error) {
        console.error("❌ Error fetching work logs:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch work logs");
    }
};

export const deleteWorkLog = async (workLogId) => {
    try {
        console.log("🗑️ Deleting Work Log:", workLogId);
        const response = await axios.delete(`${API_URL}/${workLogId}`, getJSONHeader());
        console.log("✅ Work Log deleted:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("❌ Error deleting work log:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete work log");
    }
};
