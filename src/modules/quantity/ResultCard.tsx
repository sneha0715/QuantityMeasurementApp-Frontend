import type { QuantityMeasurementDTO } from "@/types"

interface ResultCardProps {
  result: QuantityMeasurementDTO
  operation: string
}

export function ResultCard({ result, operation }: ResultCardProps) {
  if (result.error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 shadow-sm">
        <h4 className="font-semibold text-destructive">⚠ Operation Error</h4>
        <p className="mt-2 text-sm text-destructive">
          {result.errorMessage || "An error occurred during the operation"}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-semibold text-foreground">✅ Result</h4>
        <span className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold tracking-wide text-muted-foreground">
          {operation.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
        <div className="rounded-md border border-border/70 bg-background p-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            First Quantity
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {result.thisValue} {result.thisUnit}
          </p>
        </div>

        <div className="rounded-md border border-border/70 bg-background p-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Second Quantity
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {result.thatValue} {result.thatUnit}
          </p>
        </div>

        {operation.toUpperCase() === "COMPARE" && (
          <div className="rounded-md border border-border/70 bg-background p-3 md:col-span-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Comparison
            </p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {result.resultString}
            </p>
          </div>
        )}

        {operation.toUpperCase() === "CONVERT" && (
          <div className="rounded-md border border-border/70 bg-background p-3 md:col-span-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Converted Value
            </p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {result.resultValue} {result.thatUnit}
            </p>
          </div>
        )}

        {["ADD", "SUBTRACT", "DIVIDE"].includes(operation.toUpperCase()) && (
          <div className="rounded-md border border-border/70 bg-background p-3 md:col-span-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Output
            </p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {result.resultValue}
              {result.resultUnit && ` ${result.resultUnit}`}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground md:col-span-2">
          Created at: {new Date(result.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  )
}
