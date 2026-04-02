import { useEffect } from "react"
import { useAuthStore } from "@/core/authStore"

export function useRestoreAuth() {
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth-storage")
    if (savedAuth) {
      try {
        const auth = JSON.parse(savedAuth)
        if (auth.state) {
          const { token, userId, username, isAuthenticated } = auth.state
          if (token && userId && username && isAuthenticated) {
            useAuthStore.setState({
              token,
              userId,
              username,
              isAuthenticated,
            })
          }
        }
      } catch (error) {
        console.error("Failed to restore auth:", error)
      }
    }
  }, [])
}
