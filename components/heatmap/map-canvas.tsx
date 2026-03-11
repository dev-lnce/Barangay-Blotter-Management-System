"use client"

import { useEffect, useRef, useState } from "react"
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Marker,
  Popup,
  useMap,
} from "react-leaflet"
import L from "leaflet"
import { MapPin } from "lucide-react"
import {
  runDBSCAN,
  type IncidentPoint,
  type HotspotCluster,
  type RiskLevel,
} from "@/lib/dbscan"

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CENTER: [number, number] = [13.882, 121.107]
const DEFAULT_ZOOM = 15

const RISK_COLORS: Record<RiskLevel, string> = {
  high: "#ef4444",   // red-500
  medium: "#f59e0b", // amber-500
  low: "#22c55e",    // green-500
}

const RISK_FILLS: Record<RiskLevel, string> = {
  high: "rgba(239,68,68,0.18)",
  medium: "rgba(245,158,11,0.18)",
  low: "rgba(34,197,94,0.18)",
}

const SEVERITY_COLORS: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
}

/* ------------------------------------------------------------------ */
/*  Helper: cluster label DivIcon                                      */
/* ------------------------------------------------------------------ */

function clusterIcon(cluster: HotspotCluster) {
  const size = cluster.count >= 7 ? 44 : cluster.count >= 4 ? 36 : 28
  const bg = RISK_COLORS[cluster.risk]

  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
      <div style="
        width:${size}px;height:${size}px;
        display:flex;align-items:center;justify-content:center;
        border-radius:50%;
        background:${bg}22;
        border:2px solid ${bg};
        color:${bg};
        font-weight:700;font-size:${size > 36 ? 14 : 12}px;
        font-family:var(--font-sans),system-ui,sans-serif;
        box-shadow:0 0 12px ${bg}44;
      ">${cluster.count}</div>
    `,
  })
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Fit bounds on data change                           */
/* ------------------------------------------------------------------ */

function FitBounds({ points }: { points: { lat: number; lng: number }[] }) {
  const map = useMap()
  const first = useRef(true)

  useEffect(() => {
    if (first.current && points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 })
      first.current = false
    }
  }, [points, map])

  return null
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface MapCanvasProps {
  severities: { high: boolean; medium: boolean; low: boolean }
  clusteringEnabled: boolean
  incidents?: IncidentPoint[]
  /** If true, render a compact non-interactive preview */
  preview?: boolean
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MapCanvas({
  severities,
  clusteringEnabled,
  incidents = [],
  preview = false,
}: MapCanvasProps) {
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null)

  /* --- filter by severity -------------------------------------- */
  const filtered = incidents.filter((i) => severities[i.severity])

  /* --- DBSCAN -------------------------------------------------- */
  const { clusters, noise } = clusteringEnabled
    ? runDBSCAN(filtered)
    : { clusters: [] as HotspotCluster[], noise: filtered }

  /* --- circle radius in meters --------------------------------- */
  const circleRadius = (cluster: HotspotCluster) =>
    Math.max(60, cluster.radius * 111_000) // degrees → approx metres

  return (
    <div className="relative flex-1 h-full rounded-xl border border-border overflow-hidden">
      {/* Location Badge (full mode only) */}
      {!preview && (
        <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-border">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground font-sans">
            Brgy. Banay-Banay 2nd
          </span>
          <span className="text-xs text-muted-foreground font-sans ml-1">
            Incident Zones
          </span>
        </div>
      )}

      {/* -------- Leaflet Map -------- */}
      <MapContainer
        center={CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={!preview}
        dragging={!preview}
        scrollWheelZoom={!preview}
        doubleClickZoom={!preview}
        touchZoom={!preview}
        attributionControl={false}
        className="h-full w-full"
        style={{ background: "var(--background)" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <FitBounds points={filtered} />

        {/* ---- Cluster hotspot circles ---- */}
        {clusteringEnabled &&
          clusters.map((cluster) => (
            <Circle
              key={cluster.id}
              center={[cluster.centroidLat, cluster.centroidLng]}
              radius={circleRadius(cluster)}
              pathOptions={{
                color: RISK_COLORS[cluster.risk],
                fillColor: RISK_FILLS[cluster.risk],
                fillOpacity: 0.45,
                weight: 2,
              }}
            >
              {/* Label marker in the center */}
              <Marker
                position={[cluster.centroidLat, cluster.centroidLng]}
                icon={clusterIcon(cluster)}
                eventHandlers={{
                  mouseover: () => setHoveredCluster(cluster.id),
                  mouseout: () => setHoveredCluster(null),
                }}
              >
                <Popup className="font-sans" maxWidth={220}>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold">
                      Hotspot — {cluster.risk.charAt(0).toUpperCase() + cluster.risk.slice(1)} Risk
                    </p>
                    {cluster.breakdown.map((b) => (
                      <div
                        key={b.category}
                        className="flex justify-between text-xs"
                      >
                        <span className="text-muted-foreground">
                          {b.category}
                        </span>
                        <span className="font-medium">{b.count}</span>
                      </div>
                    ))}
                    <div className="border-t pt-1 flex justify-between text-xs font-semibold">
                      <span>Total</span>
                      <span>{cluster.count}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </Circle>
          ))}

        {/* ---- Noise / individual markers ---- */}
        {(clusteringEnabled ? noise : filtered).map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={preview ? 4 : 6}
            pathOptions={{
              color: SEVERITY_COLORS[point.severity] || "#22c55e",
              fillColor: SEVERITY_COLORS[point.severity] || "#22c55e",
              fillOpacity: 0.7,
              weight: 1,
            }}
          >
            {!preview && (
              <Popup className="font-sans" maxWidth={200}>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold">{point.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {point.category}
                  </p>
                  <p className="text-xs capitalize">
                    Severity:{" "}
                    <span
                      style={{ color: SEVERITY_COLORS[point.severity] }}
                      className="font-medium"
                    >
                      {point.severity}
                    </span>
                  </p>
                </div>
              </Popup>
            )}
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Status Bar (full mode only) */}
      {!preview && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] flex items-center justify-between bg-card/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-sans">
            <span>
              Showing:{" "}
              <span className="font-medium text-foreground">
                {clusteringEnabled
                  ? `${clusters.length} hotspot${clusters.length !== 1 ? "s" : ""}, ${noise.length} isolated`
                  : `${filtered.length} incidents`}
              </span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-sans">
            DBSCAN: {clusteringEnabled ? "On" : "Off"}
          </div>
        </div>
      )}
    </div>
  )
}