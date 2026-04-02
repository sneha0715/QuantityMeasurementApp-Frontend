import { useQuery } from "@tanstack/react-query"
import { getApiErrorMessage } from "@/core/apiError"
import { quantityService } from "../quantity/quantityService"

export function ErrorHistory() {
  const {
    data: errors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["history", "errors"],
    queryFn: () => quantityService.getErrorHistory(),
  })

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">⚠ Error History</h1>
        <p className="mt-1 text-muted-foreground">
          View history of operations that resulted in errors
        </p>
      </div>

      {isLoading && <div className="text-muted-foreground">Loading...</div>}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">
            {getApiErrorMessage(error, "Failed to load error history")}
          </p>
        </div>
      )}

      {errors.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No errors found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {errors.map((record) => (
            <div
              key={record.id}
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-4"
            >
              <div className="space-y-2">
                <p className="font-medium text-destructive">
                  {record.operation.toUpperCase()}
                </p>
                <p className="text-sm text-destructive">
                  {record.thisValue} {record.thisUnit}{" "}
                  {record.operation.toLowerCase()} {record.thatValue}{" "}
                  {record.thatUnit}
                </p>
                <p className="text-sm font-medium text-destructive">
                  Error: {record.errorMessage}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(record.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
