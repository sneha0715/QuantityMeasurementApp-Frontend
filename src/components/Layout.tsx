import type { ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/core/authStore"
import { authService } from "@/modules/auth/authService"
import { useMutation } from "@tanstack/react-query"
import { useTheme } from "@/components/theme-provider"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const { isAuthenticated, username, clearAuth } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth()
      navigate("/login")
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handleToggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
      return
    }

    if (theme === "light") {
      setTheme("dark")
      return
    }

    setTheme("dark")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-left"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-sm">
                ⚖️
              </span>
              <h1 className="text-lg font-bold text-foreground sm:text-xl">
                Quantity Measurement
              </h1>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleTheme}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent sm:text-sm"
                title="Toggle dark/light mode"
              >
                {theme === "dark" ? "☀ Light" : "☾ Dark"}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="hidden text-sm text-muted-foreground sm:block">
                    {username}
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 sm:text-sm"
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <>
                  <HeaderLink href="/login">Login</HeaderLink>
                  <HeaderLink href="/register">Sign up</HeaderLink>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-5">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>

            <div className="group relative inline-block">
              <MenuTrigger>Operations</MenuTrigger>
              <div className="absolute left-0 z-10 hidden min-w-44 rounded-xl border border-border bg-popover p-1.5 shadow-lg group-hover:block">
                <DropdownLink href="/operations/compare">Compare</DropdownLink>
                <DropdownLink href="/operations/convert">Convert</DropdownLink>
                <DropdownLink href="/operations/add">Add</DropdownLink>
                <DropdownLink href="/operations/subtract">
                  Subtract
                </DropdownLink>
                <DropdownLink href="/operations/divide">Divide</DropdownLink>
              </div>
            </div>

            <div className="group relative inline-block">
              <MenuTrigger>History</MenuTrigger>
              <div className="absolute left-0 z-10 hidden min-w-44 rounded-xl border border-border bg-popover p-1.5 shadow-lg group-hover:block">
                {isAuthenticated ? (
                  <>
                    <DropdownLink href="/history/operation">
                      Operation
                    </DropdownLink>
                    <DropdownLink href="/history/type">Type</DropdownLink>
                    <DropdownLink href="/history/errors">Error</DropdownLink>
                  </>
                ) : (
                  <DropdownLink href="/login">
                    Login to view history
                  </DropdownLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

function HeaderLink({ href, children }: { href: string; children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault()
        navigate(href)
      }}
      className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent sm:text-sm"
    >
      {children}
    </a>
  )
}

function MenuTrigger({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex cursor-default border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
      {children}
    </span>
  )
}

function DropdownLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  const navigate = useNavigate()

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault()
        navigate(href)
      }}
      className="block rounded-md px-3 py-2 text-sm font-medium text-popover-foreground hover:bg-accent hover:text-foreground"
    >
      {children}
    </a>
  )
}

function NavLink({
  href,
  children,
  className = "",
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === href

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault()
        navigate(href)
      }}
      className={`border-b-2 py-3 text-sm font-medium transition-colors ${
        isActive
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      {children}
    </a>
  )
}
