"use client"

import { useState, useEffect } from "react"
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EditBlotterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  record: any // The data we pass in from the table
}

const zones = [
  "Zone 1, Purok Ilang-Ilang",
  "Zone 2, Purok Gumamela",
  "Zone 3, Purok Sampaguita",
  "Zone 4, Purok Dahlia",
  "Zone 5, Purok Rosal",
  "Zone 6, Purok Camia",
]

const incidentTypes = [
  "Physical Assault",
  "Property Damage",
  "Theft",
  "Noise Disturbance",
  "Verbal Abuse",
  "Trespassing",
  "Fraud",
  "Domestic Dispute",
  "Other",
]

export function EditBlotterSheet({ open, onOpenChange, onSuccess, record }: EditBlotterSheetProps) {
  const [incidentDate, setIncidentDate] = useState("")
  const [complainantName, setComplainantName] = useState("")
  const [incidentType, setIncidentType] = useState("")
  const [location, setLocation] = useState("")
  const [narrative, setNarrative] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)


  // When the sheet opens or the record changes, pre-fill the form!
  useEffect(() => {
    if (record) {
      setComplainantName(record.complainant || "")
      setIncidentType(record.incidentType || "")
      setLocation(record.location || "")
      setNarrative(record.narrative || "")
      setIncidentDate(record.incidentDate || "")
    }
  }, [record, open])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('blotter_records')
        .update({
          complainant_name: complainantName,
          incident_type: incidentType,
          location: location,
          narrative: narrative,
          incident_date: incidentDate
        })
        .eq('id', record.rawId) // Update ONLY the record with this specific ID

      if (error) throw error

      onOpenChange(false)
      if (onSuccess) onSuccess()
      
    } catch (error: any) {
      console.error("Error updating record:", error.message || error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't render the form if there's no record selected yet
  if (!record) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border mb-6">
          <SheetTitle className="text-lg font-semibold text-foreground">
            Edit Record: {record.id}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Update the details of this incident report below.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-complainant" className="text-sm font-medium">Complainant Name</Label>
              <Input
                id="edit-complainant"
                className="bg-muted/50"
                value={complainantName}
                onChange={(e) => setComplainantName(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Incident Type</Label>
                <Select value={incidentType} onValueChange={setIncidentType}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-narrative" className="text-sm font-medium">Incident Narrative</Label>
              <Textarea
                id="edit-narrative"
                className="min-h-[150px] bg-muted/50 resize-none"
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}