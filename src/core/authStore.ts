import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { JwtAuthenticationResponse } from "@/types"

interface AuthStore {
  token: string | null
  userId: number | null
  username: string | null
  setAuth: (auth: JwtAuthenticationResponse) => void
  clearAuth: () => void
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      username: null,
      isAuthenticated: false,
      setAuth: (auth: JwtAuthenticationResponse) =>
        set({
          token: auth.token,
          userId: auth.userId,
          username: auth.username,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          token: null,
          userId: null,
          username: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        username: state.username,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
