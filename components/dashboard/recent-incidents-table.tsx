"use client"

import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded px-2 py-0.5 text-[10px] font-bold font-sans uppercase tracking-wider border",
        severity === "HIGH"
          ? "bg-red-50 text-red-500 border-red-200"
          : severity === "MEDIUM"
          ? "bg-amber-50 text-amber-500 border-amber-200"
          : "bg-green-50 text-green-500 border-green-200"
      )}
    >
      {severity}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  // Map our database statuses to the visual representation in your mockup
  const isResolved = status === "Resolved"
  const displayText = isResolved ? "Resolved" : "Unresolved"

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-medium font-sans border bg-transparent",
        isResolved
          ? "text-emerald-500 border-emerald-200"
          : "text-orange-400 border-orange-200"
      )}
    >
      {displayText}
    </span>
  )
}

export function RecentIncidentsTable() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentIncidents() {
      try {
        const { data, error } = await supabase
          .from('blotter_records')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(7) // Fetch only the latest 7 records as per your design

        if (error) throw error

        if (data) {
          const formattedData = data.map((record) => {
            const recordYear = new Date(record.created_at).getFullYear();
            const formattedId = `BLT-${recordYear}-${record.id.toString().padStart(4, '0')}`;

            // Automatically determine severity based on the incident type
            let severity = "LOW"
            const type = record.incident_type || ""
            if (["Physical Assault", "Theft", "Fraud", "Domestic Dispute"].includes(type)) {
              severity = "HIGH"
            } else if (["Property Damage", "Trespassing", "Verbal Abuse"].includes(type)) {
              severity = "MEDIUM"
            }

            return {
              id: formattedId,
              date: new Date(record.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              category: record.incident_type || 'Unspecified',
              severity,
              status: record.status || 'Open'
            }
          })
          setIncidents(formattedData)
        }
      } catch (error) {
        console.error("Error fetching recent incidents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentIncidents()
  }, [])

  return (
    <Card className="shadow-sm border-border h-full flex flex-col">
      <CardHeader className="pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground font-sans">
              Recent Incident Reports
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
              Latest 7 filed blotter entries
            </CardDescription>
          </div>
          <span className="text-xs text-primary font-medium font-sans cursor-pointer hover:underline underline-offset-2">
            View all
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 overflow-x-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-sans whitespace-nowrap h-8">
                Incident ID
              </TableHead>
              <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-sans whitespace-nowrap h-8">
                Date
              </TableHead>
              <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-sans whitespace-nowrap h-8">
                Category
              </TableHead>
              <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-sans whitespace-nowrap h-8">
                Severity
              </TableHead>
              <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-sans whitespace-nowrap h-8">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground font-sans">
                  Loading recent incidents...
                </TableCell>
              </TableRow>
            ) : incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground font-sans">
                  No incidents reported yet.
                </TableCell>
              </TableRow>
            ) : (
              incidents.map((inc) => (
                <TableRow key={inc.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="text-xs font-mono text-foreground font-medium py-3 whitespace-nowrap">
                    {inc.id}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-sans py-3 whitespace-nowrap">
                    {inc.date}
                  </TableCell>
                  <TableCell className="text-xs text-foreground font-sans py-3 whitespace-nowrap">
                    {inc.category}
                  </TableCell>
                  <TableCell className="py-3">
                    <SeverityBadge severity={inc.severity} />
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={inc.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}