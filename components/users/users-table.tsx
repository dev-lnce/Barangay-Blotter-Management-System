"use client"

import { useState } from "react"
import {
  Search,
  MoreHorizontal,
  KeyRound,
  ShieldOff,
  UserPlus,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddOfficialDialog } from "./add-official-dialog"

// Mock data for users
const systemUsers = [
  {
    id: "USR-001",
    name: "Hon. Ricardo P. Santos",
    role: "Brgy. Captain",
    email: "captain.santos@brgybanaybanay.gov.ph",
    lastActive: "2026-03-10T14:32:00",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Maria Elena Cruz",
    role: "Secretary",
    email: "secretary.cruz@brgybanaybanay.gov.ph",
    lastActive: "2026-03-10T09:15:00",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Jose Antonio Reyes",
    role: "Desk Officer",
    email: "officer.reyes@brgybanaybanay.gov.ph",
    lastActive: "2026-03-09T16:45:00",
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Ana Patricia Bautista",
    role: "Desk Officer",
    email: "officer.bautista@brgybanaybanay.gov.ph",
    lastActive: "2026-03-08T11:20:00",
    status: "Active",
  },
  {
    id: "USR-005",
    name: "Pedro Miguel Torres",
    role: "Desk Officer",
    email: "officer.torres@brgybanaybanay.gov.ph",
    lastActive: "2026-03-05T08:00:00",
    status: "Inactive",
  },
]

function getRoleBadge(role: string) {
  switch (role) {
    case "Brgy. Captain":
      return (
        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
          Brgy. Captain
        </Badge>
      )
    case "Secretary":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
          Secretary
        </Badge>
      )
    case "Desk Officer":
      return (
        <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100">
          Desk Officer
        </Badge>
      )
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

function formatLastActive(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) {
    return "Just now"
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
}

export function UsersTable() {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredUsers = systemUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const activeCount = systemUsers.filter((u) => u.status === "Active").length

  return (
    <>
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground font-sans">
                System Users
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {activeCount} active user{activeCount !== 1 ? "s" : ""} with system access
              </p>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <UserPlus className="h-4 w-4" />
              Add New Official
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/50 border-border"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold text-foreground">Name</TableHead>
                  <TableHead className="font-semibold text-foreground">Role</TableHead>
                  <TableHead className="font-semibold text-foreground">Email</TableHead>
                  <TableHead className="font-semibold text-foreground">Last Active</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.status === "Active" ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          />
                          <span className="text-sm text-muted-foreground">
                            {formatLastActive(user.lastActive)}
                          </span>
                        </div>
                      </TableCell>
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
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <KeyRound className="h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                              <ShieldOff className="h-4 w-4" />
                              Revoke Access
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
              Showing <span className="font-medium text-foreground">{filteredUsers.length}</span> of{" "}
              <span className="font-medium text-foreground">{systemUsers.length}</span> users
            </p>
            <p className="text-xs">Access controlled by Admin</p>
          </div>
        </CardContent>
      </Card>

      <AddOfficialDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
