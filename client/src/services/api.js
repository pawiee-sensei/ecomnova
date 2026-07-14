import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        if (!config.headers) {
            config.headers = {};
        }

        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        // If unauthorized or forbidden, clear auth and redirect to login
        if (status === 401 || status === 403) {
            try {
                localStorage.removeItem("token");
            } catch (e) {}

            // Force reload to /login
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;