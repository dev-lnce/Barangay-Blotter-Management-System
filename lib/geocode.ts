/**
 * Geocode an address string to latitude/longitude using OpenStreetMap Nominatim.
 * Biases results toward the Banay-banay, Philippines region.
 *
 * ⚠️ Nominatim usage policy limits requests to 1/second.
 * This is fine for single form submissions.
 */
export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  if (!address || address.trim().length === 0) return null

  // Append regional context for better results
  const fullQuery = `${address.trim()}, Banay-banay, Philippines`

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        fullQuery,
      )}&format=json&limit=1`,
      {
        headers: {
          // Nominatim requires a valid User-Agent per their usage policy
          "User-Agent": "BarangayBlotterSystem/1.0",
        },
      },
    )

    if (!res.ok) return null

    const results = await res.json()

    if (results && results.length > 0) {
      return {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon),
      }
    }

    return null
  } catch (error) {
    console.error("Geocoding failed:", error)
    return null
  }
}
