import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Map } from "lucide-react"

export function HeatMapPlaceholder() {
  return (
    <Card className="shadow-sm border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground font-sans">
              Heat Map Overview
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
              Geographic incident concentration
            </CardDescription>
          </div>
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary font-sans">
            Live
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
            className="relative overflow-hidden flex flex-col items-center justify-center gap-3 rounded-lg bg-muted/60 border border-dashed border-border"
            style={{ height: 260 }}
            role="img"
            aria-label="Interactive heat map loading"
          >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border border-border">
            <Map className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground font-sans">
              Interactive Heat Map Loading...
            </p>
            <p className="text-xs text-muted-foreground/60 font-sans mt-1">
              Geographic incident filtering will appear here
            </p>
          </div>
          {/* fake grid lines to mimic a map */}
          <div className="absolute inset-0 rounded-lg opacity-10 pointer-events-none" aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
