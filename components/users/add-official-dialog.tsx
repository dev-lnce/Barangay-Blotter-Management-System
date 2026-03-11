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
]

export function AddOfficialDialog({ open, onOpenChange, onUserCreated }: AddOfficialDialogProps) {
  const supabase = createSupabaseBrowser()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [isDpaChecked, setIsDpaChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isFormValid = fullName.trim() !== "" && email.trim() !== "" && role !== "" && isDpaChecked

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          full_name: fullName,
          email: email,
          role: role,
          status: 'Active'
        }])

      if (error) throw error

      // Reset form and close on success
      setFullName("")
      setEmail("")
      setRole("")
      setIsDpaChecked(false)
      onOpenChange(false)
      
      if (onUserCreated) onUserCreated() // Refreshes the table!

    } catch (error: any) {
      console.error("Error creating user:", error.message)
      
      // NEW: Show an alert if the email is already taken
      if (error.message.includes("duplicate key value") || error.message.includes("profiles_email_key")) {
        alert("This email address is already registered to another official. Please use a different email.")
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
                <Select value={role} onValueChange={setRole}>
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