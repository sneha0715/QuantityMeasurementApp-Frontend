import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { getApiErrorMessage } from "@/core/apiError"
import { useAuthStore } from "@/core/authStore"
import { quantityService } from "@/modules/quantity/quantityService"
import type { OperationType } from "@/types"

const operations: OperationType[] = [
  "COMPARE",
  "CONVERT",
  "ADD",
  "SUBTRACT",
  "DIVIDE",
]

export function Dashboard() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const countsQueries = useQuery({
    queryKey: ["counts", isAuthenticated],
    queryFn: async () => {
      const counts: Record<string, number> = {}
      for (const op of operations) {
        counts[op] = await quantityService.getOperationCount(op)
      }
      return counts
    },
    enabled: isAuthenticated,
    retry: 1,
  })

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Minimal workspace for quantity operations and quick access.
            </p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-lg">
            📊
          </span>
        </div>
      </section>

      {isAuthenticated ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {operations.map((op) => (
              <div
                key={op}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                  {op}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {countsQueries.data?.[op] ?? "—"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">operations</p>
              </div>
            ))}
          </div>

          {countsQueries.isError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
              <p className="text-sm font-medium text-destructive">
                {getApiErrorMessage(
                  countsQueries.error,
                  "Failed to load operation counts."
                )}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Guest Mode</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You can use all quantity operations without signing in. Login to
            track usage counts and access history.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Register
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ActionCard
          icon="⚖️"
          title="Compare Quantities"
          description="Check if two quantities are equal"
          href="/operations/compare"
        />
        <ActionCard
          icon="🔁"
          title="Convert Units"
          description="Convert between different units of the same type"
          href="/operations/convert"
        />
        <ActionCard
          icon="➕"
          title="Add Quantities"
          description="Add two quantities of the same type"
          href="/operations/add"
        />
        <ActionCard
          icon="➖"
          title="Subtract Quantities"
          description="Subtract one quantity from another"
          href="/operations/subtract"
        />
        <ActionCard
          icon="➗"
          title="Divide Quantities"
          description="Divide one quantity by another"
          href="/operations/divide"
        />
        {isAuthenticated ? (
          <ActionCard
            icon="🕘"
            title="View History"
            description="See all your operations and their results"
            href="/history/operation"
          />
        ) : (
          <ActionCard
            icon="🔐"
            title="History Requires Login"
            description="Sign in to store and view your operation history"
            href="/login"
          />
        )}
      </div>
    </div>
  )
}

interface ActionCardProps {
  icon: string
  title: string
  description: string
  href: string
}

function ActionCard({ icon, title, description, href }: ActionCardProps) {
  return (
    <a
      href={href}
      className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-accent"
    >
      <p className="text-lg">{icon}</p>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </a>
  )
}
