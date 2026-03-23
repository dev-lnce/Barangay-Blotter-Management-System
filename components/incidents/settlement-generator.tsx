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
          <DialogTitle className="font-sans text-2xl text-foreground">Barangay Settlement</DialogTitle>
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
          <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-0 text-black font-sans">
            <div className="print-container">
              <div className="text-center mb-8 pb-4 border-b-2 border-black">
                <p className="text-sm uppercase tracking-[0.2em] font-bold">Republic of the Philippines</p>
                <p className="text-sm uppercase tracking-[0.2em] font-bold">Province of Batangas</p>
                <p className="text-sm uppercase tracking-[0.2em] font-bold">Municipality of San Jose</p>
                <div className="mt-6">
                  <h1 className="text-2xl font-black uppercase tracking-widest">LUPONG TAGAPAMAYAPA</h1>
                  <p className="text-lg italic mt-1">Barangay Banay-Banay II</p>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-3xl font-black text-center mb-12 tracking-[0.3em] underline underline-offset-8 decoration-2">KASUNDUANG PAG-AAYOS</h2>
                
                <div className="grid grid-cols-2 gap-12 mb-10 text-base">
                  <div className="space-y-2">
                    <p><span className="font-bold uppercase text-xs tracking-wider text-gray-600 block">Nagrereklamo (Complainant):</span> <span className="text-lg font-bold">{record.complainant}</span></p>
                    <p><span className="font-bold uppercase text-xs tracking-wider text-gray-600 block">Inirereklamo (Respondent):</span> <span className="text-lg font-bold">{record.respondent_name || "______________________"}</span></p>
                  </div>
                  <div className="text-right space-y-2">
                    <p><span className="font-bold uppercase text-xs tracking-wider text-gray-600 block">Blotter Case No:</span> <span className="text-lg font-mono font-bold">{record.id}</span></p>
                    <p><span className="font-bold uppercase text-xs tracking-wider text-gray-600 block">Incident Type:</span> <span className="text-lg font-bold">{record.incidentType}</span></p>
                  </div>
                </div>

                <div className="mt-16 relative">
                  <div className="absolute -top-4 left-0 bg-white px-2">
                    <span className="font-bold uppercase text-xs tracking-widest text-gray-500 italic">Salaysay ng Kasunduan (Agreement Narrative)</span>
                  </div>
                  <div className="border border-black p-8 text-justify leading-loose text-lg min-h-[300px]">
                    <p className="whitespace-pre-wrap">{agreementText}</p>
                  </div>
                </div>

                <div className="mt-12 text-justify leading-relaxed text-base italic text-gray-800">
                  <p>
                    Nangangako kami na tutuparin nang buong katapatan ang mga nakasaad sa itaas na kasunduan. Kung sinuman sa amin ang hindi tumupad, ang kabilang panig ay maaaring dumulog sa mga kinauukulan upang ipatupad ang kasunduang ito alinsunod sa batas.
                  </p>
                  <p className="mt-6 not-italic font-bold">
                    Nilagdaan ngayong ika-{new Date().getDate()} ng {new Date().toLocaleString('default', { month: 'long' })}, {new Date().getFullYear()}.
                  </p>
                </div>

                <div className="flex justify-between mt-24 text-center">
                  <div className="w-[200px]">
                    <div className="border-b-2 border-black mb-2"></div>
                    <p className="font-bold text-lg uppercase tracking-wider">{record.complainant}</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-1">Nagrereklamo</p>
                  </div>
                  <div className="w-[200px]">
                    <div className="border-b-2 border-black mb-2"></div>
                    <p className="font-bold text-lg uppercase tracking-wider">{record.respondent_name || "______________________"}</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-1">Inirereklamo</p>
                  </div>
                </div>

                <div className="mt-32 text-center">
                  <p className="mb-16 font-bold italic text-gray-600">Pinatutunayan:</p>
                  <div className="inline-block text-center border-t-2 border-black pt-2 min-w-[350px]">
                    <p className="font-black uppercase text-xl tracking-widest">{officerName}</p>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 mt-1">Punong Barangay / Lupon Chairman</p>
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
