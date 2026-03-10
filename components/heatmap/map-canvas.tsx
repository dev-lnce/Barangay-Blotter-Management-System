"use client"

import { useState } from "react"
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Incident {
  id: string
  x: number
  y: number
  severity: "high" | "medium" | "low"
  type: string
}

interface Cluster {
  id: string
  x: number
  y: number
  count: number
  incidents: { type: string; count: number }[]
}

interface MapCanvasProps {
  severities: { high: boolean; medium: boolean; low: boolean }
  clusteringEnabled: boolean
  incidents?: Incident[]
}

const severityColors = {
  high: "bg-[oklch(0.577_0.245_27.325)]",
  medium: "bg-[oklch(0.78_0.18_75)]",
  low: "bg-[oklch(0.6_0.16_155)]",
}

const severityRingColors = {
  high: "ring-[oklch(0.577_0.245_27.325)]/40",
  medium: "ring-[oklch(0.78_0.18_75)]/40",
  low: "ring-[oklch(0.6_0.16_155)]/40",
}

function buildClusters(incidents: Incident[]): Cluster[] {
  // Simple grid-based clustering
  const gridSize = 15 // % of canvas
  const grid: Record<string, Incident[]> = {}

  incidents.forEach(inc => {
    const gx = Math.floor(inc.x / gridSize)
    const gy = Math.floor(inc.y / gridSize)
    const key = `${gx}-${gy}`
    if (!grid[key]) grid[key] = []
    grid[key].push(inc)
  })

  return Object.entries(grid)
    .filter(([, items]) => items.length >= 2)
    .map(([key, items], idx) => {
      const avgX = items.reduce((s, i) => s + i.x, 0) / items.length
      const avgY = items.reduce((s, i) => s + i.y, 0) / items.length
      const typeCounts: Record<string, number> = {}
      items.forEach(i => { typeCounts[i.type] = (typeCounts[i.type] || 0) + 1 })

      return {
        id: `CLUSTER-${idx}`,
        x: avgX,
        y: avgY,
        count: items.length,
        incidents: Object.entries(typeCounts).map(([type, count]) => ({ type, count })),
      }
    })
}

export function MapCanvas({ severities, clusteringEnabled, incidents = [] }: MapCanvasProps) {
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  const filteredIncidents = incidents.filter(
    (incident) => severities[incident.severity]
  )

  const clusters = buildClusters(filteredIncidents)

  return (
    <div className="relative flex-1 h-full bg-secondary/30 rounded-xl border border-border overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-border">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground font-sans">
          Brgy. Banay-Banay 2nd
        </span>
        <span className="text-xs text-muted-foreground font-sans ml-1">
          Incident Zones
        </span>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 shadow-sm"
          onClick={() => setZoom((z) => Math.min(z + 0.25, 2))}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 shadow-sm"
          onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Background with Grid */}
      <div
        className="absolute inset-0"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
      >
        {/* Light themed map placeholder background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-secondary/30" />
        
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Zone labels */}
        <div className="absolute top-[20%] left-[10%] text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider font-sans">
          Zone 1 - Purok Sampaguita
        </div>
        <div className="absolute top-[15%] right-[15%] text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider font-sans">
          Zone 2 - Purok Rosal
        </div>
        <div className="absolute bottom-[30%] left-[15%] text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider font-sans">
          Zone 3 - Purok Ilang-Ilang
        </div>
        <div className="absolute bottom-[20%] right-[20%] text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider font-sans">
          Zone 4 - Purok Gumamela
        </div>

        {/* Single Incident Markers */}
        {!clusteringEnabled &&
          filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className={cn(
                "absolute h-3 w-3 rounded-full ring-4 transition-all duration-200 hover:scale-125 cursor-pointer",
                severityColors[incident.severity],
                severityRingColors[incident.severity]
              )}
              style={{
                left: `${incident.x}%`,
                top: `${incident.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              title={`${incident.id}: ${incident.type}`}
            />
          ))}

        {/* Cluster Markers */}
        {clusteringEnabled &&
          clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="absolute"
              style={{
                left: `${cluster.x}%`,
                top: `${cluster.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredCluster(cluster.id)}
              onMouseLeave={() => setHoveredCluster(null)}
            >
              {/* Cluster circle */}
              <div
                className={cn(
                  "flex items-center justify-center rounded-full cursor-pointer transition-all duration-200",
                  cluster.count >= 10
                    ? "h-14 w-14 bg-[oklch(0.577_0.245_27.325)]/35 border-2 border-[oklch(0.577_0.245_27.325)]"
                    : cluster.count >= 5
                    ? "h-11 w-11 bg-[oklch(0.65_0.22_30)]/35 border-2 border-[oklch(0.65_0.22_30)]"
                    : "h-9 w-9 bg-[oklch(0.78_0.18_75)]/35 border-2 border-[oklch(0.78_0.18_75)]",
                  hoveredCluster === cluster.id && "scale-110"
                )}
              >
                <span
                  className={cn(
                    "font-bold font-sans",
                    cluster.count >= 10
                      ? "text-sm text-[oklch(0.35_0.2_27)]"
                      : cluster.count >= 5
                      ? "text-xs text-[oklch(0.35_0.15_30)]"
                      : "text-xs text-[oklch(0.4_0.12_75)]"
                  )}
                >
                  {cluster.count}
                </span>
              </div>

              {/* Tooltip */}
              {hoveredCluster === cluster.id && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-20 w-44 bg-card rounded-lg shadow-lg border border-border p-3 animate-in fade-in-0 zoom-in-95 duration-150">
                  <p className="text-xs font-semibold text-foreground font-sans mb-2">
                    Cluster Breakdown
                  </p>
                  <div className="space-y-1.5">
                    {cluster.incidents.map((inc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs font-sans"
                      >
                        <span className="text-muted-foreground">{inc.type}</span>
                        <span className="font-medium text-foreground">
                          {inc.count}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-xs font-sans">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold text-primary">
                      {cluster.count}
                    </span>
                  </div>
                  {/* Arrow */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-card border-r border-b border-border rotate-45 -mt-1" />
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-card/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-sans">
          <span>
            Showing:{" "}
            <span className="font-medium text-foreground">
              {clusteringEnabled
                ? `${clusters.length} clusters`
                : `${filteredIncidents.length} incidents`}
            </span>
          </span>
          <span className="text-border">|</span>
          <span>
            Zoom:{" "}
            <span className="font-medium text-foreground">
              {Math.round(zoom * 100)}%
            </span>
          </span>
        </div>
        <div className="text-xs text-muted-foreground font-sans">
          Last updated: Mar 10, 2026
        </div>
      </div>
    </div>
  )
}