"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Map,
  BarChart2,
  Users,
  ScrollText,
  LogOut,
  ShieldAlert,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/auth-actions"

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Incident Records", href: "/incidents", icon: FileText },
  { label: "Mga Tao (Citizens)", href: "/citizens", icon: Users },
  { label: "Heat Map", href: "/heatmap", icon: Map },
  { label: "Analysis", href: "/analysis", icon: BarChart2 },
  { label: "Audit Log", href: "/audit", icon: ScrollText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <ShieldAlert className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="leading-tight">
          <p className="font-serif italic text-xl font-bold text-sidebar-foreground">BarangayBlotter</p>
          <p className="text-[9px] text-sidebar-foreground/70 font-sans tracking-[0.15em] uppercase mt-0.5">Sistema ng Serbisyo</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 font-sans">
          Navigation
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors font-sans relative",
                active
                  ? "bg-sidebar-active text-sidebar-foreground font-semibold"
                  : "text-sidebar-foreground/70 font-medium hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-primary" : "text-sidebar-foreground/60"
                )}
              />
              {label}
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary rounded-r-sm" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Daily Tasks Card */}
      <div className="px-4 py-4 mt-auto">
        <div className="rounded-[1rem] bg-card p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
          <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar mb-3">Araw-araw na Gawain</h4>
          <div className="space-y-2 mb-4">
            <p className="font-sans text-xs text-sidebar/80 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
              <span>3 bagong reklamo</span>
            </p>
            <p className="font-sans text-xs text-sidebar/80 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>1 hearing bukas</span>
            </p>
          </div>
          <Link href="/incidents" className="flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            Tingnan ang Mga Kaso
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3 space-y-1">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors font-sans"
        >
          <HelpCircle className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
          Tulong
        </button>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-colors font-sans"
          >
            <LogOut className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
            Mag-logout
          </button>
        </form>
      </div>
    </aside>
  )
}
