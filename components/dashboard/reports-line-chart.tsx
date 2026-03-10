"use client"

import { useState, useEffect } from "react"
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function ReportsLineChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [dateBasis, setDateBasis] = useState<"created_at" | "incident_date">("created_at")

  useEffect(() => {
    async function fetchTrendData() {
      const { data } = await supabase
        .from('blotter_records')
        .select('created_at, incident_date')

      if (data) {
        const groups = data.reduce((acc: any, curr) => {
          // Choose which date to use based on the toggle
          const rawDate = dateBasis === "created_at" ? curr.created_at : curr.incident_date
          if (!rawDate) return acc;

          const date = new Date(rawDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          
          if (!acc[date]) acc[date] = { date, total: 0 }
          acc[date].total += 1
          return acc
        }, {})

        const formatted = Object.values(groups).sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        setChartData(formatted)
      }
    }
    fetchTrendData()
  }, [dateBasis]) // Refresh chart whenever the toggle changes

  return (
    <Card className="shadow-sm border-border flex-1 h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-sm font-semibold text-foreground">Incident Trends</CardTitle>
          <CardDescription className="text-xs">
            Viewing by {dateBasis === "created_at" ? "Report Date" : "Incident Date"}
          </CardDescription>
        </div>
        
        {/* New Toggle Buttons */}
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-muted/50">
          <Button
            size="sm"
            variant={dateBasis === "created_at" ? "default" : "ghost"}
            className="h-7 px-3 text-xs font-medium"
            onClick={() => setDateBasis("created_at")}
          >
            Report Date
          </Button>
          <Button
            size="sm"
            variant={dateBasis === "incident_date" ? "default" : "ghost"}
            className="h-7 px-3 text-xs font-medium"
            onClick={() => setDateBasis("incident_date")}
          >
            Incident Date
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="oklch(0.45 0.18 255)"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              name="Total Reports"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}