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
  MapPin, 
  Calendar, 
  FileText, 
  Printer,
  Clock,
  User,
  AlertCircle,
  Tag
} from "lucide-react"
import { cn } from "@/lib/utils"
import { IncidentTimeline, TimelineEvent } from "@/components/incidents/incident-timeline"
import { PrintBlotterExtract } from "@/components/incidents/print-blotter-extract"

function generateMockTimeline(record: any): TimelineEvent[] {
  if (!record) return []
  const events: TimelineEvent[] = []
  
  const dateReported = record.created_at || new Date().toISOString()
  
  events.push({
    id: "1",
    title: "Complaint Filed",
    description: `Report filed by ${record.complainant_name || 'Citizen'}.`,
    date: dateReported,
    status: "completed",
    type: "filed"
  })

  if (record.status === "Investigating" || record.status === "Resolved") {
    const invDate = new Date(new Date(dateReported).getTime() + 86400000 * 2).toISOString() 
    events.push({
      id: "2",
      title: "Under Investigation",
      description: "Desk officer started review and initial investigation.",
      date: invDate,
      status: record.status === "Investigating" ? "current" : "completed",
      type: "investigated"
    })
  }

  if (record.status === "Resolved") {
    const resDate = new Date(new Date(dateReported).getTime() + 86400000 * 7).toISOString() 
    events.push({
      id: "3",
      title: "Case Resolved",
      description: "Matter has been resolved and closed.",
      date: resDate,
      status: "completed",
      type: "resolved"
    })
  }

  return events
}

export default function IncidentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [record, setRecord] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const { data, error } = await supabase
        .from('blotter_records')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) {
        setRecord(data)
      }
      setLoading(false)
    }
    if (id) loadData()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sinisuri ang Datos...</p>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto opacity-20" />
          <h2 className="text-xl font-bold">Record Not Found</h2>
          <Button onClick={() => router.push('/incidents')}>Back to Incident Records</Button>
        </div>
      </div>
    )
  }

  const recordYear = new Date(record.created_at).getFullYear();
  const formattedId = `BLT-${recordYear}-${record.id.toString().padStart(4, '0')}`;

  const isResolved = record.status === "Resolved"
  const badgeStyle = isResolved 
    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
    : record.status === "Investigating"
    ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
    : "bg-amber-500/10 text-amber-600 border-amber-500/20"

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="flex-1 pl-60">
        <TopHeader />
        <main className="p-8 space-y-8 animate-in fade-in duration-500">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground hover:text-foreground p-0 h-auto hover:bg-transparent"
            onClick={() => router.push('/incidents')}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-bold uppercase tracking-widest text-[10px]">Back to Incident Records</span>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Core Metadata */}
            <div className="space-y-6">
              <Card className="overflow-hidden border-border/60 shadow-sm bg-white">
                <CardHeader className="bg-muted/30 border-b border-border/40 pb-6 relative">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">{formattedId}</span>
                      <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-widest px-3 py-1", badgeStyle)}>
                        {record.status}
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground leading-tight">
                      {record.incident_type}
                    </h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Complainant</p>
                      <p className="text-sm font-bold text-foreground">{record.complainant_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Location</p>
                      <p className="text-sm font-semibold text-foreground leading-snug">{record.location || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date Reported</p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(record.created_at).toLocaleDateString("en-US", { 
                          month: "long", 
                          day: "numeric", 
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/40">
                    <Button 
                      className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px] py-6 shadow-md shadow-primary/20"
                      onClick={() => setPrintDialogOpen(true)}
                    >
                      <Printer className="h-4 w-4" />
                      Print Blotter Extract
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info Card */}
              <Card className="border-border/60 shadow-sm bg-blue-50/30 border-blue-200/50">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-blue-900">Incident Classification</h4>
                    <p className="text-xs text-blue-800/80 leading-relaxed">
                      This case is filed under <strong>{record.incident_type}</strong>. Ensure all narrative details are accurately captured for legal documentation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Col: Narrative & Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Narrative Section */}
              <Card className="border-border/60 shadow-sm overflow-hidden bg-white">
                <CardHeader className="border-b border-border/40 py-4 flex flex-row items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-black uppercase tracking-widest">Incident Narrative</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                    <p className="text-base text-foreground leading-relaxed italic whitespace-pre-wrap pl-2">
                      "{record.narrative || "No narrative provided."}"
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Section */}
              <Card className="border-border/60 shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-border/40 py-4 flex flex-row items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-black uppercase tracking-widest">Case Timeline</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <IncidentTimeline events={generateMockTimeline(record)} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <PrintBlotterExtract 
        open={printDialogOpen} 
        onOpenChange={setPrintDialogOpen} 
        record={{
          id: formattedId,
          dateReported: record.created_at,
          complainant: record.complainant_name,
          incidentType: record.incident_type,
          location: record.location,
          narrative: record.narrative,
          status: record.status
        }} 
      />
    </div>
  )
}
