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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [paperSize, setPaperSize] = useState("a4")

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
          <DialogTitle className="font-sans text-2xl text-foreground">Generate Summons</DialogTitle>
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
          <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-0 text-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <style dangerouslySetInnerHTML={{__html: `
              @media print {
                @page { size: ${paperSize === 'letter' ? 'letter' : paperSize === 'legal' ? 'legal' : 'A4'}; margin: 0; }
                body { margin: 0; padding: 0; }
              }
            `}} />
            <div className={`mx-auto box-border ${paperSize === 'letter' ? 'w-[8.5in] min-h-[11in]' : paperSize === 'legal' ? 'w-[8.5in] min-h-[14in]' : 'w-[210mm] min-h-[297mm]'}`} style={{ padding: '25mm' }}>
              <div className="text-center mb-8 pb-4 border-b-2 border-black">
                <p className="text-sm uppercase tracking-[0.2em] font-bold">Republic of the Philippines</p>
                <p className="text-sm uppercase tracking-[0.2em] font-bold">Province of Batangas</p>
                <p className="text-sm uppercase tracking-[0.2em] font-bold">Municipality of San Jose</p>
                <div className="mt-6">
                  <h1 className="text-2xl font-black uppercase tracking-widest">Office of the Punong Barangay</h1>
                  <p className="text-lg italic mt-1">Barangay Banay-Banay II</p>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-3xl font-black text-center mb-12 tracking-[0.4em] underline underline-offset-8 decoration-2">PATAWAG</h2>
                
                <div className="grid grid-cols-2 gap-12 mb-10 text-base">
                  <div className="space-y-4">
                    <div>
                      <span className="font-bold uppercase text-xs tracking-wider text-gray-600 block">Para Kay (To):</span>
                      <p className="text-xl font-black uppercase tracking-wider">{record.respondent_name || "[Pangalan ng Inirereklamo]"}</p>
                      <p className="text-sm italic text-gray-500">Inirereklamo (Respondent)</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p><span className="font-bold uppercase text-xs tracking-wider text-gray-600 block">Blotter Case No:</span> <span className="text-lg font-mono font-bold">{record.id}</span></p>
                    <p><span className="font-bold uppercase text-xs tracking-wider text-gray-600 block">Petsa (Date):</span> <span className="text-lg font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
                  </div>
                </div>

                <div className="mt-16 space-y-8 text-justify leading-relaxed text-lg">
                  <p className="first-letter:text-3xl first-letter:font-bold">
                    Ipinababatid sa inyo na kayo ay inirereklamo ni <span className="font-bold underline">{record.complainant}</span> dahil sa usaping: <span className="font-bold">{record.incidentType}</span>.
                  </p>
                  
                  <div className="bg-gray-50 p-8 border-l-4 border-black italic">
                    <p>
                      Kayo ay inaatasang humarap sa akin, kasama ang inyong mga testigo, sa <span className="font-bold not-italic underline">{hearingDate ? new Date(hearingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : "[Petsa]"}</span> sa ganap na <span className="font-bold not-italic underline">{hearingTime || "[Oras]"}</span> sa Tanggapan ng Punong Barangay upang mapag-usapan at magkaroon ng mapayapang pag-aayos ang inyong hidwaan.
                    </p>
                  </div>

                  <p className="font-bold text-base mt-12 border-t border-black pt-4">
                    BABALA: <span className="font-normal italic">Ang hindi ninyo pagdalo ay nangangahulugan ng inyong pagtalikod sa anumang karapatan sa ilalim ng Katarungang Pambarangay at maaaring maging dahilan upang maiakyat ang kaso sa Hukuman.</span>
                  </p>
                </div>

                <div className="mt-32 text-right">
                  <p className="mb-16 font-bold italic text-gray-600">Ipinag-uutos ni:</p>
                  <div className="inline-block text-center border-t-2 border-black pt-2 min-w-[350px]">
                    <p className="font-black uppercase text-xl tracking-widest">{officerName}</p>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 mt-1">Punong Barangay / Tagapamayapa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-3 print:hidden border-t border-border mt-2 pt-4">
            <div className="flex items-center space-x-2">
              <Label className="text-xs uppercase font-bold tracking-wider whitespace-nowrap text-muted-foreground hidden sm:block">Paper Size</Label>
              <Select value={paperSize} onValueChange={setPaperSize}>
                <SelectTrigger className="w-[100px] h-8 text-xs bg-white border-border">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4" className="text-xs">A4</SelectItem>
                  <SelectItem value="letter" className="text-xs">Letter</SelectItem>
                  <SelectItem value="legal" className="text-xs">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handlePrint} disabled={!hearingDate || !hearingTime} className="gap-2 bg-primary">
                <Printer className="h-4 w-4" />
                {isGenerating ? "Preparing..." : "Print Summons"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
