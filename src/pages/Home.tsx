import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/core/authStore"

export function Home() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div>
            <p className="mb-3 inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              Precision tools • Minimal workflow
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Measure, Compare, Convert
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              A clean workspace for quantity operations. Guests can run all
              operations. Authenticated users also get saved history and usage
              insights.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Open Dashboard
              </button>
              <button
                onClick={() => navigate("/operations/compare")}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Start with Compare
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4 lg:mt-1">
            <p className="text-sm font-semibold text-foreground">
              Quick Access
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <QuickLink
                label="Compare"
                onClick={() => navigate("/operations/compare")}
              />
              <QuickLink
                label="Convert"
                onClick={() => navigate("/operations/convert")}
              />
              <QuickLink
                label="Add / Subtract / Divide"
                onClick={() => navigate("/operations/add")}
              />
              <QuickLink
                label="History"
                onClick={() =>
                  navigate(isAuthenticated ? "/history/operation" : "/login")
                }
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function QuickLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-left text-foreground hover:bg-accent"
    >
      <span>{label}</span>
      <span className="text-muted-foreground">→</span>
    </button>
  )
}
