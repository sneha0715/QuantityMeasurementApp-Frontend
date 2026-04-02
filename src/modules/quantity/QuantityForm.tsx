import { MEASUREMENT_UNITS } from "@/types"
import type { MeasurementType } from "@/types"

interface QuantityFormProps {
  thisValue: number
  thisUnit: string
  thisMeasurementType: MeasurementType
  thatValue: number
  thatUnit: string
  thatMeasurementType: MeasurementType
  onThisValueChange: (value: number) => void
  onThisUnitChange: (unit: string) => void
  onThisMeasurementTypeChange: (type: MeasurementType) => void
  onThatValueChange: (value: number) => void
  onThatUnitChange: (unit: string) => void
  onThatMeasurementTypeChange: (type: MeasurementType) => void
  showThatValue?: boolean
  showThatMeasurementType?: boolean
  disableThisMeasurementType?: boolean
  disableThatMeasurementType?: boolean
}

const measurementTypes: MeasurementType[] = [
  "LengthUnit",
  "WeightUnit",
  "VolumeUnit",
  "TemperatureUnit",
]

export function QuantityForm({
  thisValue,
  thisUnit,
  thisMeasurementType,
  thatValue,
  thatUnit,
  thatMeasurementType,
  onThisValueChange,
  onThisUnitChange,
  onThisMeasurementTypeChange,
  onThatValueChange,
  onThatUnitChange,
  onThatMeasurementTypeChange,
  showThatValue = true,
  showThatMeasurementType = true,
  disableThisMeasurementType = false,
  disableThatMeasurementType = false,
}: QuantityFormProps) {
  const thisUnits = MEASUREMENT_UNITS[thisMeasurementType]
  const thatUnits = MEASUREMENT_UNITS[thatMeasurementType]

  return (
    <div className="space-y-5">
      {/* This Quantity Section */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          ① First Quantity
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Value
            </label>
            <input
              type="number"
              step="any"
              value={thisValue || ""}
              onChange={(e) =>
                onThisValueChange(parseFloat(e.target.value) || 0)
              }
              className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground focus:border-ring focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Measurement Type
            </label>
            <select
              value={thisMeasurementType}
              onChange={(e) =>
                onThisMeasurementTypeChange(e.target.value as MeasurementType)
              }
              disabled={disableThisMeasurementType}
              className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground focus:border-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              {measurementTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Unit
            </label>
            <select
              value={thisUnit}
              onChange={(e) => onThisUnitChange(e.target.value)}
              className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground focus:border-ring focus:outline-none"
            >
              <option value="">Select unit</option>
              {thisUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* That Quantity Section */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          ② Second Quantity
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {showThatValue ? "Value" : "Target Value (ignored)"}
            </label>
            <input
              type="number"
              step="any"
              value={thatValue || ""}
              onChange={(e) =>
                onThatValueChange(parseFloat(e.target.value) || 0)
              }
              disabled={!showThatValue}
              className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground focus:border-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          {showThatMeasurementType && (
            <div>
              <label className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Measurement Type
              </label>
              <select
                value={thatMeasurementType}
                onChange={(e) =>
                  onThatMeasurementTypeChange(e.target.value as MeasurementType)
                }
                disabled={disableThatMeasurementType}
                className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground focus:border-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                {measurementTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Unit
            </label>
            <select
              value={thatUnit}
              onChange={(e) => onThatUnitChange(e.target.value)}
              className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground focus:border-ring focus:outline-none"
            >
              <option value="">Select unit</option>
              {thatUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
