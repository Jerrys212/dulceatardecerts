import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_APIURL,
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("user-storage");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
