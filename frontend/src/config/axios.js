import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


/*
Every time a request is made with axiosInstance, this below function runs before the request is sent.
It checks if a token exists in localStorage.
If a token exists, it attaches it to the request headers as a Bearer token:
*/


// Add interceptor to always attach latest token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
