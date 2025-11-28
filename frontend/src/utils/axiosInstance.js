// src/utils/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("[axios] token present:", !!token); // temporarily debug
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(
      "[axios] response error:",
      err.response?.status,
      err.response?.data
    );
    return Promise.reject(err);
  }
);

export default instance;
