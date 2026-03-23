"use client"

import { useState } from "react"
import { Copy, Check, RefreshCw, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createUser } from "@/lib/auth-actions"
import { createSupabaseBrowser } from "@/lib/supabase-browser"

interface AddOfficialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated?: () => void
}

const roles = [
  "Brgy. Captain",
  "Secretary",
  "Desk Officer",
  "Lupon",
  "Kagawad",
  "Tanod",
  "Other (Specify)",
]

export function AddOfficialDialog({ open, onOpenChange, onUserCreated }: AddOfficialDialogProps) {
  const supabase = createSupabaseBrowser()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [customRole, setCustomRole] = useState("")
  const [isDpaChecked, setIsDpaChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const effectiveRole = role === "Other (Specify)" ? customRole.trim() : role
  const isFormValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    effectiveRole !== "" &&
    isDpaChecked

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)

    try {
      // 1. Generate a temporary password that meets Supabase security requirements
      const tempPassword = Math.random().toString(36).slice(-8) + "A1!"

      // 2. Pass the data as a single object (matching the params in auth-actions.ts)
      const result = await createUser({
        fullName: fullName,
        email: email,
        role: effectiveRole,
        tempPassword: tempPassword
      })

      if (result && result.error) {
        throw new Error(result.error)
      }

      // Reset form and close on success
      setFullName("")
      setEmail("")
      setRole("")
      setCustomRole("")
      setIsDpaChecked(false)
      onOpenChange(false)
      
      if (onUserCreated) onUserCreated() // Refreshes the table!

    } catch (error: any) {
      console.error("Error creating user:", error.message)
      
      if (error.message.includes("duplicate") || error.message.includes("already registered")) {
        alert("This email address is already registered. Please use a different email.")
      } else {
        alert("An error occurred while creating the user: " + error.message)
      }
      
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold text-foreground font-sans">
            Add System User
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground font-sans mt-1.5">
            Register a new barangay official to access the Blotter Management System.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="full-name"
                placeholder="e.g. Juan Dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-muted/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">System Role</Label>
                <Select value={role} onValueChange={(val) => {
                  setRole(val)
                  if (val !== "Other (Specify)") setCustomRole("")
                }}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Role Input — shown when "Other (Specify)" is selected */}
            {role === "Other (Specify)" && (
              <div className="space-y-2">
                <Label htmlFor="custom-role" className="text-sm font-medium">
                  Specify Custom Role
                </Label>
                <Input
                  id="custom-role"
                  placeholder="e.g., Lupon Tagapamayapa, SK Chairman"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="bg-muted/50"
                  autoFocus
                />
              </div>
            )}
          </div>

          <Alert className="bg-muted/30 border-border">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <div className="flex items-start gap-3 mt-0.5">
              <Checkbox
                id="dpa"
                checked={isDpaChecked}
                onCheckedChange={(checked) => setIsDpaChecked(checked === true)}
                className="mt-1 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div className="grid gap-1">
                <Label htmlFor="dpa" className="text-sm font-semibold text-foreground cursor-pointer leading-tight">
                  Data Privacy Act Confirmation <span className="text-destructive">*</span>
                </Label>
                <AlertDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  I confirm this user is authorized to process sensitive personal data under the{" "}
                  <span className="font-medium text-foreground">Data Privacy Act of 2012 (R.A. 10173)</span>.
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
