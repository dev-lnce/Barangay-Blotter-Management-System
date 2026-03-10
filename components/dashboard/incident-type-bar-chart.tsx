"use client"

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

const incidentTypes = [
  { type: "Theft", count: 214 },
  { type: "Noise", count: 183 },
  { type: "Vandalism", count: 97 },
  { type: "Assault", count: 76 },
  { type: "Trespassing", count: 54 },
  { type: "Others", count: 42 },
]

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-muted-foreground)",
]

export function IncidentTypeBarChart() {
  return (
    <Card className="shadow-sm border-border w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold text-foreground font-sans">
          Types of Reports Received
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
          Breakdown by incident category
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={incidentTypes} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="type"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
              axisLine={false}
              tickLine={false}
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
              cursor={{ fill: "var(--color-muted)", opacity: 0.5 }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Reports">
              {incidentTypes.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
