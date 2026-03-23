"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Map } from "lucide-react"
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import type { IncidentPoint } from "@/lib/dbscan"

/* Dynamically load the Leaflet map — only on the client */
const MapCanvas = dynamic(
  () =>
    import("@/components/heatmap/map-canvas").then((mod) => mod.MapCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center rounded-lg bg-muted/60 border border-dashed border-border"
        style={{ height: 260 }}
      >
        <p className="text-sm text-muted-foreground font-sans animate-pulse">
          Loading map…
        </p>
      </div>
    ),
  },
)

export function HeatMapPlaceholder() {
  const [incidents, setIncidents] = useState<IncidentPoint[]>([])

  const fetchIncidents = async () => {
    const supabase = createSupabaseBrowser()
    const { data } = await supabase
      .from("blotter_records")
      .select("id, incident_type, latitude, longitude")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .order("created_at", { ascending: false })
      .limit(200)

    if (data) {
      setIncidents(
        data.map((inc) => {
          let severity: "high" | "medium" | "low" = "low"
          const type = inc.incident_type || ""
          if (["Physical Assault", "Theft", "Fraud", "Domestic Dispute"].includes(type)) severity = "high"
          else if (["Property Damage", "Trespassing", "Verbal Abuse"].includes(type)) severity = "medium"

          return {
            id: inc.id.toString(),
            lat: inc.latitude as number,
            lng: inc.longitude as number,
            category: type,
            severity,
          }
        }),
      )
    }
  }

  useEffect(() => {
    fetchIncidents()

    // Subscribe to realtime changes on the incidents table
    const supabase = createSupabaseBrowser()
    const channel = supabase
      .channel("heatmap-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "blotter_records" },
        () => fetchIncidents(),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "blotter_records" },
        () => fetchIncidents(),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <Link href="/heatmap" className="block h-full">
      <Card className="shadow-sm border-border h-full hover:border-primary/40 transition-colors cursor-pointer">
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
          <div className="rounded-lg overflow-hidden" style={{ height: 260 }}>
            <MapCanvas
              severities={{ high: true, medium: true, low: true }}
              clusteringEnabled={true}
              incidents={incidents}
              preview
            />
          </div>

          {/* Link hint at bottom */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-sans">
            <Map className="h-3.5 w-3.5" />
            Open full heat map
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
