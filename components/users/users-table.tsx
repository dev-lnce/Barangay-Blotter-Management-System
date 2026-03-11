"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MoreHorizontal,
  KeyRound,
  ShieldOff,
  ShieldCheck,
  UserPlus,
  Trash2,
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
import { createSupabaseBrowser } from "@/lib/supabase-browser"
import { resetUserPassword, revokeUserAccess, restoreUserAccess } from "@/lib/auth-actions"

interface SystemUser {
  id: string
  full_name: string
  role: string
  email: string
  status: string
  last_active: string | null // Allow null for new users
}

function getRoleBadge(role: string) {
  // Normalize the text to catch "Captain", "captain", or " Brgy. Captain " perfectly
  const normalizedRole = role?.toLowerCase().trim() || ""

  switch (normalizedRole) {
    case "brgy. captain":
    case "captain":
      return (
        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
          Brgy. Captain
        </Badge>
      )
    case "secretary":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
          Secretary
        </Badge>
      )
    case "desk officer":
    case "desk-officer":
      return (
        <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100">
          Desk Officer
        </Badge>
      )
    default:
      // Capitalizes the first letter as a clean fallback just in case
      const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Unknown"
      return <Badge variant="outline">{displayRole}</Badge>
  }
}

// FIXED: Handle null dates for newly created users
function formatLastActive(dateString: string | null) {
  if (!dateString) return "Never logged in"

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
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    const supabase = createSupabaseBrowser()
    
    // FIXED: Added error logging and null handling for the order clause
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, email, status, last_active')
      .order('last_active', { ascending: false, nullsFirst: false })

    if (error) {
      console.error("❌ Error fetching users from Supabase:", error.message)
    }

    if (data) {
      setSystemUsers(data.map(u => ({
        id: u.id,
        full_name: u.full_name || "Unknown Name",
        role: u.role || "Unassigned",
        email: u.email || "No Email",
        status: u.status || "Active", // Default to Active if status is null
        last_active: u.last_active,
      })))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = systemUsers.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const activeCount = systemUsers.filter((u) => u.status === "Active").length

  const handleResetPassword = async (userId: string, email: string) => {
    const result = await resetUserPassword(userId, email)
    if (result.error) {
      alert(`Error: ${result.error}`)
    } else {
      alert('Password reset email sent successfully.')
    }
  }

 const handleRevokeAccess = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${userName}?`)) return
    const result = await revokeUserAccess(userId, userName)
    if (result.error) {
      alert(`Error: ${result.error}`)
    } else {
      fetchUsers()
    }
  }

  const handleRestoreAccess = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to restore access for ${userName}?`)) return
    const result = await restoreUserAccess(userId, userName)
    if (result.error) {
      alert(`Error: ${result.error}`)
    } else {
      fetchUsers()
    }
  }

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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
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
                            {user.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.full_name}</p>
                            <p className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8).toUpperCase()}</p>
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
                            {formatLastActive(user.last_active)}
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
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => handleResetPassword(user.id, user.email)}
                            >
                              <KeyRound className="h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'Active' ? (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                                onClick={() => handleRevokeAccess(user.id, user.full_name)}
                              >
                                <ShieldOff className="h-4 w-4" />
                                Revoke Access
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                                onClick={() => handleRestoreAccess(user.id, user.full_name)}
                              >
                                <ShieldCheck className="h-4 w-4" />
                                Restore Access
                              </DropdownMenuItem>
                            )}
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

      <AddOfficialDialog open={dialogOpen} onOpenChange={setDialogOpen} onUserCreated={fetchUsers} />
    </>
  )
}