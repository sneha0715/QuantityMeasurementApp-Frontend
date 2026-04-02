import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { quantityService } from "./quantityService"
import { QuantityForm } from "./QuantityForm"
import { ResultCard } from "./ResultCard"
import type { QuantityMeasurementDTO, MeasurementType } from "@/types"

interface ErrorWithMessage {
  response?: { data?: { message?: string } }
}

export function Compare() {
  const [thisValue, setThisValue] = useState<number>(0)
  const [thisUnit, setThisUnit] = useState<string>("FEET")
  const [thisMeasurementType, setThisMeasurementType] =
    useState<MeasurementType>("LengthUnit")

  const [thatValue, setThatValue] = useState<number>(0)
  const [thatUnit, setThatUnit] = useState<string>("INCHES")
  const [thatMeasurementType, setThatMeasurementType] =
    useState<MeasurementType>("LengthUnit")

  const [result, setResult] = useState<QuantityMeasurementDTO | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const compareMutation = useMutation({
    mutationFn: () =>
      quantityService.compare({
        thisQuantityDTO: {
          value: thisValue,
          unit: thisUnit,
          measurementType: thisMeasurementType,
        },
        thatQuantityDTO: {
          value: thatValue,
          unit: thatUnit,
          measurementType: thatMeasurementType,
        },
      }),
    onSuccess: (response) => {
      setResult(response)
      setApiError(null)
    },
    onError: (error: ErrorWithMessage) => {
      const errorMessage =
        error.response?.data?.message || "Comparison failed. Please try again."
      setApiError(errorMessage)
    },
  })

  const handleCompare = () => {
    if (!thisUnit || !thatUnit) {
      setApiError("Please select units for both quantities")
      return
    }
    if (thisMeasurementType !== thatMeasurementType) {
      setApiError("Both quantities must be of the same measurement type")
      return
    }
    compareMutation.mutate()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compare Quantities</h1>
        <p className="mt-2 text-gray-600">Check if two quantities are equal</p>
      </div>

      {apiError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{apiError}</p>
        </div>
      )}

      <QuantityForm
        thisValue={thisValue}
        thisUnit={thisUnit}
        thisMeasurementType={thisMeasurementType}
        thatValue={thatValue}
        thatUnit={thatUnit}
        thatMeasurementType={thatMeasurementType}
        onThisValueChange={setThisValue}
        onThisUnitChange={setThisUnit}
        onThisMeasurementTypeChange={(type) => {
          setThisMeasurementType(type)
          setThatMeasurementType(type)
        }}
        onThatValueChange={setThatValue}
        onThatUnitChange={setThatUnit}
        onThatMeasurementTypeChange={setThatMeasurementType}
      />

      <button
        onClick={handleCompare}
        disabled={compareMutation.isPending}
        className="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {compareMutation.isPending ? "Comparing..." : "Compare"}
      </button>

      {result && <ResultCard result={result} operation="compare" />}
    </div>
  )
}
