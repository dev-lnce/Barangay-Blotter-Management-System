"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationCenter } from "@/components/dashboard/notification-center"

export function IncidentsHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
      {/* Left: page title */}
      <div>
        <h1 className="text-base font-semibold text-foreground font-sans">Incident Records</h1>
        <p className="text-xs text-muted-foreground font-sans">Brgy. Banay-Banay 2nd — Blotter Management</p>
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <NotificationCenter />

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-1 border-l border-border">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="Admin user" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">JR</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-foreground font-sans leading-none">Juan R.</p>
            <p className="text-[10px] text-muted-foreground font-sans mt-0.5">Barangay Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
