"use client"

import { useState, useEffect } from "react"
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function ReportsLineChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [dateBasis, setDateBasis] = useState<"created_at" | "incident_date">("created_at")

  useEffect(() => {
    async function fetchTrendData() {
      const { data } = await supabase
        .from('blotter_records')
        .select('created_at, incident_date, status')

      if (data) {
        const groups = data.reduce((acc: any, curr) => {
          const rawDate = dateBasis === "created_at" ? curr.created_at : curr.incident_date
          if (!rawDate) return acc;

          const date = new Date(rawDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          
          if (!acc[date]) acc[date] = { date, total: 0, resolved: 0, unresolved: 0 }
          acc[date].total += 1

          if (curr.status === "Resolved") {
            acc[date].resolved += 1
          } else {
            acc[date].unresolved += 1
          }

          return acc
        }, {})

        const formatted = Object.values(groups).sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        setChartData(formatted)
      }
    }
    fetchTrendData()
  }, [dateBasis])

  return (
    <Card className="shadow-sm border-border flex-1 h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-xl font-bold font-sans text-foreground">Trend ng mga Kaso</CardTitle>
          <CardDescription className="text-[10px] font-bold text-muted-foreground font-sans uppercase tracking-[0.15em] mt-1">
            VIEWING BY {dateBasis === "created_at" ? "REPORT DATE" : "INCIDENT DATE"}
          </CardDescription>
        </div>
        
        {/* Toggle Buttons */}
        <div className="flex items-center gap-1 rounded-lg border border-border p-1 bg-secondary/30">
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
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--card)',
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
            />
            <Line
              type="monotone"
              dataKey="unresolved"
              stroke="var(--chart-5)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--chart-5)" }}
              name="Unresolved"
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke="var(--chart-2)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--chart-2)" }}
              name="Resolved"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
