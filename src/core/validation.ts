import { z } from "zod"
import { MEASUREMENT_UNITS } from "@/types"
import type { MeasurementType } from "@/types"

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
})

export const quantityDTOSchema = z.object({
  value: z.number().finite("Value must be a finite number"),
  unit: z.string().min(1, "Unit is required"),
  measurementType: z.enum([
    "LengthUnit",
    "WeightUnit",
    "VolumeUnit",
    "TemperatureUnit",
  ]),
})

export const quantityInputSchema = z
  .object({
    thisQuantityDTO: quantityDTOSchema,
    thatQuantityDTO: quantityDTOSchema,
  })
  .refine(
    (data) => {
      // Check if units belong to their respective measurement types
      const thisUnits =
        MEASUREMENT_UNITS[
          data.thisQuantityDTO.measurementType as MeasurementType
        ]
      const thatUnits =
        MEASUREMENT_UNITS[
          data.thatQuantityDTO.measurementType as MeasurementType
        ]
      return (
        thisUnits.includes(data.thisQuantityDTO.unit as never) &&
        thatUnits.includes(data.thatQuantityDTO.unit as never)
      )
    },
    { message: "Unit does not belong to selected measurement type" }
  )

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type QuantityInputData = z.infer<typeof quantityInputSchema>
