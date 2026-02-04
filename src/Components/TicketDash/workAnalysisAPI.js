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

export const getMaterialApprovedAnalysis = async () => {
    try {
        const response = await axios.get(`${API_URL}/approved`, getAuthHeader());
        console.log("🟢 getMaterialApprovedAnalysis - Raw Response:", response);
        console.log("🟢 getMaterialApprovedAnalysis - Response Data:", response.data);
        console.log("🟢 getMaterialApprovedAnalysis - Data Type:", typeof response.data);
        console.log("🟢 getMaterialApprovedAnalysis - Is Array?", Array.isArray(response.data));
        if (Array.isArray(response.data) && response.data.length > 0) {
            console.log("🟢 getMaterialApprovedAnalysis - First Record:", response.data[0]);
            console.log("🟢 getMaterialApprovedAnalysis - First Record uploaded_images:", response.data[0].uploaded_images);
            console.log("🟢 getMaterialApprovedAnalysis - First Record uploaded_images type:", typeof response.data[0].uploaded_images);
            console.log("🟢 getMaterialApprovedAnalysis - First Record uploaded_images length:", response.data[0].uploaded_images?.length);
        }
        return response.data;
    } catch (error) {
        console.error("❌ getMaterialApprovedAnalysis - Error:", error);
        throw new Error(
            error.response?.data?.message || "Failed to fetch Material Approved analysis",
        );
    }
};
