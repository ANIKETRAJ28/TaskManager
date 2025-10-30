import axios from "axios";
import { backendUrl } from "@/config/envConfig";

const defaultOptions = {
  baseURL: `${backendUrl}/api/`,
  withCredentials: true,
};

export const axiosInstance = axios.create(defaultOptions);
