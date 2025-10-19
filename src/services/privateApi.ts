import axios from "axios";
import { getToken } from "@/utils/token";

const privateApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

privateApi.interceptors.request.use((config) => {
  const token  = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default privateApi;

