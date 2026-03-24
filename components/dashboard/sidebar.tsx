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
    <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#002576] border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#feb71a] overflow-hidden shrink-0">
          <img src="/brgy-seal.jpg" alt="Barangay Seal" className="object-cover w-full h-full" />
        </div>
        <div className="leading-tight">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white">The Digital Ledger</p>
          <p className="text-[8px] text-white/40 tracking-widest mt-0.5">Official Blotter System</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
        <p className="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase px-4 mb-2 mt-4">
          NAVIGATION
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 mx-2 text-sm transition-colors relative",
                active
                  ? "bg-white/15 text-white font-semibold before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#feb71a] before:rounded-r-full"
                  : "text-white/65 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-white" : "text-white/65"
                )}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Daily Tasks Card */}
      {showDailyTasks && (
        <div className="mt-auto mx-3 mb-3 shrink-0">
          <div className="group relative rounded-xl bg-white/8 p-4 backdrop-blur border border-white/10">
            <button 
              onClick={() => handleToggleDailyTasks(false)}
              className="absolute top-2 right-2 p-1 rounded-full text-white/20 hover:text-white/60 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
            <h4 className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mb-3">Araw-araw na Gawain</h4>
            <div className="space-y-2 mb-4">
              <p className="text-xs text-white/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                <span>3 bagong reklamo</span>
              </p>
              <p className="text-xs text-white/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                <span>1 hearing bukas</span>
              </p>
            </div>
            <Link href="/incidents" className="flex w-full items-center justify-center rounded-lg bg-[#feb71a] px-3 py-2.5 text-xs font-black text-[#1a1200] hover:bg-yellow-300 transition-colors">
              Tingnan ang Mga Kaso
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-white/10 mx-3 py-3 space-y-1">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-white/65 hover:bg-white/10 hover:text-white transition-colors"
        >
          <HelpCircle className="h-4 w-4 shrink-0 text-white/65" />
          Tulong
        </button>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-white/65 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0 text-white/65" />
            Mag-logout
          </button>
        </form>
      </div>
    </aside>
  )
}
