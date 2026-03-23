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

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          "User-Agent": "BarangayBlotterSystem/1.0",
        },
      }
    )

    if (!res.ok) return null

    const result = await res.json()
    if (result && result.display_name) {
      // Return a shorter version of the address
      const parts = result.display_name.split(",")
      // Usually: House Number, Road, Village, City, Province
      return parts.slice(0, 3).join(",")
    }

    return null
  } catch (error) {
    console.error("Reverse geocoding failed:", error)
    return null
  }
}
