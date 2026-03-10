"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Upload,
  X,
  FileText,
  ImageIcon,
  ExternalLink,
} from "lucide-react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface NewBlotterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void 
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

export function NewBlotterSheet({ open, onOpenChange, onSuccess }: NewBlotterSheetProps) {
  const [location, setLocation] = useState("")
  const [narrative, setNarrative] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  
  // NEW STATE VARIABLES
  const [complainantName, setComplainantName] = useState("")
  const [incidentType, setIncidentType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simulate duplicate detection based on location
  const showDuplicateWarning =
    location === "Zone 3, Purok Sampaguita" && narrative.length > 20

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("1. Button clicked, starting submission...")
    setIsSubmitting(true)

    try {
      console.log("2. Sending data to Supabase...", { 
        complainantName, 
        incidentType, 
        location, 
        narrative 
      })

      const { data, error } = await supabase
        .from('blotter_records')
        .insert([
          {
            complainant_name: complainantName,
            incident_type: incidentType,
            location: location,
            narrative: narrative,
            status: 'Open'
          }
        ])
        .select()

      console.log("3. Supabase responded!", { data, error })

      if (error) throw error

      console.log("4. Success! Closing sheet...")
      setComplainantName("")
      setIncidentType("")
      setLocation("")
      setNarrative("")
      onOpenChange(false)
      if (onSuccess) onSuccess()
      
    } catch (error: any) {
      console.error("❌ Error caught:", error.message || error)
    } finally {
      console.log("5. Finally block reached, resetting button.")
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg font-semibold text-foreground">
            New Blotter Record
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Fill out the details below to create a new incident report.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Complainant Details */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
                1
              </span>
              Complainant Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="complainant-name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="complainant-name"
                  placeholder="e.g., Juan Dela Cruz"
                  className="bg-muted/50"
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complainant-contact" className="text-sm font-medium">
                  Contact Number
                </Label>
                <Input
                  id="complainant-contact"
                  placeholder="e.g., 09XX XXX XXXX"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="complainant-address" className="text-sm font-medium">
                  Address
                </Label>
                <Input
                  id="complainant-address"
                  placeholder="Complete address"
                  className="bg-muted/50"
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Respondent Details */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
                2
              </span>
              Respondent Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="respondent-name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="respondent-name"
                  placeholder="e.g., Maria Santos"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respondent-contact" className="text-sm font-medium">
                  Contact Number (Optional)
                </Label>
                <Input
                  id="respondent-contact"
                  placeholder="e.g., 09XX XXX XXXX"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="respondent-address" className="text-sm font-medium">
                  Address
                </Label>
                <Input
                  id="respondent-address"
                  placeholder="Complete address"
                  className="bg-muted/50"
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Incident Details */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
                3
              </span>
              Incident Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="incident-date" className="text-sm font-medium">
                  Date of Incident
                </Label>
                <Input
                  id="incident-date"
                  type="date"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-time" className="text-sm font-medium">
                  Time of Incident
                </Label>
                <Input
                  id="incident-time"
                  type="time"
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-type" className="text-sm font-medium">
                  Incident Type
                </Label>
                <Select value={incidentType} onValueChange={setIncidentType}>
                  <SelectTrigger id="incident-type" className="bg-muted/50">
                    <SelectValue placeholder="Select type" />
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
              <div className="space-y-2">
                <Label htmlFor="incident-location" className="text-sm font-medium">
                  Location (Zone/Purok)
                </Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger id="incident-location" className="bg-muted/50">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exact-location" className="text-sm font-medium">
                Exact Location / Landmark
              </Label>
              <Input
                id="exact-location"
                placeholder="e.g., Near the basketball court on Rizal Street"
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="narrative" className="text-sm font-medium">
                Incident Narrative
              </Label>
              <Textarea
                id="narrative"
                placeholder="Provide a detailed account of what happened..."
                className="min-h-[120px] bg-muted/50 resize-none"
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Include all relevant details: sequence of events, parties involved, and any witnesses.
              </p>
            </div>

            {/* AI Duplicate Warning */}
            {showDuplicateWarning && (
              <Alert className="border-amber-300 bg-amber-50 text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 font-semibold">
                  Potential Duplicate Detected
                </AlertTitle>
                <AlertDescription className="text-amber-700">
                  <p className="text-sm mt-1">
                    A similar record with matching location and narrative patterns was found.
                  </p>
                  <p className="text-xs mt-2 font-mono bg-amber-100 px-2 py-1 rounded inline-block">
                    Levenshtein Distance similarity match found in Compound X
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 border-amber-400 text-amber-800 hover:bg-amber-100 hover:text-amber-900 gap-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Review Similar Record
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </section>

          <Separator />

          {/* File Attachments */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
                4
              </span>
              Digital Evidence
            </h3>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">
                Drag and drop files here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse (Photos, PDFs, Documents)
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 border border-border"
                  >
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-sm text-foreground truncate flex-1">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3.5 w-3.5" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Submit Record"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
