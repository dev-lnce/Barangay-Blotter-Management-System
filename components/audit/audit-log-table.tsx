"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Download,
  Filter,
  Search,
  LogIn,
  FilePlus,
  FileEdit,
  Trash2,
  FileOutput,
  ShieldAlert,
  KeyRound,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

type ActionType =
  | "Login"
  | "Logout"
  | "Record Created"
  | "Record Edited"
  | "Record Deleted"
  | "Data Exported"
  | "Failed Login"
  | "Password Reset"
  | "User Created"
  | "Access Revoked"

type LogStatus = "Success" | "Warning" | "Failed"

interface AuditLogEntry {
  id: string
  timestamp: string
  user: string
  userId: string
  action: ActionType
  details: string
  ipAddress: string
  status: LogStatus
}

// Comprehensive mock audit log data
const auditLogs: AuditLogEntry[] = [
  {
    id: "LOG-001",
    timestamp: "2026-03-10T15:42:18",
    user: "Maria Elena Cruz",
    userId: "USR-002",
    action: "Record Created",
    details: "Created Blotter #2026-0342",
    ipAddress: "192.168.1.105",
    status: "Success",
  },
  {
    id: "LOG-002",
    timestamp: "2026-03-10T15:38:05",
    user: "Jose Antonio Reyes",
    userId: "USR-003",
    action: "Record Edited",
    details: "Updated status on Blotter #2026-0339",
    ipAddress: "192.168.1.108",
    status: "Success",
  },
  {
    id: "LOG-003",
    timestamp: "2026-03-10T15:22:47",
    user: "Unknown",
    userId: "—",
    action: "Failed Login",
    details: "Failed attempt with ID 'admin123'",
    ipAddress: "203.177.45.102",
    status: "Failed",
  },
  {
    id: "LOG-004",
    timestamp: "2026-03-10T14:55:33",
    user: "Hon. Ricardo P. Santos",
    userId: "USR-001",
    action: "Data Exported",
    details: "Exported Q1 2026 incident report (PDF)",
    ipAddress: "192.168.1.101",
    status: "Success",
  },
  {
    id: "LOG-005",
    timestamp: "2026-03-10T14:32:00",
    user: "Hon. Ricardo P. Santos",
    userId: "USR-001",
    action: "Login",
    details: "Successful authentication",
    ipAddress: "192.168.1.101",
    status: "Success",
  },
  {
    id: "LOG-006",
    timestamp: "2026-03-10T13:18:22",
    user: "Ana Patricia Bautista",
    userId: "USR-004",
    action: "Record Deleted",
    details: "Deleted draft Blotter #2026-0341",
    ipAddress: "192.168.1.112",
    status: "Warning",
  },
  {
    id: "LOG-007",
    timestamp: "2026-03-10T12:45:10",
    user: "Unknown",
    userId: "—",
    action: "Failed Login",
    details: "Failed attempt with ID 'secretary'",
    ipAddress: "203.177.45.102",
    status: "Failed",
  },
  {
    id: "LOG-008",
    timestamp: "2026-03-10T11:30:55",
    user: "Maria Elena Cruz",
    userId: "USR-002",
    action: "User Created",
    details: "Created account for Pedro Miguel Torres",
    ipAddress: "192.168.1.105",
    status: "Success",
  },
  {
    id: "LOG-009",
    timestamp: "2026-03-10T10:22:18",
    user: "Jose Antonio Reyes",
    userId: "USR-003",
    action: "Record Created",
    details: "Created Blotter #2026-0340",
    ipAddress: "192.168.1.108",
    status: "Success",
  },
  {
    id: "LOG-010",
    timestamp: "2026-03-10T09:15:00",
    user: "Maria Elena Cruz",
    userId: "USR-002",
    action: "Login",
    details: "Successful authentication",
    ipAddress: "192.168.1.105",
    status: "Success",
  },
  {
    id: "LOG-011",
    timestamp: "2026-03-09T17:45:33",
    user: "Hon. Ricardo P. Santos",
    userId: "USR-001",
    action: "Access Revoked",
    details: "Revoked access for former officer (ID: USR-006)",
    ipAddress: "192.168.1.101",
    status: "Warning",
  },
  {
    id: "LOG-012",
    timestamp: "2026-03-09T16:45:00",
    user: "Jose Antonio Reyes",
    userId: "USR-003",
    action: "Logout",
    details: "Session ended",
    ipAddress: "192.168.1.108",
    status: "Success",
  },
  {
    id: "LOG-013",
    timestamp: "2026-03-09T15:30:22",
    user: "Ana Patricia Bautista",
    userId: "USR-004",
    action: "Password Reset",
    details: "Password reset for own account",
    ipAddress: "192.168.1.112",
    status: "Success",
  },
  {
    id: "LOG-014",
    timestamp: "2026-03-09T14:12:08",
    user: "Maria Elena Cruz",
    userId: "USR-002",
    action: "Record Edited",
    details: "Added evidence to Blotter #2026-0335",
    ipAddress: "192.168.1.105",
    status: "Success",
  },
  {
    id: "LOG-015",
    timestamp: "2026-03-09T11:05:45",
    user: "Unknown",
    userId: "—",
    action: "Failed Login",
    details: "Multiple failed attempts detected (5x)",
    ipAddress: "45.33.128.77",
    status: "Failed",
  },
]

