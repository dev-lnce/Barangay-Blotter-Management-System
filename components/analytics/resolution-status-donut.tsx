"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { getResolutionStatusBreakdown } from "@/lib/analytics-queries"

interface StatusEntry {
  name: string
  value: number
  color: string
}

export function ResolutionStatusDonut() {
  const [statusData, setStatusData] = useState<StatusEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getResolutionStatusBreakdown()
      setStatusData(data)
      setLoading(false)
    }
    load()
  }, [])

  const total = statusData.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="shadow-sm border-border h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold text-foreground font-sans">
          Resolution Status Breakdown
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
          Distribution of case outcomes
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <Skeleton className="w-full h-[200px] rounded-lg" />
        ) : (
          <>
            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: 12,
                      fontFamily: "var(--font-sans)",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} cases (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-foreground font-sans">{total}</span>
                <span className="text-[10px] text-muted-foreground font-sans">Total Cases</span>
              </div>
            </div>
            {/* Legend */}
            <div className="mt-2 space-y-2">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {item.value}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
