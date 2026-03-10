"use client"

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

const durationData = [
  { month: "Oct", avgDays: 8.2 },
  { month: "Nov", avgDays: 7.5 },
  { month: "Dec", avgDays: 9.1 },
  { month: "Jan", avgDays: 6.8 },
  { month: "Feb", avgDays: 5.9 },
  { month: "Mar", avgDays: 5.2 },
]

export function ResolutionDurationChart() {
  const avgOverall = durationData.reduce((sum, d) => sum + d.avgDays, 0) / durationData.length

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
            <span className="font-medium text-foreground">Trend:</span> Improving
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 font-sans">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            36% faster than Q3
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
