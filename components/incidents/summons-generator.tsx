"use client"

import { useState } from "react"
import { FileText, Printer, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logAuditEvent } from "@/lib/audit"

interface SummonsGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: any | null
}

export function SummonsGenerator({ open, onOpenChange, record }: SummonsGeneratorProps) {
  const [hearingDate, setHearingDate] = useState("")
  const [hearingTime, setHearingTime] = useState("")
  const [officerName, setOfficerName] = useState("Hon. Kapitan Andres")
  const [isGenerating, setIsGenerating] = useState(false)

  if (!record) return null

  const handlePrint = async () => {
    setIsGenerating(true)
    
    try {
      await logAuditEvent({
        action: 'Summons Generated' as any,
        details: `Generated summons for record ${record.id} directed to ${record.respondent_name || 'Respondent'}`,
      })
    } catch {
      // ignore
    }

    setTimeout(() => {
      window.print()
      setIsGenerating(false)
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground">Generate Summons</DialogTitle>
          <DialogDescription className="font-sans text-sm tracking-wide text-muted-foreground">
            Create an official notice for mediation/hearing at the Barangay Hall.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4 print:hidden">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">Settings</h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">Hearing Date</Label>
                <Input 
                  type="date" 
                  value={hearingDate}
                  onChange={(e) => setHearingDate(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Hearing Time</Label>
                <Input 
                  type="time" 
                  value={hearingTime}
                  onChange={(e) => setHearingTime(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Presiding Officer</Label>
              <Input 
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* Hidden Print Wrapper */}
          <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-12 text-black">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10 border-b-2 border-black pb-6">
                <p className="text-sm uppercase tracking-widest font-bold">Republic of the Philippines</p>
                <p className="text-sm uppercase tracking-widest font-bold">Province of Batangas</p>
                <p className="text-sm uppercase tracking-widest font-bold">Municipality of San Jose</p>
                <h1 className="text-2xl font-black uppercase mt-4 font-serif">Office of the Punong Barangay</h1>
                <p className="text-lg font-serif italic mt-2">Barangay Banay-Banay II</p>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-center mb-10 font-serif tracking-widest underline underline-offset-8">PATAWAG</h2>
                
                <div className="flex justify-between mb-8 font-serif">
                  <div>
                    <p><strong>To:</strong> {record.respondent_name || "[Pangalan ng Inirereklamo]"}</p>
                    <p className="mt-1">Respondent</p>
                  </div>
                  <div className="text-right">
                    <p><strong>Case No:</strong> {record.id}</p>
                    <p className="mt-1"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-6 text-justify leading-relaxed font-serif text-lg">
                  <p>
                    Ipinababatid sa inyo na kayo ay inirereklamo ni <strong>{record.complainant}</strong> dahil sa usaping: <strong>{record.incidentType}</strong>.
                  </p>
                  <p>
                    Kayo ay inaatasang humarap sa akin, kasama ang inyong mga testigo, sa <strong>{hearingDate ? new Date(hearingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : "[Petsa]"}</strong> sa ganap na <strong>{hearingTime || "[Oras]"}</strong> sa Tanggapan ng Punong Barangay upang mapag-usapan at magkaroon ng mapayapang pag-aayos ang inyong hidwaan.
                  </p>
                  <p className="font-bold italic mt-8">
                    Ang hindi ninyo pagdalo ay nangangahulugan ng inyong pagtalikod sa anumang karapatan sa ilalim ng Katarungang Pambarangay at maaaring maging dahilan upang maiakyat ang kaso sa Hukuman.
                  </p>
                </div>

                <div className="mt-16 text-right font-serif">
                  <p className="mb-12">Ipinag-uutos ni:</p>
                  <div className="inline-block text-center border-t border-black pt-2 min-w-[250px]">
                    <p className="font-bold uppercase text-lg">{officerName}</p>
                    <p className="text-sm">Punong Barangay / Tagapamayapa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 print:hidden">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handlePrint} disabled={!hearingDate || !hearingTime} className="gap-2 bg-primary">
              <Printer className="h-4 w-4" />
              {isGenerating ? "Preparing..." : "Print Summons"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
