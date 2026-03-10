"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { HeatmapControls } from "@/components/heatmap/heatmap-controls"
import { MapCanvas } from "@/components/heatmap/map-canvas"
import { createSupabaseBrowser } from "@/lib/supabase-browser"

interface Incident {
  id: string
  x: number
  y: number
  severity: "high" | "medium" | "low"
  type: string
}

// Zone coordinate mapping — maps zone names to approximate x,y percentages on the map
const zoneCoords: Record<string, { baseX: number; baseY: number }> = {
  'Zone 1 – Purok Sampaguita': { baseX: 20, baseY: 25 },
  'Zone 2 – Purok Rosal': { baseX: 75, baseY: 18 },
  'Zone 3 – Purok Ilang-Ilang': { baseX: 25, baseY: 70 },
  'Zone 4 – Purok Gumamela': { baseX: 65, baseY: 75 },
  'Zone 5 – Market Area': { baseX: 50, baseY: 45 },
}

export default function HeatmapPage() {
  const [severities, setSeverities] = useState({
    high: true,
    medium: true,
    low: true,
  })
  const [clusteringEnabled, setClusteringEnabled] = useState(false)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({
    start: new Date(2026, 2, 1),
    end: new Date(2026, 2, 10),
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
        .from('incidents')
        .select('id, blotter_number, category, severity, zone, latitude, longitude, created_at')
        .order('created_at', { ascending: false })

      if (dateRange.start) {
        query = query.gte('created_at', dateRange.start.toISOString())
      }
      if (dateRange.end) {
        query = query.lte('created_at', dateRange.end.toISOString())
      }

      const { data } = await query

      if (data) {
        setIncidents(data.map((inc, idx) => {
          // Use latitude/longitude if available, otherwise map from zone
          let x = 50, y = 50
          if (inc.latitude && inc.longitude) {
            // Map lat/lng to percentage coordinates
            // Approximate mapping for the barangay area
            x = ((inc.longitude - 120.93) / 0.02) * 100
            y = ((14.34 - inc.latitude) / 0.02) * 100
            x = Math.max(5, Math.min(95, x))
            y = Math.max(5, Math.min(95, y))
          } else if (inc.zone && zoneCoords[inc.zone]) {
            const base = zoneCoords[inc.zone]
            // Add slight random offset so markers don't stack
            x = base.baseX + (idx % 5) * 3 - 6
            y = base.baseY + (idx % 3) * 4 - 4
          }

          return {
            id: inc.blotter_number || inc.id,
            x,
            y,
            severity: inc.severity as "high" | "medium" | "low",
            type: inc.category,
          }
        }))
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
