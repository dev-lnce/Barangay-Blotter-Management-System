"use client"

import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2, AlertTriangle, MapPin, TrendingUp, TrendingDown, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

export function KpiCards() {
  const [stats, setStats] = useState({
    total: 0,
    totalTrend: "+0%",
    totalTrendDir: "neutral",
    resolutionRate: "0%",
    resolutionTrend: "+0% improvement",
    hotspotArea: "N/A",
    hotspotCount: 0,
    avgResolution: "0 Days",
  })

  useEffect(() => {
    async function fetchKpiData() {
      const now = new Date()
      const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

      const { data: allRecords } = await supabase.from('blotter_records').select('*')
      
      if (allRecords) {
        // 1. Total Reports & Trend (Real-time logic fits here implicitly as we re-fetch)
        const total = allRecords.length
        const currentMonthRecords = allRecords.filter(r => r.created_at >= firstDayCurrentMonth)
        const currentMonthCount = currentMonthRecords.length
        const lastMonthCount = allRecords.filter(r => r.created_at >= firstDayLastMonth && r.created_at < firstDayCurrentMonth).length
        
        const totalTrendVal = lastMonthCount > 0 
          ? ((currentMonthCount - lastMonthCount) / lastMonthCount * 100).toFixed(0) 
          : "0"
        const totalTrend = `${Number(totalTrendVal) >= 0 ? '+' : ''}${totalTrendVal}% from last month`
        const totalTrendDir = Number(totalTrendVal) > 0 ? "up" : Number(totalTrendVal) < 0 ? "down" : "neutral"

        // 2. Resolution Rate & Trend
        const resolved = allRecords.filter(r => r.status === 'Resolved').length
        const rate = total > 0 ? ((resolved / total) * 100).toFixed(1) + "%" : "0%"
        const resolutionTrend = "Overall Case Closure"

        // 3. Hotspot of the Month
        const locationCounts = currentMonthRecords.reduce((acc: any, curr) => {
          if (curr.location) {
            acc[curr.location] = (acc[curr.location] || 0) + 1
          }
          return acc
        }, {})
        const topLocation = Object.keys(locationCounts).length > 0
          ? Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b)
          : "N/A"
        const topLocationCount = locationCounts[topLocation] || 0

        // 4. Avg Resolution Time
        const resolvedRecords = allRecords.filter(r => r.status === 'Resolved' && r.updated_at !== r.created_at)
        let avgDays = 0
        if (resolvedRecords.length > 0) {
          const totalDays = resolvedRecords.reduce((sum, r) => {
            const diffTime = Math.abs(new Date(r.updated_at).getTime() - new Date(r.created_at).getTime())
            return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          }, 0)
          avgDays = totalDays / resolvedRecords.length
        }

        setStats({
          total,
          totalTrend,
          totalTrendDir,
          resolutionRate: rate,
          resolutionTrend,
          hotspotArea: topLocation.split(',')[0],
          hotspotCount: topLocationCount,
          avgResolution: `${avgDays.toFixed(1)} Days`,
        })
      }
    }
    fetchKpiData()

    // Real-time subscription for KPI updates
    const channel = supabase.channel('kpi-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blotter_records' }, () => {
        fetchKpiData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const cards = [
    { 
      title: "Bilang ng Insidente (Real-time)", 
      value: stats.total.toLocaleString(), 
      trend: stats.totalTrend, 
      trendDir: stats.totalTrendDir, 
      icon: FileText, 
      color: "text-primary-foreground", 
      bg: "bg-primary" 
    },
    { 
      title: "Resolution Rate", 
      value: stats.resolutionRate, 
      trend: stats.resolutionTrend, 
      trendDir: "neutral", 
      icon: CheckCircle2, 
      color: "text-primary-foreground", 
      bg: "bg-primary" 
    },
    { 
      title: "Hotspot of the Month", 
      value: stats.hotspotArea, 
      trend: `${stats.hotspotCount} incidents this month`, 
      trendDir: "neutral", 
      icon: MapPin, 
      color: "text-primary-foreground", 
      bg: "bg-primary" 
    },
    { 
      title: "Avg Resolution Time", 
      value: stats.avgResolution, 
      trend: "Based on resolved cases", 
      trendDir: "neutral", 
      icon: Timer, 
      color: "text-primary-foreground", 
      bg: "bg-primary" 
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="shadow-[0_1px_3px_rgba(25,28,30,0.08),0_8px_24px_rgba(25,28,30,0.04)] border-none bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <CardTitle className="text-[10px] font-extrabold text-[#44474e] uppercase tracking-[0.2em] font-sans">
              {card.title}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full shadow-sm bg-[#002576]">
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-[#002576] font-sans tracking-tight mt-1">{card.value}</p>
            <div className="mt-2 flex items-center gap-1.5">
              {card.trendDir === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
              <span className={cn(
                "text-[11px] font-medium font-sans",
                card.trendDir === "up" ? "text-emerald-600" : "text-muted-foreground"
              )}>
                {card.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
