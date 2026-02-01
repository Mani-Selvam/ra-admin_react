import axios from "axios";

const API_URL = "http://localhost:5000/api/work-analysis";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` },
    };
};

export const createWorkAnalysis = async (formData) => {
    try {
        const response = await axios.post(API_URL, formData, {
            ...getAuthHeader(),
            headers: {
                ...getAuthHeader().headers,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to submit analysis",
        );
    }
};

export const getWorkAnalysis = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeader());
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch analysis",
        );
    }
};
