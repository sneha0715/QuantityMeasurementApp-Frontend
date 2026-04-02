export type MeasurementType =
  | "LengthUnit"
  | "WeightUnit"
  | "VolumeUnit"
  | "TemperatureUnit"

export type OperationType =
  | "ADD"
  | "SUBTRACT"
  | "MULTIPLY"
  | "DIVIDE"
  | "COMPARE"
  | "CONVERT"

export interface QuantityDTO {
  value: number
  unit: string
  measurementType: MeasurementType
}

export interface QuantityInputDTO {
  thisQuantityDTO: QuantityDTO
  thatQuantityDTO: QuantityDTO
}

export interface QuantityMeasurementDTO {
  id: number
  thisValue: number
  thisUnit: string
  thisMeasurementType: string
  thatValue: number | null
  thatUnit: string | null
  thatMeasurementType: string | null
  operation: string
  resultString: string | null
  resultValue: number | null
  resultUnit: string | null
  resultMeasurementType: string | null
  errorMessage: string | null
  error: boolean
  createdAt: string
}

export interface ErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface SignUpRequest {
  username: string
  email: string
  password: string
}

export interface OAuth2LoginRequest {
  provider: string
  accessToken: string
}

export interface JwtAuthenticationResponse {
  token: string
  type: "Bearer"
  username: string
  userId: number
}

export interface LogoutResponse {
  message: string
  success: boolean
  username: string
}

// Measurement unit mappings
export const MEASUREMENT_UNITS = {
  LengthUnit: ["FEET", "INCHES", "YARDS", "CENTIMETERS"],
  WeightUnit: ["KILOGRAM", "GRAM", "POUND"],
  VolumeUnit: ["LITRE", "MILLILITRE", "GALLON"],
  TemperatureUnit: ["CELSIUS", "FAHRENHEIT", "KELVIN"],
} as const

export const ALL_MEASUREMENT_TYPES: MeasurementType[] = [
  "LengthUnit",
  "WeightUnit",
  "VolumeUnit",
  "TemperatureUnit",
]
