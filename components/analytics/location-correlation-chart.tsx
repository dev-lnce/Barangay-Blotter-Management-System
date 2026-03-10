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
  Cell,
} from "recharts"

const locationData: any[] = [];

const severityColors: Record<string, string> = {
  high: "var(--color-chart-5)",
  medium: "var(--color-chart-4)",
  low: "var(--color-chart-2)",
}

export function LocationCorrelationChart() {
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground font-sans">
              Incidents by Location / Zone
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
              Housing types and zones correlated with incident frequency
            </CardDescription>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] font-sans">
            {Object.entries(severityColors).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="capitalize text-muted-foreground">{label} density</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={locationData}
            layout="vertical"
            margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Number of Incidents",
                position: "bottom",
                offset: -4,
                style: { fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" },
              }}
            />
            <YAxis
              type="category"
              dataKey="zone"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-sans)" }}
              axisLine={false}
              tickLine={false}
              width={180}
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
              formatter={(value: number) => [`${value} incidents`, "Count"]}
              cursor={{ fill: "var(--color-muted)", opacity: 0.2 }}
            />
            <Bar dataKey="incidents" radius={[0, 4, 4, 0]} barSize={20}>
              {locationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={severityColors[entry.severity]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
