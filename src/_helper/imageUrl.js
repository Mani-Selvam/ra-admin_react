// Helper function to normalize image URLs
// Replaces old localhost URLs with current API URL
import API_ENDPOINTS from "@/config/apiConfig";

export const normalizeImageUrl = (logoUrl) => {
    if (!logoUrl) {
        console.warn("🟡 normalizeImageUrl: logoUrl is empty");
        return "";
    }
    
    console.log("🔵 normalizeImageUrl input:", logoUrl);
    console.log("   API_ENDPOINTS.BASE_URL:", API_ENDPOINTS.BASE_URL);
    
    // If it's already a full URL starting with http/https, check if it needs updating
    if (logoUrl.startsWith("http")) {
        // Replace all localhost URLs (both localhost:5000 and localhost:undefined)
        if (logoUrl.includes("localhost")) {
            const normalized = logoUrl.replace(/http:\/\/localhost(:\d+|:undefined)?/, API_ENDPOINTS.BASE_URL);
            console.log("🟢 normalizeImageUrl output (localhost replaced):", normalized);
            return normalized;
        }
        console.log("🟢 normalizeImageUrl output (full URL, no change):", logoUrl);
        return logoUrl;
    }
    
    // If it's a relative path, prepend the API URL
    const normalized = `${API_ENDPOINTS.BASE_URL}/${logoUrl}`;
    console.log("🟢 normalizeImageUrl output (relative path prefixed):", normalized);
    return normalized;
};
