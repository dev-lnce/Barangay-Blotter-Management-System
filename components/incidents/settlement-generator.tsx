"use client"

import { useState } from "react"
import { ShieldCheck, Printer } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { logAuditEvent } from "@/lib/audit"

interface SettlementGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: any | null
}

export function SettlementGenerator({ open, onOpenChange, record }: SettlementGeneratorProps) {
  const [agreementText, setAgreementText] = useState("Kami ay nagkakasundo na kusa at mapayapang tapusin ang aming di pagkakaunawaan nang walang pamimilit mula kaninuman.")
  const [officerName, setOfficerName] = useState("Hon. Kapitan Andres")
  const [isGenerating, setIsGenerating] = useState(false)

  if (!record) return null

  const handlePrint = async () => {
    setIsGenerating(true)
    
    try {
      await logAuditEvent({
        action: 'Settlement Generated' as any,
        details: `Generated settlement form for record ${record.id}`,
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
          <DialogTitle className="font-serif text-2xl text-foreground">Barangay Settlement</DialogTitle>
          <DialogDescription className="font-sans text-sm tracking-wide text-muted-foreground">
            Generate Amicable Settlement form (Kasunduang Pag-aayos) for Lupon Tagapamayapa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4 print:hidden">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">Terms</h4>
            
            <div className="space-y-2">
              <Label className="text-xs">Agreement Narrative</Label>
              <Textarea 
                value={agreementText}
                onChange={(e) => setAgreementText(e.target.value)}
                className="bg-white min-h-[100px]"
                placeholder="Detalye ng kasunduan..."
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Attesting Officer (Lupon Chairman)</Label>
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
                <h1 className="text-2xl font-black uppercase mt-4 font-serif">LUPONG TAGAPAMAYAPA</h1>
                <p className="text-lg font-serif italic mt-2">Barangay Banay-Banay II</p>
              </div>

              <div className="mb-8 font-serif">
                <h2 className="text-3xl font-black text-center mb-10 tracking-widest underline underline-offset-8">KASUNDUANG PAG-AAYOS</h2>
                
                <div className="flex justify-between mb-8 text-lg">
                  <div>
                    <p><strong>Complainant:</strong> {record.complainant}</p>
                    <p className="mt-2"><strong>Respondent:</strong> {record.respondent_name || "______________________"}</p>
                  </div>
                  <div className="text-right">
                    <p><strong>Blotter Case No:</strong> {record.id}</p>
                    <p className="mt-2"><strong>Incident Type:</strong> {record.incidentType}</p>
                  </div>
                </div>

                <div className="space-y-6 text-justify leading-relaxed text-lg mt-12 bg-gray-50 p-6 border border-gray-300">
                  <p className="font-bold mb-4 uppercase text-sm tracking-widest">Gist of Agreement:</p>
                  <p className="whitespace-pre-wrap">{agreementText}</p>
                </div>

                <div className="mt-10 leading-relaxed text-lg">
                  <p>
                    Nangangako kami na tutuparin nang buong katapatan ang mga nakasaad sa itaas na kasunduan. Kung sinuman sa amin ang hindi tumupad, ang kabilang panig ay maaaring dumulog sa mga kinauukulan upang ipatupad ang kasunduang ito alinsunod sa batas.
                  </p>
                  <p className="mt-4">
                    Nilagdaan ngayong ika-<strong>{new Date().getDate()}</strong> ng <strong>{new Date().toLocaleString('default', { month: 'long' })}</strong>, <strong>{new Date().getFullYear()}</strong>.
                  </p>
                </div>

                <div className="flex justify-between mt-20 text-center">
                  <div className="min-w-[200px]">
                    <div className="border-b border-black mb-2 pb-1"></div>
                    <p className="font-bold text-lg">{record.complainant}</p>
                    <p className="text-sm">Nagrereklamo (Complainant)</p>
                  </div>
                  <div className="min-w-[200px]">
                    <div className="border-b border-black mb-2 pb-1"></div>
                    <p className="font-bold text-lg">{record.respondent_name || "______________________"}</p>
                    <p className="text-sm">Inirereklamo (Respondent)</p>
                  </div>
                </div>

                <div className="mt-16 pt-8 border-t-2 border-dashed border-gray-400 text-center">
                  <p className="mb-12 font-bold italic">Pinatutunayan:</p>
                  <div className="inline-block text-center border-t border-black pt-2 min-w-[300px]">
                    <p className="font-bold uppercase text-lg">{officerName}</p>
                    <p className="text-sm">Punong Barangay / Lupon Chairman</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 print:hidden">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handlePrint} disabled={!agreementText} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              <ShieldCheck className="h-4 w-4" />
              {isGenerating ? "Preparing..." : "Print Settlement"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
