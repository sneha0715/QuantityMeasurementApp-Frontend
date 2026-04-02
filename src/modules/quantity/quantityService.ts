import apiClient from "@/core/apiClient"
import type {
  QuantityInputDTO,
  QuantityMeasurementDTO,
  OperationType,
} from "@/types"

const QUANTITY_BASE_URL = "/api/v1/quantities"

export const quantityService = {
  async compare(input: QuantityInputDTO): Promise<QuantityMeasurementDTO> {
    const response = await apiClient.post<QuantityMeasurementDTO>(
      `${QUANTITY_BASE_URL}/compare`,
      input
    )
    return response.data
  },

  async convert(input: QuantityInputDTO): Promise<QuantityMeasurementDTO> {
    const response = await apiClient.post<QuantityMeasurementDTO>(
      `${QUANTITY_BASE_URL}/convert`,
      input
    )
    return response.data
  },

  async add(input: QuantityInputDTO): Promise<QuantityMeasurementDTO> {
    const response = await apiClient.post<QuantityMeasurementDTO>(
      `${QUANTITY_BASE_URL}/add`,
      input
    )
    return response.data
  },

  async subtract(input: QuantityInputDTO): Promise<QuantityMeasurementDTO> {
    const response = await apiClient.post<QuantityMeasurementDTO>(
      `${QUANTITY_BASE_URL}/subtract`,
      input
    )
    return response.data
  },

  async divide(input: QuantityInputDTO): Promise<QuantityMeasurementDTO> {
    const response = await apiClient.post<QuantityMeasurementDTO>(
      `${QUANTITY_BASE_URL}/divide`,
      input
    )
    return response.data
  },

  async getHistoryByOperation(
    operation: OperationType
  ): Promise<QuantityMeasurementDTO[]> {
    const response = await apiClient.get<QuantityMeasurementDTO[]>(
      `${QUANTITY_BASE_URL}/history/operation/${operation}`
    )
    return response.data
  },

  async getHistoryByType(
    measurementType: string
  ): Promise<QuantityMeasurementDTO[]> {
    const response = await apiClient.get<QuantityMeasurementDTO[]>(
      `${QUANTITY_BASE_URL}/history/type/${measurementType}`
    )
    return response.data
  },

  async getErrorHistory(): Promise<QuantityMeasurementDTO[]> {
    const response = await apiClient.get<QuantityMeasurementDTO[]>(
      `${QUANTITY_BASE_URL}/history/errored`
    )
    return response.data
  },

  async getOperationCount(operation: OperationType): Promise<number> {
    const response = await apiClient.get<number>(
      `${QUANTITY_BASE_URL}/count/${operation}`
    )
    return response.data
  },
}
