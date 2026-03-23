"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Search, Filter, Plus, MoreHorizontal, Eye, Pencil, RefreshCw, Trash2, Printer, Clock, FileText, ShieldCheck, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NewBlotterSheet } from "./new-blotter-sheet"
import { EditBlotterSheet } from "./edit-blotter-sheet"
import { PrintBlotterExtract } from "./print-blotter-extract"
import { SummonsGenerator } from "./summons-generator"
import { SettlementGenerator } from "./settlement-generator"
import { IncidentTimeline, TimelineEvent } from "./incident-timeline"
import { logAuditEvent } from "@/lib/audit"

function generateMockTimeline(record: any): TimelineEvent[] {
  if (!record) return []
  const events: TimelineEvent[] = []
  events.push({
    id: "1",
    title: "Complaint Filed",
    description: `Report filed by ${record.complainant}.`,
    date: record.dateReported,
    status: "completed",
    type: "filed"
  })

  if (record.status === "Investigating" || record.status === "Resolved") {
    const invDate = new Date(new Date(record.dateReported).getTime() + 86400000 * 2).toISOString() 
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
    const resDate = new Date(new Date(record.dateReported).getTime() + 86400000 * 7).toISOString() 
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

const incidentTypes = [
  "All Types",
  "Physical Assault",
  "Property Damage",
  "Theft",
  "Noise Disturbance",
  "Verbal Abuse",
  "Trespassing",
]

const statusOptions = ["All Statuses", "Open", "Investigating", "Resolved"]

function getStatusBadge(status: string) {
  switch (status) {
    case "Open":
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
          Open
        </Badge>
      )
    case "Investigating":
      return (
        <Badge className="bg-info/10 text-info border-info/20 hover:bg-info/15">
          Investigating
        </Badge>
      )
    case "Resolved":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
          Resolved
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
export function BlotterTable() {
  const router = useRouter()
  const [blotterRecords, setBlotterRecords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [sheetOpen, setSheetOpen] = useState(false)
  
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editRecord, setEditRecord] = useState<any | null>(null)
  const [editSheetOpen, setEditSheetOpen] = useState(false)

  // State for Print Extract
  const [printRecord, setPrintRecord] = useState<any | null>(null)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)

  // State for Summons
  const [summonsRecord, setSummonsRecord] = useState<any | null>(null)
  const [summonsDialogOpen, setSummonsDialogOpen] = useState(false)

  // State for Settlement
  const [settlementRecord, setSettlementRecord] = useState<any | null>(null)
  const [settlementDialogOpen, setSettlementDialogOpen] = useState(false)





  useEffect(() => {
    async function fetchRecords() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blotter_records')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching records:", error.message);
          return;
        }

        if (data) {
          const formattedData = data.map((record) => {
            const recordYear = new Date(record.created_at).getFullYear();
            const formattedId = `BLT-${recordYear}-${record.id.toString().padStart(4, '0')}`;

            return {
              id: formattedId, 
              rawId: record.id,
              dateReported: record.created_at,
              incidentDate: record.incident_date,
              complainant: record.complainant_name || 'Unknown',
              incidentType: record.incident_type || 'Unspecified',
              location: record.location || 'N/A',
              status: record.status || 'Open',
              narrative: record.narrative || 'No narrative provided.'
            }
          });
          
          setBlotterRecords(formattedData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecords();
  }, [refreshTrigger]);

  const handleUpdateStatus = async (rawId: number, newStatus: string, recordId: string) => {
    try {
      const { error } = await supabase
        .from('blotter_records')
        .update({ status: newStatus })
        .eq('id', rawId)

      if (error) {
        console.error("Error updating status:", error.message)
        return
      }

      // Log audit event for status changes (especially Resolved)
      try {
        await logAuditEvent({
          action: 'Status Changed' as any,
          details: `Changed status of ${recordId} to "${newStatus}"`,
        })
      } catch {
        // Don't block the UI if audit fails
      }
      
      setRefreshTrigger(prev => prev + 1)
      
    } catch (error) {
      console.error("Unexpected error:", error)
    }
  }

  const handleDeleteRecord = async (rawId: number, recordId: string) => {
    if (!window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      return; 
    }

    try {
      const { error } = await supabase
        .from('blotter_records')
        .delete()
        .eq('id', rawId)

      if (error) {
        console.error("Error deleting record:", error.message)
        return
      }

      // Log audit event for deletion
      try {
        await logAuditEvent({
          action: 'Record Deleted',
          details: `Deleted blotter record ${recordId}`,
        })
      } catch {
        // Don't block the UI if audit fails
      }
      
      setRefreshTrigger(prev => prev + 1)
      
    } catch (error) {
      console.error("Unexpected error:", error)
    }
  }

  const filteredRecords = blotterRecords.filter((record) => {
    const matchesSearch =
      record.id.toLowerCase().includes(search.toLowerCase()) ||
      record.complainant.toLowerCase().includes(search.toLowerCase()) ||
      record.location.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "All Statuses" || record.status === statusFilter
    const matchesType =
      typeFilter === "All Types" || record.incidentType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const exportToCsv = () => {
    if (filteredRecords.length === 0) return
    const headers = ["ID", "Petsa", "Nagrereklamo", "Uri ng Insidente", "Lugar", "Status", "Salaysay"]
    const csvContent = [
      headers.join(","),
      ...filteredRecords.map(r => 
        `"${r.id}","${new Date(r.dateReported).toLocaleDateString()}","${r.complainant}","${r.incidentType}","${r.location}","${r.status}","${r.narrative.replace(/"/g, '""')}"`
      )
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `blotter_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Log audit
    logAuditEvent({
      action: 'Report Generated' as any,
      details: `Exported ${filteredRecords.length} records to CSV`,
    }).catch(() => {})
  }

  return (
    <>
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-2xl font-bold font-sans text-foreground">
              Mga Rekord ng Blotter
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full sm:w-auto text-muted-foreground hover:text-foreground border-border/60" onClick={exportToCsv}>
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button onClick={() => setSheetOpen(true)} className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                <Plus className="h-4 w-4" />
                Talaan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters Row */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search ID, complainant, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50 border-border"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-muted/50 border-border">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-muted/50 border-border">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Incident Type" />
              </SelectTrigger>
              <SelectContent>
                {incidentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-6">
            {isLoading ? (
              <div className="col-span-full h-32 flex items-center justify-center text-sm text-muted-foreground">
                Loading records from database...
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="col-span-full h-32 flex items-center justify-center text-sm text-muted-foreground">
                No records found matching your criteria.
              </div>
            ) : (
              filteredRecords.map((record) => {
                // Determine Severity
                let severityLevel = "LOW RISK"
                let severityPercent = 30
                let severityColor = "bg-emerald-500"
                const type = record.incidentType || ""
                if (["Physical Assault", "Theft", "Fraud", "Domestic Dispute"].includes(type)) {
                  severityLevel = "HIGH RISK"
                  severityPercent = 90
                  severityColor = "bg-[oklch(0.577_0.245_27.325)]" // Destructive red matching CSS var
                } else if (["Property Damage", "Trespassing", "Verbal Abuse"].includes(type)) {
                  severityLevel = "MEDIUM RISK"
                  severityPercent = 60
                  severityColor = "bg-amber-500"
                }

                // Determine Days Open
                const isResolved = record.status === "Resolved"
                const start = new Date(record.dateReported).getTime()
                const now = new Date().getTime()
                const diffDays = Math.max(0, Math.floor((now - start) / (1000 * 3600 * 24)))
                const daysPercent = isResolved ? 100 : Math.min((diffDays / 30) * 100, 100)
                const daysLabel = isResolved ? "RESOLVED" : `${diffDays} ARAW`
                const daysColor = isResolved ? "bg-muted-foreground/40" : (diffDays > 14 ? "bg-[oklch(0.577_0.245_27.325)]" : diffDays > 7 ? "bg-amber-500" : "bg-primary")

                // Status Badge
                const statusText = isResolved ? "RESOLVED" : (diffDays > 14 ? "ESCALATED" : "PENDING")
                const badgeStyle = isResolved 
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                  : statusText === "ESCALATED"
                  ? "bg-[oklch(0.577_0.245_27.325)]/10 text-[oklch(0.577_0.245_27.325)] border-[oklch(0.577_0.245_27.325)]/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"

                return (
                  <Card key={record.id} className="relative bg-white rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden flex flex-col group p-0 border border-border">
                    <div className="absolute top-4 left-4 z-10">
                      <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] backdrop-blur-md border", badgeStyle)}>
                        {statusText}
                      </span>
                    </div>

                    <div className="h-4 bg-gradient-to-r from-primary to-primary/60 shrink-0" />

                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                           <h3 className="font-sans text-lg font-bold text-foreground leading-tight line-clamp-1">{record.incidentType || "Incident"}</h3>
                           <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase shrink-0 mt-1">{record.id}</p>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{record.complainant} • {record.location}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5 text-muted-foreground/60">Kalubhaan</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all duration-500", severityColor)} style={{ width: `${severityPercent}%` }} />
                            </div>
                            <span className={cn("text-[8px] font-black shrink-0", severityColor.replace('bg-', 'text-'))}>{severityLevel.split(' ')[0]}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5 text-muted-foreground/60">Tagal</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all duration-500", daysColor)} style={{ width: `${daysPercent}%` }} />
                            </div>
                            <span className="text-[8px] font-black text-muted-foreground shrink-0">{daysLabel}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border/50">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full gap-2 text-[10px] font-black uppercase tracking-widest h-8 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                          onClick={() => router.push(`/incidents/${record.rawId}`)}
                        >
                          <Eye className="h-3 w-3" />
                          View Full Details
                        </Button>
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted border border-border/50 bg-white/80 backdrop-blur-sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open actions menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push(`/incidents/${record.rawId}`)}>
                            <Eye className="h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setEditRecord(record); setEditSheetOpen(true) }}>
                            <Pencil className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setPrintRecord(record); setPrintDialogOpen(true) }}>
                            <Printer className="h-4 w-4" /> Print Extract
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSummonsRecord(record); setSummonsDialogOpen(true) }}>
                            <FileText className="h-4 w-4" /> Print Summons/Notice
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setSettlementRecord(record); setSettlementDialogOpen(true) }}>
                            <ShieldCheck className="h-4 w-4" /> Amicable Settlement
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleDeleteRecord(record.rawId, record.id)}>
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Set Status</div>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(record.rawId, 'Open', record.id)}>
                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2" /> Mark as Open
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(record.rawId, 'Investigating', record.id)}>
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" /> Mark as Investigating
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(record.rawId, 'Resolved', record.id)}>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2" /> Mark as Resolved
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
            <p>
              Showing <span className="font-medium text-foreground">{filteredRecords.length}</span> of{" "}
              <span className="font-medium text-foreground">{blotterRecords.length}</span> records
            </p>
            <p className="text-xs">Last synced: Just now</p> 
          </div>
        </CardContent>
      </Card>

      {/* New Blotter Sheet */}
      <NewBlotterSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
        onSuccess={() => setRefreshTrigger(prev => prev + 1)} 
      />

      {/* Edit Record Sheet */}
      <EditBlotterSheet 
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        onSuccess={() => setRefreshTrigger(prev => prev + 1)}
        record={editRecord}
      />

      {/* Print Blotter Extract Dialog */}
      <PrintBlotterExtract
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        record={printRecord}
      />

      {/* Summons Generator Dialog */}
      <SummonsGenerator
        open={summonsDialogOpen}
        onOpenChange={setSummonsDialogOpen}
        record={summonsRecord}
      />

      {/* Settlement Generator Dialog */}
      <SettlementGenerator
        open={settlementDialogOpen}
        onOpenChange={setSettlementDialogOpen}
        record={settlementRecord}
      />
      </>
  )
}
