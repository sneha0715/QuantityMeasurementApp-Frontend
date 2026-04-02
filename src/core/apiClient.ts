import axios from "axios"
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios"
import { useAuthStore } from "./authStore"
import type { ErrorResponse } from "@/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/"

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401 and global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (!error.response) {
      console.error(
        "API network error: backend may be unreachable at",
        API_BASE_URL,
        error.message
      )
    }

    if (error.response?.status === 401) {
      const { token, clearAuth } = useAuthStore.getState()
      if (token) {
        clearAuth()
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
