"use client"

import { useEffect, useState } from "react"
import { Bell, Clock, AlertCircle, Calendar, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  description: string
  type: "warning" | "info" | "urgent"
  time: string
  recordId?: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function checkNotifications() {
      const { data } = await supabase.from('blotter_records').select('*')
      if (!data) return

      const newNotifications: Notification[] = []
      const now = new Date()

      data.forEach(record => {
        // 1. Follow-up Check (> 7 days open)
        if (record.status === 'Open') {
          const created = new Date(record.created_at)
          const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 3600 * 24))
          
          if (diffDays >= 7) {
            newNotifications.push({
              id: `followup-${record.id}`,
              title: "Follow-up Required",
              description: `Case BLT-${new Date(record.created_at).getFullYear()}-${record.id.toString().padStart(4, '0')} has been open for ${diffDays} days.`,
              type: "warning",
              time: "Action Needed",
              recordId: record.id
            })
          }
        }
      })

      // 2. Mock Hearing Notification
      newNotifications.push({
        id: "mock-1",
        title: "Upcoming Hearing",
        description: "Hearing for Amicable Settlement in Zone 3 at 2:00 PM.",
        type: "urgent",
        time: "Today",
      })

      setNotifications(newNotifications)
    }

    checkNotifications()
  }, [])

  const unreadCount = notifications.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg hover:bg-muted/60 transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive border border-background"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4 mt-2" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="text-xs font-black font-sans uppercase tracking-[0.2em] text-foreground">Mga Abiso</h4>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">
              {unreadCount} Bago
            </span>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 opacity-10 mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Walang bagong abiso</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="group relative flex flex-col gap-1 border-b p-4 hover:bg-muted/30 transition-colors cursor-pointer last:border-0">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    n.type === "warning" ? "bg-amber-100 text-amber-600" : 
                    n.type === "urgent" ? "bg-destructive/10 text-destructive" :
                    "bg-blue-100 text-blue-600"
                  )}>
                    {n.type === "warning" ? <Clock className="h-3.5 w-3.5" /> : 
                     n.type === "urgent" ? <AlertCircle className="h-3.5 w-3.5" /> :
                     <Calendar className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] font-black font-sans text-foreground uppercase tracking-wider">{n.title}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{n.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] font-bold text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                        {n.time}
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t p-2">
          <Button 
            variant="ghost" 
            className="w-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 h-8"
            onClick={() => setNotifications([])}
          >
            Mark all as read
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
