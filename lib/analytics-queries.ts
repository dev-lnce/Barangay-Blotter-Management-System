import { createSupabaseBrowser } from './supabase-browser'

/**
 * Monthly Incident Trends by Category — stacked bar chart data
 */
export async function getMonthlyTrendsByCategory() {
  const supabase = createSupabaseBrowser()
  const { data: incidents } = await supabase
    .from('incidents')
    .select('category, created_at')
    .order('created_at', { ascending: true })

  if (!incidents || incidents.length === 0) {
    return { monthlyData: [], categories: [] }
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const categoryColors: Record<string, string> = {
    Theft: 'oklch(0.45 0.18 255)',
    'Noise Disturbance': 'oklch(0.62 0.15 200)',
    Vandalism: 'oklch(0.72 0.17 160)',
    Assault: 'oklch(0.65 0.22 30)',
    Trespassing: 'oklch(0.8 0.16 85)',
    Dispute: 'oklch(0.55 0.18 255)',
    Other: 'oklch(0.52 0.025 255)',
  }

  // Collect unique categories
  const uniqueCategories = [...new Set(incidents.map(i => i.category))]

  // Build monthly data
  const monthlyData = months.map(month => {
    const monthIndex = months.indexOf(month)
    const row: Record<string, string | number> = { month }
    uniqueCategories.forEach(cat => {
      row[cat] = incidents.filter(i => {
        const d = new Date(i.created_at)
        return d.getMonth() === monthIndex && i.category === cat
      }).length
    })
    return row
  })

  const categories = uniqueCategories.map(cat => ({
    key: cat,
    label: cat,
    color: categoryColors[cat] || 'oklch(0.52 0.025 255)',
  }))

  return { monthlyData, categories }
}

/**
 * Average Case Resolution Time — line chart data
 */
export async function getResolutionDuration() {
  const supabase = createSupabaseBrowser()
  const { data: incidents } = await supabase
    .from('incidents')
    .select('created_at, resolved_at')
    .not('resolved_at', 'is', null)
    .order('created_at', { ascending: true })

  if (!incidents || incidents.length === 0) {
    return []
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Group by month and calculate average resolution days
  const monthGroups: Record<number, number[]> = {}
  incidents.forEach(i => {
    const month = new Date(i.created_at).getMonth()
    const days = Math.ceil(
      (new Date(i.resolved_at).getTime() - new Date(i.created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (!monthGroups[month]) monthGroups[month] = []
    monthGroups[month].push(days)
  })

  return Object.entries(monthGroups).map(([monthIdx, days]) => ({
    month: months[parseInt(monthIdx)],
    avgDays: parseFloat((days.reduce((a, b) => a + b, 0) / days.length).toFixed(1)),
  }))
}

/**
 * Resolution Status Breakdown — donut chart data
 */
export async function getResolutionStatusBreakdown() {
  const supabase = createSupabaseBrowser()
  const { data: incidents } = await supabase
    .from('incidents')
    .select('status')

  if (!incidents || incidents.length === 0) {
    return []
  }

  const statusMap: Record<string, { name: string; color: string }> = {
    'Amicably Settled': { name: 'Amicably Settled', color: 'oklch(0.6 0.16 155)' },
    'Escalated to Police': { name: 'Escalated to Police', color: 'oklch(0.577 0.245 27.325)' },
    'Dismissed': { name: 'Dismissed', color: 'oklch(0.52 0.025 255)' },
    'Pending': { name: 'Pending', color: 'oklch(0.78 0.18 75)' },
    'Under Investigation': { name: 'Under Investigation', color: 'oklch(0.62 0.15 200)' },
  }

  const counts: Record<string, number> = {}
  incidents.forEach(i => {
    counts[i.status] = (counts[i.status] || 0) + 1
  })

  return Object.entries(counts).map(([status, count]) => ({
    name: statusMap[status]?.name || status,
    value: count,
    color: statusMap[status]?.color || 'oklch(0.52 0.025 255)',
  }))
}

/**
 * Location / Zone Correlation — horizontal bar chart data
 */
export async function getLocationCorrelation() {
  const supabase = createSupabaseBrowser()
  const { data: incidents } = await supabase
    .from('incidents')
    .select('zone')
    .not('zone', 'is', null)

  if (!incidents || incidents.length === 0) {
    return []
  }

  const counts: Record<string, number> = {}
  incidents.forEach(i => {
    if (i.zone) {
      counts[i.zone] = (counts[i.zone] || 0) + 1
    }
  })

  const sorted = Object.entries(counts)
    .map(([zone, count]) => ({
      zone,
      incidents: count,
      severity: count >= 50 ? 'high' : count >= 25 ? 'medium' : 'low',
    }))
    .sort((a, b) => b.incidents - a.incidents)

  return sorted
}
