"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { HeatmapControls } from "@/components/heatmap/heatmap-controls"
import { MapCanvas } from "@/components/heatmap/map-canvas"

export default function HeatmapPage() {
  const [severities, setSeverities] = useState({
    high: true,
    medium: true,
    low: true,
  })
  const [clusteringEnabled, setClusteringEnabled] = useState(false)

  const handleSeverityChange = (severity: string, checked: boolean) => {
    setSeverities((prev) => ({ ...prev, [severity]: checked }))
  }

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
            />
          </aside>

          {/* Map Area - 75% */}
          <section className="w-[75%] p-4">
            <MapCanvas
              severities={severities}
              clusteringEnabled={clusteringEnabled}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
