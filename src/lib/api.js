import axios from "axios";

const api = axios.create({
  baseURL: "https://taskify-backend-production-5892.up.railway.app/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
