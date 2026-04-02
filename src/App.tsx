import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/core/authStore"
import { Layout } from "@/components/Layout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Home } from "@/pages/Home"
import { Dashboard } from "@/pages/Dashboard"
import { Login } from "@/modules/auth/Login"
import { Register } from "@/modules/auth/Register"
import { Compare } from "@/modules/quantity/pages/Compare"
import { Convert } from "@/modules/quantity/pages/Convert"
import { Add } from "@/modules/quantity/pages/Add"
import { Subtract } from "@/modules/quantity/pages/Subtract"
import { Divide } from "@/modules/quantity/pages/Divide"
import { OperationHistory } from "@/modules/history/OperationHistory"
import { TypeHistory } from "@/modules/history/TypeHistory"
import { ErrorHistory } from "@/modules/history/ErrorHistory"

const queryClient = new QueryClient()

export function App() {
  useEffect(() => {
    // Restore auth state from localStorage on app startup
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

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />

          <Route
            path="/operations/compare"
            element={
              <Layout>
                <Compare />
              </Layout>
            }
          />

          <Route
            path="/operations/convert"
            element={
              <Layout>
                <Convert />
              </Layout>
            }
          />

          <Route
            path="/operations/add"
            element={
              <Layout>
                <Add />
              </Layout>
            }
          />

          <Route
            path="/operations/subtract"
            element={
              <Layout>
                <Subtract />
              </Layout>
            }
          />

          <Route
            path="/operations/divide"
            element={
              <Layout>
                <Divide />
              </Layout>
            }
          />

          <Route
            path="/history/operation"
            element={
              <ProtectedRoute>
                <Layout>
                  <OperationHistory />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/history/type"
            element={
              <ProtectedRoute>
                <Layout>
                  <TypeHistory />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/history/errors"
            element={
              <ProtectedRoute>
                <Layout>
                  <ErrorHistory />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
