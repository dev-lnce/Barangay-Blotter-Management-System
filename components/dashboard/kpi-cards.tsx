import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2, AlertTriangle, MapPin, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

const kpiData: any[] = [];

export function KpiCards() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key Performance Indicators">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon
        const TrendIcon = kpi.trendDir === "up" ? TrendingUp : kpi.trendDir === "down" ? TrendingDown : null
        return (
          <Card key={kpi.title} className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground font-sans uppercase tracking-wide">
                {kpi.title}
              </CardTitle>
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", kpi.iconBg)}>
                <Icon className={cn("h-4 w-4", kpi.iconColor)} aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground font-sans">{kpi.value}</p>
              <div className="mt-1 flex items-center gap-1.5">
                {TrendIcon && (
                  <TrendIcon
                    className={cn(
                      "h-3 w-3",
                      kpi.trendDir === "up" ? "text-green-500" : "text-red-500"
                    )}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "text-xs font-medium font-sans",
                    kpi.trendDir === "up"
                      ? "text-green-600"
                      : kpi.trendDir === "down"
                      ? "text-red-500"
                      : "text-muted-foreground"
                  )}
                >
                  {kpi.trend}
                </span>
                <span className="text-xs text-muted-foreground font-sans">{kpi.trendLabel}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
