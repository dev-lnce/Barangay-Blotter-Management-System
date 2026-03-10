"use client"

import { useState, useEffect } from "react"
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type FilterKey = "all" | "resolved" | "unresolved"

const filterConfig: Record<FilterKey, { key: string; color: string; label: string }> = {
  all: { key: "total", color: "oklch(0.45 0.18 255)", label: "Total Reports" },
  resolved: { key: "resolved", color: "oklch(0.72 0.17 160)", label: "Resolved" },
  unresolved: { key: "unresolved", color: "oklch(0.65 0.22 30)", label: "Unresolved" },
}

export function ReportsLineChart() {
  const [filter, setFilter] = useState<FilterKey>("all")
  const [chartData, setChartData] = useState<any[]>([])
  const { key, color, label } = filterConfig[filter]

  useEffect(() => {
    async function fetchTrendData() {
      const { data, error } = await supabase
        .from('blotter_records')
        .select('created_at, status')

      if (data) {
        // Group by date
        const groups = data.reduce((acc: any, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
          
          if (!acc[date]) {
            acc[date] = { date, total: 0, resolved: 0, unresolved: 0 }
          }
          
          acc[date].total += 1
          if (curr.status === 'Resolved') {
            acc[date].resolved += 1
          } else {
            acc[date].unresolved += 1
          }
          
          return acc
        }, {})

        // Convert to array and sort by date
        const formatted = Object.values(groups).sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        setChartData(formatted)
      }
    }
    fetchTrendData()
  }, [])

  return (
    <Card className="shadow-sm border-border flex-1 h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-sm font-semibold text-foreground">
            Quantity of Reports Over Time
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Daily incident submission trend
          </CardDescription>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-muted/50 shrink-0">
          {(["all", "resolved", "unresolved"] as FilterKey[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "ghost"}
              className="h-7 px-3 text-xs font-medium capitalize"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.01 250)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "oklch(0.52 0.02 255)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "oklch(0.52 0.02 255)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px"
              }}
            />
            <Line
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name={label}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}