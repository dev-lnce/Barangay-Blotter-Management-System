"use client"

import { useEffect, useState } from "react"
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
  X,
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
  const [showDailyTasks, setShowDailyTasks] = useState(true)

  // Persist "Araw-araw na Gawain" widget state
  useEffect(() => {
    const savedState = localStorage.getItem("isDailyTaskWidgetVisible")
    if (savedState !== null) {
      setShowDailyTasks(savedState === "true")
    }
  }, [])

  const handleToggleDailyTasks = (visible: boolean) => {
    setShowDailyTasks(visible)
    localStorage.setItem("isDailyTaskWidgetVisible", visible.toString())
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shadow-sm border border-white/20">
          <ShieldAlert className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-sans italic text-xl font-bold text-white">BarangayBlotter</p>
          <p className="text-[9px] text-white/70 tracking-[0.15em] uppercase mt-0.5">Sistema ng Serbisyo</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Navigation
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors relative",
                active
                  ? "bg-white/15 text-white font-semibold"
                  : "text-white/70 font-medium hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-white" : "text-white/60"
                )}
              />
              {label}
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-white rounded-r-sm" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Daily Tasks Card */}
      {showDailyTasks && (
        <div className="px-4 py-4 mt-auto">
          <div className="group relative rounded-[1rem] bg-white/10 p-4 backdrop-blur-md border border-white/20 shadow-lg">
            <button 
              onClick={() => handleToggleDailyTasks(false)}
              className="absolute top-2 right-2 p-1 rounded-full text-white/20 hover:text-white/60 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 mb-3">Araw-araw na Gawain</h4>
            <div className="space-y-2 mb-4">
              <p className="text-xs text-white/80 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                <span>3 bagong reklamo</span>
              </p>
              <p className="text-xs text-white/80 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                <span>1 hearing bukas</span>
              </p>
            </div>
            <Link href="/incidents" className="flex w-full items-center justify-center rounded-lg bg-white px-3 py-2.5 text-xs font-semibold text-[#1e90ff] hover:bg-white/90 transition-all shadow-sm active:scale-[0.98]">
              Tingnan ang Mga Kaso
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-3 space-y-1">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <HelpCircle className="h-4 w-4 shrink-0 text-white/50" />
          Tulong
        </button>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0 text-white/50" />
            Mag-logout
          </button>
        </form>
      </div>
    </aside>
  )
}
