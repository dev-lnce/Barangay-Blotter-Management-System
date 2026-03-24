"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { PageHeader } from "@/components/dashboard/page-header"
import { CitizenProfileCard } from "@/components/users/citizen-profile-card"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Search, Users, Filter, UserX } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export default function CitizensPage() {
  const router = useRouter()
  const [citizens, setCitizens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    async function getCitizens() {
      setLoading(true)
      const { data, error } = await supabase.from('blotter_records').select('*')
      
      if (data) {
        const citizensMap: Record<string, any> = {}

        data.forEach(record => {
          // Process Complainant
          if (record.complainant_name) {
            const name = record.complainant_name
            if (!citizensMap[name]) {
              citizensMap[name] = { 
                name, 
                age: record.complainant_age, 
                gender: record.complainant_gender,
                complainantCount: 0,
                respondentCount: 0,
                cases: []
              }
            }
            citizensMap[name].complainantCount++
            citizensMap[name].cases.push({ id: record.id, type: record.incident_type, date: record.created_at, role: 'Complainant' })
          }

          // Process Respondent
          if (record.respondent_name) {
            const name = record.respondent_name
            if (!citizensMap[name]) {
              citizensMap[name] = { 
                name, 
                age: record.respondent_age, 
                gender: record.respondent_gender,
                complainantCount: 0,
                respondentCount: 0,
                cases: []
              }
            }
            citizensMap[name].respondentCount++
            citizensMap[name].cases.push({ id: record.id, type: record.incident_type, date: record.created_at, role: 'Respondent' })
          }
        })

        setCitizens(Object.values(citizensMap))
      }
      setLoading(false)
    }

    getCitizens()
  }, [])

  const filteredCitizens = citizens.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const isMinor = c.age && c.age < 18
    const isPoi = c.respondentCount > 2

    if (filter === "minor") return matchesSearch && isMinor
    if (filter === "poi") return matchesSearch && isPoi
    return matchesSearch
  })

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-60">
        <PageHeader title="Citizen Profiles" subtitle="Mga Tao Database" />
        <main className="flex-1 p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <h1 className="text-3xl font-black text-foreground font-sans tracking-tight">Direktoryo ng mga Tao</h1>
              <p className="text-[10px] font-sans text-muted-foreground uppercase tracking-[0.2em] mt-2 font-bold flex items-center gap-2">
                <Users className="h-3 w-3" />
                {citizens.length} Mga Profiling na Naitala
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Hanapin sa pangalan..." 
                  className="pl-9 h-10 text-sm font-sans bg-white border-border/60"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-40 h-10 text-sm font-sans bg-white border-border/60">
                   <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Filter" />
                   </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Lahat</SelectItem>
                  <SelectItem value="minor">Minors (Ages &lt; 18)</SelectItem>
                  <SelectItem value="poi">POI (High Frequency)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground font-sans">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest">Sinisuri ang Datos...</p>
              </div>
            </div>
          ) : filteredCitizens.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-muted/5">
              <UserX className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest opacity-40">Walang Nakitang Rekord</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCitizens.map((citizen, idx) => (
                <CitizenProfileCard 
                  key={idx}
                  {...citizen}
                  onViewDetails={() => router.push(`/citizens/${encodeURIComponent(citizen.name)}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
