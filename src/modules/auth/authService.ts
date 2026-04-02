import apiClient from "@/core/apiClient"
import type {
  LoginRequest,
  SignUpRequest,
  OAuth2LoginRequest,
  JwtAuthenticationResponse,
} from "@/types"

const AUTH_BASE_URL = "/api/v1/auth"

export const authService = {
  async login(credentials: LoginRequest): Promise<JwtAuthenticationResponse> {
    const response = await apiClient.post<JwtAuthenticationResponse>(
      `${AUTH_BASE_URL}/login`,
      credentials
    )
    return response.data
  },

  async register(
    credentials: SignUpRequest
  ): Promise<JwtAuthenticationResponse> {
    const response = await apiClient.post<JwtAuthenticationResponse>(
      `${AUTH_BASE_URL}/register`,
      credentials
    )
    console.log(response)
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post(`${AUTH_BASE_URL}/logout`)
  },

  async googleLogin(accessToken: string): Promise<JwtAuthenticationResponse> {
    const request: OAuth2LoginRequest = {
      provider: "google",
      accessToken,
    }
    const response = await apiClient.post<JwtAuthenticationResponse>(
      `${AUTH_BASE_URL}/oauth2/google`,
      request
    )
    return response.data
  },
}
