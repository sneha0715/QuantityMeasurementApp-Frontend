import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { quantityService } from "../quantityService"
import { getApiErrorMessage } from "@/core/apiError"
import { QuantityForm } from "../QuantityForm"
import { ResultCard } from "../ResultCard"
import type { QuantityMeasurementDTO, MeasurementType } from "@/types"

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
    onSuccess: (response: QuantityMeasurementDTO) => {
      setResult(response)
      setApiError(null)
    },
    onError: (error: unknown) => {
      setApiError(
        getApiErrorMessage(error, "Comparison failed. Please try again.")
      )
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          ⚖️ Compare Quantities
        </h1>
        <p className="mt-1 text-muted-foreground">
          Check if two quantities are equal
        </p>
      </div>

      {apiError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">{apiError}</p>
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
        onThisMeasurementTypeChange={(type: MeasurementType) => {
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
        className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {compareMutation.isPending ? "Comparing..." : "Compare"}
      </button>

      {result && <ResultCard result={result} operation="compare" />}
    </div>
  )
}
