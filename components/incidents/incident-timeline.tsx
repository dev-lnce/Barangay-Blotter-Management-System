"use client"

import { CheckCircle2, Clock, FileText, Scale } from "lucide-react"

export type TimelineEvent = {
  id: string
  title: string
  description: string
  date: string
  status: "completed" | "current" | "upcoming"
  type: "filed" | "investigated" | "hearing" | "resolved"
}

interface IncidentTimelineProps {
  events: TimelineEvent[]
}

export function IncidentTimeline({ events }: IncidentTimelineProps) {
  return (
    <div className="space-y-6">
      {events.map((event, index) => {
        const isCompleted = event.status === "completed"
        const isCurrent = event.status === "current"
        
        let Icon = FileText
        let bgColor = "bg-muted text-muted-foreground"
        let lineColor = "bg-border"

        if (event.type === "filed" || event.type === "resolved") {
          Icon = CheckCircle2
        } else if (event.type === "hearing") {
          Icon = Scale
        } else if (event.type === "investigated") {
          Icon = Clock
        }

        if (isCompleted) {
          bgColor = "bg-primary text-primary-foreground"
          lineColor = "bg-primary"
        } else if (isCurrent) {
          bgColor = "bg-amber-500 text-white ring-4 ring-amber-500/20"
        }

        return (
          <div key={event.id} className="relative flex gap-4">
            {/* Timeline Line */}
            {index < events.length - 1 && (
              <div className={`absolute left-4 top-10 bottom-[-24px] w-0.5 ${lineColor}`} />
            )}
            
            {/* Icon Bubble */}
            <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${bgColor} shadow-sm`}>
              <Icon className="h-4 w-4" />
            </div>
            
            {/* Content */}
            <div className="flex flex-col pb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 font-sans">
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
                })}
              </span>
              <h4 className={`text-base font-bold font-sans mb-1 ${isCurrent ? 'text-foreground' : 'text-foreground/80'}`}>
                {event.title}
              </h4>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed max-w-sm">
                {event.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
