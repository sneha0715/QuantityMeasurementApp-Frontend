import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getApiErrorMessage } from "@/core/apiError"
import { quantityService } from "../quantity/quantityService"
import type { OperationType } from "@/types"

export function OperationHistory() {
  const [operation, setOperation] = useState<OperationType>("COMPARE")
  const operations: OperationType[] = [
    "COMPARE",
    "CONVERT",
    "ADD",
    "SUBTRACT",
    "DIVIDE",
  ]

  const {
    data: history = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["history", "operation", operation],
    queryFn: () => quantityService.getHistoryByOperation(operation),
    enabled: !!operation,
  })

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          🕘 Operation History
        </h1>
        <p className="mt-1 text-muted-foreground">
          View history of operations performed
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <label className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Operation
        </label>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value as OperationType)}
          className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground focus:border-ring focus:outline-none"
        >
          {operations.map((op) => (
            <option key={op} value={op}>
              {op}
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
            No history found for this operation
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
                    {record.thisValue} {record.thisUnit} {record.operation}{" "}
                    {record.thatValue} {record.thatUnit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.createdAt).toLocaleString()}
                  </p>
                </div>
                {record.resultString && (
                  <div className="text-lg font-semibold text-foreground">
                    {record.resultString}
                  </div>
                )}
                {record.resultValue != null && (
                  <div className="text-lg font-semibold text-foreground">
                    {record.resultValue} {record.resultUnit || ""}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
