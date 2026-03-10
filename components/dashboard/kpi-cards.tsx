"use client"

import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2, AlertTriangle, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

export function KpiCards() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    resolutionRate: "0%",
    mostCommonType: "N/A"
  })

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.from('blotter_records').select('status, incident_type')
      
      if (data) {
        const total = data.length
        const resolved = data.filter(r => r.status === 'Resolved').length
        const rate = total > 0 ? ((resolved / total) * 100).toFixed(1) + "%" : "0%"
        
        // Find most common incident type
        const counts = data.reduce((acc: any, curr) => {
          acc[curr.incident_type] = (acc[curr.incident_type] || 0) + 1
          return acc
        }, {})
        const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "N/A")

        setStats({ total, resolved, resolutionRate: rate, mostCommonType: mostCommon })
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { title: "Total Reports", value: stats.total, icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Resolution Rate", value: stats.resolutionRate, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Most Common Type", value: stats.mostCommonType, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Active Cases", value: stats.total - stats.resolved, icon: MapPin, color: "text-purple-600", bg: "bg-purple-100" },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {card.title}
            </CardTitle>
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", card.bg)}>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}