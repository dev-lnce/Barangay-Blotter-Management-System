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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { getMonthlyTrendsByCategory } from "@/lib/analytics-queries"

export function MonthlyTrendsChart() {
  const [monthlyData, setMonthlyData] = useState<Record<string, string | number>[]>([])
  const [categories, setCategories] = useState<{ key: string; label: string; color: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const result = await getMonthlyTrendsByCategory()
      setMonthlyData(result.monthlyData)
      setCategories(result.categories)
      setLoading(false)
    }
    load()
  }, [])

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
        {loading ? (
          <Skeleton className="w-full h-[320px] rounded-lg" />
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
