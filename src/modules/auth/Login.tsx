import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { authService } from "./authService"
import { getGoogleAccessToken } from "./googleOAuth"
import { useAuthStore } from "@/core/authStore"
import { getApiErrorMessage } from "@/core/apiError"
import { loginSchema, type LoginFormData } from "@/core/validation"
import { ZodError } from "zod"

export function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      setAuth(response)
      navigate("/")
    },
    onError: (error: unknown) => {
      setApiError(getApiErrorMessage(error, "Login failed. Please try again."))
    },
  })

  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
        | string
        | undefined

      if (!clientId) {
        throw new Error("Google OAuth is not configured. Missing client ID.")
      }

      const accessToken = await getGoogleAccessToken(clientId)
      return authService.googleLogin(accessToken)
    },
    onSuccess: (response) => {
      setAuth(response)
      navigate("/")
    },
    onError: (error: unknown) => {
      setApiError(getApiErrorMessage(error, "Google login failed."))
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setApiError(null)

    try {
      const validData = loginSchema.parse(formData)
      loginMutation.mutate(validData)
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          const path = issue.path.join(".")
          fieldErrors[path] = issue.message
        })
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="text-center">
          <p className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-lg">
            🔐
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Continue to your dashboard and history.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {apiError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
              <p className="text-sm font-medium text-destructive">{apiError}</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending || googleLoginMutation.isPending}
            className="relative flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none disabled:opacity-50"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            onClick={() => {
              setApiError(null)
              googleLoginMutation.mutate()
            }}
            disabled={loginMutation.isPending || googleLoginMutation.isPending}
            className="relative flex h-10 w-full items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50"
          >
            {googleLoginMutation.isPending
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
