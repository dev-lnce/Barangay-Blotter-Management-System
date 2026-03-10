"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { getResolutionDuration } from "@/lib/analytics-queries"

interface DurationPoint {
  month: string
  avgDays: number
}

export function ResolutionDurationChart() {
  const [durationData, setDurationData] = useState<DurationPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getResolutionDuration()
      setDurationData(data)
      setLoading(false)
    }
    load()
  }, [])

  const avgOverall = durationData.length > 0
    ? durationData.reduce((sum, d) => sum + d.avgDays, 0) / durationData.length
    : 0

  // Trend calculation
  const trendLabel = durationData.length >= 2
    ? durationData[durationData.length - 1].avgDays < durationData[0].avgDays
      ? 'Improving'
      : 'Increasing'
    : 'Stable'

  const trendPct = durationData.length >= 2
    ? Math.abs(
        Math.round(
          ((durationData[0].avgDays - durationData[durationData.length - 1].avgDays) /
            durationData[0].avgDays) *
            100
        )
      )
    : 0

  return (
    <Card className="shadow-sm border-border h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold text-foreground font-sans">
          Average Case Resolution Time
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
          Duration trend over last 6 months (in days)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <Skeleton className="w-full h-[220px] rounded-lg" />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={durationData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 12]}
                  label={{
                    value: "Days",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" },
                  }}
                />
                <ReferenceLine
                  y={avgOverall}
                  stroke="var(--color-muted-foreground)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={{
                    value: `Avg: ${avgOverall.toFixed(1)}d`,
                    position: "right",
                    fill: "var(--color-muted-foreground)",
                    fontSize: 10,
                    fontFamily: "var(--font-sans)",
                  }}
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
                  formatter={(value: number) => [`${value} days`, "Avg. Duration"]}
                />
                <Line
                  type="monotone"
                  dataKey="avgDays"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "var(--color-chart-2)", strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--color-card)" }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="text-xs text-muted-foreground font-sans">
                <span className="font-medium text-foreground">Trend:</span> {trendLabel}
              </div>
              {trendPct > 0 && (
                <div className="text-xs font-sans">
                  <span className={trendLabel === 'Improving' ? 'text-emerald-600' : 'text-red-600'}>
                    {trendLabel === 'Improving' ? '↑' : '↓'} {trendPct}% {trendLabel === 'Improving' ? 'faster' : 'slower'}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
