import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { quantityService } from "../quantityService"
import { getApiErrorMessage } from "@/core/apiError"
import { QuantityForm } from "../QuantityForm"
import { ResultCard } from "../ResultCard"
import type { QuantityMeasurementDTO, MeasurementType } from "@/types"

export function Divide() {
  const [thisValue, setThisValue] = useState<number>(0)
  const [thisUnit, setThisUnit] = useState<string>("FEET")
  const [thisMeasurementType, setThisMeasurementType] =
    useState<MeasurementType>("LengthUnit")

  const [thatValue, setThatValue] = useState<number>(0)
  const [thatUnit, setThatUnit] = useState<string>("FEET")
  const [thatMeasurementType, setThatMeasurementType] =
    useState<MeasurementType>("LengthUnit")

  const [result, setResult] = useState<QuantityMeasurementDTO | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const divideMutation = useMutation({
    mutationFn: () =>
      quantityService.divide({
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
        getApiErrorMessage(error, "Division failed. Please try again.")
      )
    },
  })

  const handleDivide = () => {
    if (!thisUnit || !thatUnit) {
      setApiError("Please select units for both quantities")
      return
    }
    if (thisMeasurementType !== thatMeasurementType) {
      setApiError("Both quantities must be of the same measurement type")
      return
    }
    if (thisMeasurementType === "TemperatureUnit") {
      setApiError("Temperature units do not support arithmetic operations")
      return
    }
    if (thatValue === 0) {
      setApiError("Cannot divide by zero")
      return
    }
    divideMutation.mutate()
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          ➗ Divide Quantities
        </h1>
        <p className="mt-1 text-muted-foreground">
          Divide one quantity by another
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
        onClick={handleDivide}
        disabled={
          divideMutation.isPending || thisMeasurementType === "TemperatureUnit"
        }
        className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        {divideMutation.isPending ? "Dividing..." : "Divide"}
      </button>

      {result && <ResultCard result={result} operation="divide" />}
    </div>
  )
}
