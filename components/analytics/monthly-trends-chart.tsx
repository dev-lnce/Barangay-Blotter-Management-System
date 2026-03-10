"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const monthlyData = [
  { month: "Jan", theft: 18, noise: 12, vandalism: 8, assault: 5, trespassing: 4 },
  { month: "Feb", theft: 22, noise: 15, vandalism: 6, assault: 7, trespassing: 3 },
  { month: "Mar", theft: 25, noise: 18, vandalism: 10, assault: 4, trespassing: 6 },
  { month: "Apr", theft: 19, noise: 14, vandalism: 7, assault: 8, trespassing: 5 },
  { month: "May", theft: 28, noise: 20, vandalism: 12, assault: 6, trespassing: 4 },
  { month: "Jun", theft: 32, noise: 22, vandalism: 9, assault: 9, trespassing: 7 },
  { month: "Jul", theft: 35, noise: 25, vandalism: 14, assault: 7, trespassing: 5 },
  { month: "Aug", theft: 30, noise: 19, vandalism: 11, assault: 10, trespassing: 6 },
  { month: "Sep", theft: 24, noise: 16, vandalism: 8, assault: 6, trespassing: 4 },
  { month: "Oct", theft: 21, noise: 13, vandalism: 6, assault: 5, trespassing: 3 },
  { month: "Nov", theft: 26, noise: 17, vandalism: 9, assault: 7, trespassing: 5 },
  { month: "Dec", theft: 29, noise: 21, vandalism: 13, assault: 8, trespassing: 6 },
]

const categories = [
  { key: "theft", label: "Theft", color: "var(--color-chart-1)" },
  { key: "noise", label: "Noise Disturbance", color: "var(--color-chart-2)" },
  { key: "vandalism", label: "Vandalism", color: "var(--color-chart-3)" },
  { key: "assault", label: "Assault", color: "var(--color-chart-5)" },
  { key: "trespassing", label: "Trespassing", color: "var(--color-chart-4)" },
]

export function MonthlyTrendsChart() {
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold text-foreground font-sans">
          Monthly Incident Trends by Category
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
          Stacked view of crime patterns across the year
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
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
              label={{
                value: "Incidents",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" },
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
              cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 16, fontSize: 11, fontFamily: "var(--font-sans)" }}
              iconType="circle"
              iconSize={8}
            />
            {categories.map((cat, idx) => (
              <Bar
                key={cat.key}
                dataKey={cat.key}
                name={cat.label}
                stackId="incidents"
                fill={cat.color}
                radius={idx === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
