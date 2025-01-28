import axios from "axios";
import authService from "./authService";

// Create an Axios instance
const apiClient = axios.create({
    baseURL: "http://localhost:9090/api", // Your backend API
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token to requests
apiClient.interceptors.request.use(async (config) => {
    await authService.refreshToken(); // Refresh token before request
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
