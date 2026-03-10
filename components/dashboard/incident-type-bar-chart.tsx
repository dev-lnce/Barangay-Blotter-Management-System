"use client"

import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

// Colors mapped to your globals.css chart variables
const COLORS = [
  "oklch(0.45 0.18 255)", // Deep Navy (Primary)
  "oklch(0.62 0.15 200)", // Blue-Green
  "oklch(0.72 0.17 160)", // Emerald
  "oklch(0.8 0.16 85)",   // Yellow-Amber
  "oklch(0.65 0.22 30)",   // Red-Orange
  "oklch(0.52 0.025 255)", // Muted
]

export function IncidentTypeBarChart() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchChartData() {
      setIsLoading(true)
      try {
        const { data: records, error } = await supabase
          .from('blotter_records')
          .select('incident_type')

        if (error) throw error

        if (records) {
          // Group and count incidents by type
          const counts = records.reduce((acc: any, curr) => {
            const type = curr.incident_type || 'Other'
            acc[type] = (acc[type] || 0) + 1
            return acc
          }, {})
          
          // Format for Recharts and sort by count (highest first)
          const formatted = Object.keys(counts).map(key => ({
            type: key,
            count: counts[key]
          })).sort((a, b) => b.count - a.count)

          setData(formatted)
        }
      } catch (error) {
        console.error("Error fetching bar chart data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [])

  return (
    <Card className="shadow-sm border-border w-full h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold text-foreground font-sans">
          Types of Reports Received
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
          Breakdown by incident category
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex-1">
        {isLoading ? (
          <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground">
            Loading chart data...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[240px] flex items-center justify-center text-xs text-muted-foreground text-center">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.01 250)" />
              <XAxis
                dataKey="type"
                tick={{ fontSize: 10, fill: "oklch(0.52 0.02 255)", fontFamily: "var(--font-sans)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.52 0.02 255)", fontFamily: "var(--font-sans)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "oklch(0.94 0.008 250)", opacity: 0.4 }}
                contentStyle={{
                  background: "white",
                  border: "1px solid oklch(0.9 0.01 250)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}