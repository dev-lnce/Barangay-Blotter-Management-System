"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopHeader } from "@/components/dashboard/top-header"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  FileText, 
  ShieldAlert,
  History,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CitizenProfilePage() {
  const params = useParams()
  const router = useRouter()
  const name = decodeURIComponent(params.id as string)
  const [profile, setProfile] = useState<any>(null)
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const { data, error } = await supabase.from('blotter_records').select('*')
      
      if (data) {
        const userCases = data.filter(r => r.complainant_name === name || r.respondent_name === name)
        setCases(userCases)
        
        if (userCases.length > 0) {
          const first = userCases[0]
          const isComplainant = first.complainant_name === name
          setProfile({
            name,
            age: isComplainant ? first.complainant_age : first.respondent_age,
            gender: isComplainant ? first.complainant_gender : first.respondent_gender,
            address: isComplainant ? first.complainant_address : first.respondent_address,
            contact: isComplainant ? first.complainant_contact : first.respondent_contact,
            respondentCount: userCases.filter(r => r.respondent_name === name).length,
            complainantCount: userCases.filter(r => r.complainant_name === name).length,
          })
        }
      }
      setLoading(false)
    }
    loadData()
  }, [name])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const isHighRisk = profile?.respondentCount > 2

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="flex-1 pl-60">
        <TopHeader />
        <main className="p-8 space-y-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Directory
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Profile Info */}
            <div className="space-y-6">
              <Card className="overflow-hidden border-border/60 shadow-sm">
                <CardHeader className="bg-muted/30 border-b border-border/40 pb-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={cn(
                      "h-24 w-24 rounded-full flex items-center justify-center text-3xl font-black shadow-inner border",
                      isHighRisk ? "bg-destructive/5 text-destructive border-destructive/20" : "bg-primary/5 text-primary border-primary/20"
                    )}>
                      {name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">{name}</h2>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">{profile?.gender} • {profile?.age} YRS</Badge>
                        {isHighRisk && (
                          <Badge variant="destructive" className="text-[10px] uppercase font-bold tracking-widest animate-pulse">High Risk / POI</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Address</p>
                      <p className="text-sm font-sans">{profile?.address || "No address on file"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contact</p>
                      <p className="text-sm font-sans">{profile?.contact || "N/A"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                    <div className="text-center p-3 bg-muted/20 rounded-xl">
                      <p className="text-2xl font-black">{profile?.complainantCount}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Complainant</p>
                    </div>
                    <div className={cn(
                      "text-center p-3 rounded-xl",
                      profile?.respondentCount > 0 ? "bg-destructive/5" : "bg-muted/20"
                    )}>
                      <p className={cn("text-2xl font-black", profile?.respondentCount > 0 && "text-destructive")}>
                        {profile?.respondentCount}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Respondent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm bg-amber-50/30 border-amber-200/50">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-900">Admin Note</h4>
                    <p className="text-xs text-amber-800/80 font-sans leading-relaxed">
                      This profile is automatically compiled from blotter records. Please verify information before taking official action.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Col: Incident History */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                  <History className="h-5 w-5 text-primary" />
                  Blotter History ({cases.length})
                </h3>
              </div>

              <div className="space-y-4">
                {cases.map((c, i) => (
                  <Card key={i} className="border-border/60 shadow-sm hover:border-primary/30 transition-colors group">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className={cn(
                          "w-1.5 shrink-0",
                          c.complainant_name === name ? "bg-success" : "bg-danger"
                        )} />
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                  "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                                  c.complainant_name === name ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                                )}>
                                  {c.complainant_name === name ? "Complainant" : "Respondent"}
                                </span>
                                <span className="text-[10px] font-sans font-bold text-muted-foreground">CASE ID: BLT-{new Date(c.created_at).getFullYear()}-{c.id}</span>
                              </div>
                              <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{c.incident_type}</h4>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-foreground">
                                {new Date(c.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                              </p>
                              <Badge variant="outline" className="mt-1 bg-white">{c.status}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground font-sans line-clamp-2 italic mb-4">
                            "{c.narrative || "No narrative provided."}"
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-border/40 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {c.location || "N/A"}</span>
                            <Button variant="link" size="sm" className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-primary">
                              View Record Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {cases.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-2xl bg-muted/5">
                    <FileText className="h-10 w-10 mb-3 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest opacity-40">No records found for this citizen.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
