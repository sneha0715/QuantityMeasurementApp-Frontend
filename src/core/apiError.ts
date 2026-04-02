import axios from "axios"
import type { ErrorResponse } from "@/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/"

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    console.error(
      "API error:",
      error.response?.data || error.message || "Unknown error"
    )
    if (error.response?.data?.message) {
      return error.response.data.message
    }

    if (error.response) {
      return `Request failed with status ${error.response.status}.`
    }

    if (error.code === "ERR_NETWORK") {
      return `Cannot reach backend at ${API_BASE_URL}. If backend is running, this is likely a CORS/preflight issue.`
    }

    return error.message || fallbackMessage
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}
