import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getApiErrorMessage } from "@/core/apiError"
import { quantityService } from "../quantity/quantityService"
import type { MeasurementType } from "@/types"

const measurementTypes: MeasurementType[] = [
  "LengthUnit",
  "WeightUnit",
  "VolumeUnit",
  "TemperatureUnit",
]

export function TypeHistory() {
  const [measurementType, setMeasurementType] =
    useState<MeasurementType>("LengthUnit")

  const {
    data: history = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["history", "type", measurementType],
    queryFn: () => quantityService.getHistoryByType(measurementType),
  })

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">📚 Type History</h1>
        <p className="mt-1 text-muted-foreground">
          View history of measurements by type
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <label className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Measurement Type
        </label>
        <select
          value={measurementType}
          onChange={(e) =>
            setMeasurementType(e.target.value as MeasurementType)
          }
          className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground focus:border-ring focus:outline-none"
        >
          {measurementTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <div className="text-muted-foreground">Loading...</div>}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">
            {getApiErrorMessage(error, "Failed to load history")}
          </p>
        </div>
      )}

      {history.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No history found for this measurement type
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record.id}
              className="rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    {record.operation.toUpperCase()}: {record.thisValue}{" "}
                    {record.thisUnit} → {record.thatValue} {record.thatUnit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
