"use client"

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, Plus, MoreHorizontal, Eye, Pencil, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
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
  // 1. ADD NEW STATE VARIABLES HERE
  const [blotterRecords, setBlotterRecords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [sheetOpen, setSheetOpen] = useState(false)
  
  // NEW: Add a trigger state to re-fetch data
  const [refreshTrigger, setRefreshTrigger] = useState(0)

// 2. ADD THE USE EFFECT HOOK TO FETCH SUPABASE DATA
  useEffect(() => {
    async function fetchRecords() {
      setIsLoading(true); // Ensure loading state is true on refresh
      try {
        const { data, error } = await supabase
          .from('blotter_records')
          .select('*')
          .order('created_at', { ascending: false }); // Show newest first

        if (error) {
          console.error("Error fetching records:", error.message);
          return;
        }

        if (data) {
          const formattedData = data.map((record) => {
            // Get the year from the created_at date
            const recordYear = new Date(record.created_at).getFullYear();
            
            // Format ID to look like BLT-2026-0001
            // padStart(4, '0') adds leading zeros to the number
            const formattedId = `BLT-${recordYear}-${record.id.toString().padStart(4, '0')}`;

            return {
              id: formattedId, 
              dateReported: record.created_at,
              complainant: record.complainant_name || 'Unknown',
              incidentType: record.incident_type || 'Unspecified',
              location: record.location || 'N/A',
              status: record.status || 'Open'
            }
          });
          
          setBlotterRecords(formattedData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false); // Turn off loading spinner
      }
    }

    fetchRecords();
  }, [refreshTrigger]); // DEPENDENCY ADDED: Runs when refreshTrigger changes

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

  return (
    <>
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold text-foreground font-sans">
              Blotter Records
            </CardTitle>
            <Button
              onClick={() => setSheetOpen(true)}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              New Blotter Record
            </Button>
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

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold text-foreground">Blotter ID</TableHead>
                  <TableHead className="font-semibold text-foreground">Date Reported</TableHead>
                  <TableHead className="font-semibold text-foreground">Complainant</TableHead>
                  <TableHead className="font-semibold text-foreground">Incident Type</TableHead>
                  <TableHead className="font-semibold text-foreground">Location</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 3. HANDLE LOADING STATE IN UI */}
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Loading records from database...
                    </TableCell>
                  </TableRow>
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No records found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm text-primary font-medium">
                        {record.id}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(record.dateReported).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {record.complainant}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.incidentType}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[180px] truncate">
                        {record.location}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-muted"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open actions menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Pencil className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <RefreshCw className="h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
            <p>
              Showing <span className="font-medium text-foreground">{filteredRecords.length}</span> of{" "}
              <span className="font-medium text-foreground">{blotterRecords.length}</span> records
            </p>
            {/* Optional: You can make the sync time dynamic later */}
            <p className="text-xs">Last synced: Just now</p> 
          </div>
        </CardContent>
      </Card>

      {/* Pass the refresh function so the table updates when a new record is saved! */}
      <NewBlotterSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
        onSuccess={() => setRefreshTrigger(prev => prev + 1)} 
      />
    </>
  )
}