function getActionIcon(action: ActionType) {
  const iconClass = "h-3.5 w-3.5"
  switch (action) {
    case "Login":
    case "Logout":
      return <LogIn className={iconClass} />
    case "Record Created":
      return <FilePlus className={iconClass} />
    case "Record Edited":
      return <FileEdit className={iconClass} />
    case "Record Deleted":
      return <Trash2 className={iconClass} />
    case "Data Exported":
      return <FileOutput className={iconClass} />
    case "Failed Login":
      return <ShieldAlert className={iconClass} />
    case "Password Reset":
      return <KeyRound className={iconClass} />
    case "User Created":
      return <UserPlus className={iconClass} />
    case "Access Revoked":
      return <ShieldAlert className={iconClass} />
    default:
      return <FileEdit className={iconClass} />
  }
}

function getStatusBadge(status: LogStatus) {
  switch (status) {
    case "Success":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-medium px-1.5 py-0"
        >
          SUCCESS
        </Badge>
      )
    case "Warning":
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-medium px-1.5 py-0"
        >
          WARNING
        </Badge>
      )
    case "Failed":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 text-[10px] font-medium px-1.5 py-0"
        >
          FAILED
        </Badge>
      )
    default:
      return <Badge variant="outline" className="text-[10px]">{status}</Badge>
  }
}

function isDestructiveAction(action: ActionType, status: LogStatus): boolean {
  return (
    action === "Record Deleted" ||
    action === "Access Revoked" ||
    action === "Failed Login" ||
    status === "Failed" ||
    status === "Warning"
  )
}

export function AuditLogTable() {
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search)

    const matchesAction =
      actionFilter === "all" || log.action === actionFilter

    const logDate = new Date(log.timestamp)
    const matchesStartDate = !startDate || logDate >= startDate
    const matchesEndDate = !endDate || logDate <= endDate

    return matchesSearch && matchesAction && matchesStartDate && matchesEndDate
  })

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleExportCSV = () => {
    const headers = ["Timestamp", "User", "User ID", "Action", "Details", "IP Address", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          `"${log.user}"`,
          log.userId,
          log.action,
          `"${log.details}"`,
          log.ipAddress,
          log.status,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-log-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const actionTypes: ActionType[] = [
    "Login",
    "Logout",
    "Record Created",
    "Record Edited",
    "Record Deleted",
    "Data Exported",
    "Failed Login",
    "Password Reset",
    "User Created",
    "Access Revoked",
  ]

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground font-sans flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              System Audit Log
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              {filteredLogs.length} events recorded | Last sync: {format(new Date(), "HH:mm:ss")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="gap-2 border-border hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Export Log to CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center rounded-lg bg-muted/50 p-3 border border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Filter className="h-3.5 w-3.5" />
            FILTERS
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search user, details, IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-card border-border"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-8 w-[130px] justify-start text-left text-xs font-normal border-border bg-card",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                  {startDate ? format(startDate, "MMM d, yyyy") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-xs text-muted-foreground">to</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-8 w-[130px] justify-start text-left text-xs font-normal border-border bg-card",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                  {endDate ? format(endDate, "MMM d, yyyy") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Type Filter */}
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="h-8 w-[160px] text-xs border-border bg-card">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                All Actions
              </SelectItem>
              {actionTypes.map((action) => (
                <SelectItem key={action} value={action} className="text-xs">
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(search || actionFilter !== "all" || startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearch("")
                setActionFilter("all")
                setStartDate(undefined)
                setEndDate(undefined)
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/70 hover:bg-muted/70">
                <TableHead className="font-semibold text-foreground text-[11px] uppercase tracking-wider py-2">
                  Timestamp
                </TableHead>
                <TableHead className="font-semibold text-foreground text-[11px] uppercase tracking-wider py-2">
                  User
                </TableHead>
                <TableHead className="font-semibold text-foreground text-[11px] uppercase tracking-wider py-2">
                  Action
                </TableHead>
                <TableHead className="font-semibold text-foreground text-[11px] uppercase tracking-wider py-2">
                  IP Address
                </TableHead>
                <TableHead className="font-semibold text-foreground text-[11px] uppercase tracking-wider py-2 text-right">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground text-xs"
                  >
                    No log entries found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      isDestructiveAction(log.action, log.status) &&
                        "bg-red-50/50 hover:bg-red-50/70"
                    )}
                  >
                    <TableCell className="py-2">
                      <div className="font-mono text-[11px] text-foreground">
                        {format(new Date(log.timestamp), "yyyy-MM-dd")}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {format(new Date(log.timestamp), "HH:mm:ss")}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="text-xs font-medium text-foreground">
                        {log.user}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {log.userId}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-start gap-2">
                        <div
                          className={cn(
                            "mt-0.5 p-1 rounded",
                            isDestructiveAction(log.action, log.status)
                              ? "bg-red-100 text-red-600"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {getActionIcon(log.action)}
                        </div>
                        <div>
                          <div
                            className={cn(
                              "text-xs font-medium",
                              isDestructiveAction(log.action, log.status)
                                ? "text-red-700"
                                : "text-foreground"
                            )}
                          >
                            {log.action}
                          </div>
                          <div className="text-[10px] text-muted-foreground max-w-[200px] truncate">
                            {log.details}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <code
                        className={cn(
                          "font-mono text-[10px] px-1.5 py-0.5 rounded",
                          isDestructiveAction(log.action, log.status)
                            ? "bg-red-100 text-red-700"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {log.ipAddress}
                      </code>
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      {getStatusBadge(log.status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <p className="font-mono">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>
            -
            <span className="font-medium text-foreground">
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredLogs.length}
            </span>{" "}
            entries
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 font-mono text-[11px]">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 rounded-md bg-muted/50 border border-border px-3 py-2">
          <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <p className="text-[10px] text-muted-foreground">
            Audit logs are retained for 365 days per Data Privacy Act compliance requirements. 
            Tampering with system logs is a criminal offense under RA 10175 (Cybercrime Prevention Act).
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
