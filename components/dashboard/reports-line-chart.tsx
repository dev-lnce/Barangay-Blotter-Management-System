"use client"

import { useState } from "react"
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
  Legend,
} from "recharts"

const allData = [
  { date: "Jan 1", total: 42, resolved: 30, unresolved: 12 },
  { date: "Jan 8", total: 38, resolved: 25, unresolved: 13 },
  { date: "Jan 15", total: 55, resolved: 40, unresolved: 15 },
  { date: "Jan 22", total: 47, resolved: 32, unresolved: 15 },
  { date: "Jan 29", total: 62, resolved: 44, unresolved: 18 },
  { date: "Feb 5", total: 58, resolved: 41, unresolved: 17 },
  { date: "Feb 12", total: 74, resolved: 55, unresolved: 19 },
  { date: "Feb 19", total: 68, resolved: 50, unresolved: 18 },
  { date: "Feb 26", total: 81, resolved: 60, unresolved: 21 },
  { date: "Mar 4", total: 76, resolved: 57, unresolved: 19 },
  { date: "Mar 10", total: 89, resolved: 65, unresolved: 24 },
]

type FilterKey = "all" | "resolved" | "unresolved"

const filterConfig: Record<FilterKey, { key: string; color: string; label: string }> = {
  all: { key: "total", color: "var(--color-chart-1)", label: "Total Reports" },
  resolved: { key: "resolved", color: "var(--color-chart-3)", label: "Resolved" },
  unresolved: { key: "unresolved", color: "var(--color-chart-5)", label: "Unresolved" },
}

export function ReportsLineChart() {
  const [filter, setFilter] = useState<FilterKey>("all")
  const { key, color, label } = filterConfig[filter]

  return (
    <Card className="shadow-sm border-border flex-1">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-sm font-semibold text-foreground font-sans">
            Quantity of Reports Over Time
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
            Weekly incident submission trend
          </CardDescription>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-muted/50 shrink-0">
          {(["all", "resolved", "unresolved"] as FilterKey[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "ghost"}
              className="h-7 px-3 text-xs font-medium capitalize font-sans"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={allData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: 12,
                fontFamily: "var(--font-sans)",
              }}
              labelStyle={{ color: "var(--color-foreground)", fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              name={label}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
