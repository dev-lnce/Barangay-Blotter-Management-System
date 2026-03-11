import { DBSCAN } from "density-clustering"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface IncidentPoint {
  id: string
  lat: number
  lng: number
  category: string
  severity: "high" | "medium" | "low"
}

export type RiskLevel = "high" | "medium" | "low"

export interface HotspotCluster {
  id: string
  centroidLat: number
  centroidLng: number
  radius: number          // in degrees — used for the overlay circle
  count: number
  risk: RiskLevel
  points: IncidentPoint[]
  breakdown: { category: string; count: number }[]
}

export interface DBSCANResult {
  clusters: HotspotCluster[]
  noise: IncidentPoint[]
}

/* ------------------------------------------------------------------ */
/*  DBSCAN runner                                                      */
/* ------------------------------------------------------------------ */

/**
 * Run DBSCAN on a set of incident points.
 *
 * @param points  Array of lat/lng incident points
 * @param eps     Neighbourhood radius in **degrees** (default 0.008 ≈ 880 m)
 * @param minPts  Minimum cluster size (default 2)
 */
export function runDBSCAN(
  points: IncidentPoint[],
  eps = 0.008,
  minPts = 2,
): DBSCANResult {
  if (points.length === 0) return { clusters: [], noise: [] }

  const dataset = points.map((p) => [p.lat, p.lng])

  const dbscan = new DBSCAN()
  const clusterIndices = dbscan.run(dataset, eps, minPts)
  const noiseIndices: number[] = dbscan.noise

  /* --- build Cluster objects ------------------------------------ */
  const clusters: HotspotCluster[] = clusterIndices.map((memberIndices, i) => {
    const members = memberIndices.map((idx) => points[idx])

    // Centroid
    const centroidLat =
      members.reduce((s, p) => s + p.lat, 0) / members.length
    const centroidLng =
      members.reduce((s, p) => s + p.lng, 0) / members.length

    // Radius = max distance from centroid (clamped to a minimum for visibility)
    const radius = Math.max(
      0.0005,
      ...members.map((p) =>
        Math.sqrt(
          (p.lat - centroidLat) ** 2 + (p.lng - centroidLng) ** 2,
        ),
      ),
    )

    // Category breakdown
    const countByCategory: Record<string, number> = {}
    members.forEach((m) => {
      countByCategory[m.category] = (countByCategory[m.category] || 0) + 1
    })
    const breakdown = Object.entries(countByCategory)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    // Risk level
    const risk: RiskLevel =
      members.length >= 7 ? "high" : members.length >= 4 ? "medium" : "low"

    return {
      id: `CLUSTER-${i}`,
      centroidLat,
      centroidLng,
      radius,
      count: members.length,
      risk,
      points: members,
      breakdown,
    }
  })

  /* --- noise points --------------------------------------------- */
  const noise = noiseIndices.map((idx) => points[idx])

  return { clusters, noise }
}