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
import { Separator } from "@/components/ui/separator"

interface AddOfficialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const positions = [
  { value: "captain", label: "Brgy. Captain" },
  { value: "secretary", label: "Secretary" },
  { value: "desk-officer", label: "Desk Officer" },
]

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  const symbols = "!@#$%"
  let password = ""
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password += symbols.charAt(Math.floor(Math.random() * symbols.length))
  return password
}

export function AddOfficialDialog({ open, onOpenChange }: AddOfficialDialogProps) {
  const [fullName, setFullName] = useState("")
  const [position, setPosition] = useState("")
  const [email, setEmail] = useState("")
  const [tempPassword, setTempPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const [dpaConfirmed, setDpaConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGeneratePassword = () => {
    const newPassword = generatePassword()
    setTempPassword(newPassword)
    setCopied(false)
  }

  const handleCopyPassword = async () => {
    if (tempPassword) {
      await navigator.clipboard.writeText(tempPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dpaConfirmed) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    
    // Reset form and close
    setFullName("")
    setPosition("")
    setEmail("")
    setTempPassword("")
    setDpaConfirmed(false)
    onOpenChange(false)
  }

  const isFormValid = fullName && position && email && tempPassword && dpaConfirmed

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Add New Official
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Grant system access to a barangay official. Ensure proper authorization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full-name"
                placeholder="e.g., Juan Dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium">
                Official Position <span className="text-destructive">*</span>
              </Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger id="position" className="bg-muted/50">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., official@brgybanaybanay.gov.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50"
              />
            </div>
          </div>

          <Separator />

          {/* Temporary Password */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Temporary Password <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  readOnly
                  value={tempPassword}
                  placeholder="Click generate to create password"
                  className="bg-muted/50 font-mono text-sm pr-10"
                />
                {tempPassword && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-primary/10"
                    onClick={handleCopyPassword}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="sr-only">Copy password</span>
                  </Button>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGeneratePassword}
                className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              >
                <RefreshCw className="h-4 w-4" />
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              User must change this password upon first login.
            </p>
          </div>

          <Separator />

          {/* DPA Confirmation */}
          <Alert className="border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <Checkbox
                id="dpa-confirm"
                checked={dpaConfirmed}
                onCheckedChange={(checked) => setDpaConfirmed(checked === true)}
                className="mt-0.5 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <div className="flex-1">
                <Label
                  htmlFor="dpa-confirm"
                  className="text-sm font-medium text-foreground cursor-pointer leading-tight"
                >
                  Data Privacy Act Confirmation <span className="text-destructive">*</span>
                </Label>
                <AlertDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  I confirm this user is authorized to process sensitive personal data under the{" "}
                  <span className="font-medium text-foreground">
                    Data Privacy Act of 2012 (R.A. 10173)
                  </span>
                  . Unauthorized access is punishable by law.
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
