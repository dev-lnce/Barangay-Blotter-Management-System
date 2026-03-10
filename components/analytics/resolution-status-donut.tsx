"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const statusData: any[] = [];

const total = statusData.reduce((sum, d) => sum + d.value, 0)

export function ResolutionStatusDonut() {
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
                  `${value} cases (${((value / total) * 100).toFixed(1)}%)`,
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
                  ({((item.value / total) * 100).toFixed(0)}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
