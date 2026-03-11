"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Sidebar } from "@/components/dashboard/sidebar"
import { HeatmapControls } from "@/components/heatmap/heatmap-controls"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import type { IncidentPoint } from "@/lib/dbscan"

/* Dynamically import the Leaflet map (SSR-unsafe — needs `window`) */
const MapCanvas = dynamic(
  () =>
    import("@/components/heatmap/map-canvas").then((mod) => mod.MapCanvas),
  { ssr: false, loading: () => <MapSkeleton /> },
)

function MapSkeleton() {
  return (
    <div className="flex-1 h-full rounded-xl border border-border bg-secondary/30 flex items-center justify-center">
      <p className="text-sm text-muted-foreground font-sans animate-pulse">
        Loading map…
      </p>
    </div>
  )
}

export default function HeatmapPage() {
  const [severities, setSeverities] = useState({
    high: true,
    medium: true,
    low: true,
  })
  const [clusteringEnabled, setClusteringEnabled] = useState(true)
  const [incidents, setIncidents] = useState<IncidentPoint[]>([])
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({
    start: undefined,
    end: undefined,
  })

  const handleSeverityChange = (severity: string, checked: boolean) => {
    setSeverities((prev) => ({ ...prev, [severity]: checked }))
  }

  const handleDateChange = (start?: Date, end?: Date) => {
    setDateRange({ start, end })
  }

  useEffect(() => {
    async function fetchIncidents() {
      const supabase = createSupabaseBrowser()
      let query = supabase
        .from("incidents")
        .select(
          "id, blotter_number, category, severity, latitude, longitude, created_at",
        )
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .order("created_at", { ascending: false })

      if (dateRange.start) {
        query = query.gte("created_at", dateRange.start.toISOString())
      }
      if (dateRange.end) {
        query = query.lte("created_at", dateRange.end.toISOString())
      }

      const { data } = await query

      if (data) {
        setIncidents(
          data.map((inc) => ({
            id: inc.blotter_number || inc.id,
            lat: inc.latitude as number,
            lng: inc.longitude as number,
            category: inc.category,
            severity: inc.severity as "high" | "medium" | "low",
          })),
        )
      }
    }
    fetchIncidents()
  }, [dateRange])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-60">
        {/* Page Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
          <div>
            <h1 className="text-base font-semibold text-foreground font-sans">
              Interactive Heat Map
            </h1>
            <p className="text-xs text-muted-foreground font-sans">
              Visualize incident hotspots across Brgy. Banay-Banay 2nd
            </p>
          </div>
        </header>

        {/* Content: Control Panel + Map */}
        <div className="flex h-[calc(100vh-3.5rem)]">
          {/* Left Control Panel - 25% */}
          <aside className="w-[25%] border-r border-border bg-card/50 overflow-hidden">
            <HeatmapControls
              severities={severities}
              onSeverityChange={handleSeverityChange}
              clusteringEnabled={clusteringEnabled}
              onClusterToggle={setClusteringEnabled}
              onDateChange={handleDateChange}
            />
          </aside>

          {/* Map Area - 75% */}
          <section className="w-[75%] p-4">
            <MapCanvas
              severities={severities}
              clusteringEnabled={clusteringEnabled}
              incidents={incidents}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
