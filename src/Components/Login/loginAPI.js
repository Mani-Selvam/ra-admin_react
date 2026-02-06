import API_ENDPOINTS from "@/config/apiConfig";

// API base URL (from centralized config)
const API_BASE_URL = `${API_ENDPOINTS.BASE_URL}/api`;

export const loginUser = async (mobile, password) => {
    try {
        console.log("Attempting login with mobile:", mobile);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mobile, password }),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: `HTTP Error ${response.status}` };
            }
            console.error("Error response:", errorData);
            throw new Error(
                errorData.message ||
                    `Login failed with status ${response.status}`,
            );
        }

        const data = await response.json();
        console.log("Login successful!");
        return data;
    } catch (error) {
        console.error("Login error:", error.message);
        throw new Error(error.message || "An error occurred during login");
    }
};

// Login using User Master API (with company & designation data)
export const loginUserWithMaster = async (mobile, password) => {
    try {
        console.log("Attempting login with User Master API:", mobile);

        const response = await fetch(`${API_BASE_URL}/auth/login/master`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mobile, password }),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: `HTTP Error ${response.status}` };
            }
            console.error("Error response (Master API):", errorData);
            throw new Error(
                errorData.message ||
                    `Login failed with status ${response.status}`,
            );
        }

        const data = await response.json();
        console.log("Login successful (Master API)!");
        console.log("User data with company & designation:", data.user);
        return data;
    } catch (error) {
        console.error("Login error (Master API):", error.message);
        throw new Error(error.message || "An error occurred during login");
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getAuthToken = () => {
    return localStorage.getItem("token");
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};
