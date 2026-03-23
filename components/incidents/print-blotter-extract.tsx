"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Printer, FileBadge2 } from "lucide-react"

interface PrintBlotterExtractProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: {
    id: string
    complainant: string
    incidentType: string
    location: string
    narrative: string
    status: string
    dateReported: string
    incidentDate?: string
  } | null
}

export function PrintBlotterExtract({ open, onOpenChange, record }: PrintBlotterExtractProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const [isCertified, setIsCertified] = useState(false)

  if (!record) return null

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open("", "_blank", "width=850,height=1100")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Blotter Extract - ${record.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap');
          
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none; }
          }
          
          body {
            font-family: 'Merriweather', 'SF Serif', Georgia, serif;
            color: #000;
            background: #fff;
            margin: 0;
            padding: 0;
            line-height: 1.5;
          }

          .print-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 25mm;
            box-sizing: border-box;
            position: relative;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 40px;
          }

          .republic {
            font-size: 14px;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 2px;
          }

          .office {
            margin-top: 15px;
            font-size: 20px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 3px;
          }

          .title {
            text-align: center;
            font-size: 24px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin: 40px 0;
            text-decoration: underline;
            text-underline-offset: 8px;
          }

          .meta-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 40px;
            margin-bottom: 30px;
          }

          .label {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            color: #555;
            display: block;
            margin-bottom: 4px;
          }

          .value {
            font-size: 16px;
            font-weight: 700;
          }

          .section {
            margin-top: 40px;
          }

          .section-title {
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }

          .narrative-box {
            border: 1.5px solid #000;
            padding: 25px;
            font-size: 15px;
            text-align: justify;
            line-height: 1.8;
            min-height: 250px;
            white-space: pre-wrap;
          }

          .footer {
            margin-top: 60px;
          }

          .certification {
            font-size: 14px;
            text-align: justify;
            font-style: italic;
            margin-bottom: 80px;
          }

          .sig-row {
            display: flex;
            justify-content: space-between;
          }

          .sig-block {
            text-align: center;
            width: 250px;
          }

          .sig-line {
            border-top: 2px solid #000;
            padding-top: 5px;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .sig-sub {
            font-size: 11px;
            font-weight: 700;
            color: #444;
          }

          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(0, 0, 0, 0.05);
            z-index: -1;
            white-space: nowrap;
            pointer-events: none;
            font-weight: 900;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${isCertified ? '<div class="watermark">CERTIFIED TRUE COPY</div>' : ''}
          <div class="header">
            <div class="republic">Republic of the Philippines</div>
            <div class="republic">Province of Batangas</div>
            <div class="republic">Municipality of San Jose</div>
            <div class="office">Office of the Punong Barangay</div>
            <div style="font-size: 14px; italic">Barangay Banay-Banay II</div>
          </div>

          <div class="title">${isCertified ? "Certified Blotter Extract" : "Blotter Extract"}</div>

          <div class="meta-grid">
            <div>
              <span class="label">Blotter No.</span>
              <span class="value">${record.id}</span>
            </div>
            <div style="text-align: right">
              <span class="label">Status</span>
              <span class="value" style="border: 1px solid #000; padding: 2px 10px; text-transform: uppercase">${record.status}</span>
            </div>
          </div>

          <div class="meta-grid">
            <div>
              <span class="label">Date Reported</span>
              <span class="value">${new Date(record.dateReported).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
            <div style="text-align: right">
              <span class="label">Date of Incident</span>
              <span class="value">${record.incidentDate ? new Date(record.incidentDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Parties & Location</div>
            <div class="meta-grid">
               <div>
                  <span class="label">Complainant</span>
                  <span class="value">${record.complainant}</span>
               </div>
               <div style="text-align: right">
                  <span class="label">Location</span>
                  <span class="value">${record.location}</span>
               </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Case Narrative</div>
            <div class="narrative-box">${record.narrative || "No narrative provided."}</div>
          </div>

          <div class="footer">
            <div class="certification">
              This is to certify that the above information is a true and faithful extract from the
              Official Barangay Blotter of Barangay Banay-Banay II, Municipality of San Jose,
              Province of Batangas, maintained under my custody.
            </div>

            <div class="sig-row">
              <div class="sig-block">
                <div class="sig-line" style="border-top: 0"></div>
                <div class="sig-sub"></div>
              </div>
              <div class="sig-block">
                <div class="sig-line">Punong Barangay</div>
                <div class="sig-sub">Authorized Officer</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    // Slight delay to ensure content is rendered
    setTimeout(() => {
      printWindow.print()
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold text-foreground font-sans flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            Blotter Extract Preview — {record.id}
          </DialogTitle>
        </DialogHeader>

        {/* Preview of the printable content */}
        <div ref={printRef} className="px-6 py-4 space-y-4 text-sm">
          <div className="text-center border-b-2 border-double border-foreground pb-3">
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Republic of the Philippines</p>
            <p className="text-[10px] text-muted-foreground">Province of Batangas • Municipality of San Jose</p>
            <p className="text-base font-bold uppercase tracking-wide mt-1">Barangay Banay-banay</p>
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-muted-foreground">Office of the Barangay</p>
          </div>

          <h2 className="text-center text-sm font-bold uppercase tracking-widest underline mt-4">
            {isCertified ? <span className="text-emerald-700">Certified True Copy of Blotter Extract</span> : "Blotter Extract"}
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs mt-4">
            <div>
              <p><span className="font-semibold">Blotter No.:</span> {record.id}</p>
              <p><span className="font-semibold">Status:</span> {record.status}</p>
            </div>
            <div className="text-right">
              <p><span className="font-semibold">Date Reported:</span> {new Date(record.dateReported).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              <p><span className="font-semibold">Date of Incident:</span> {record.incidentDate ? new Date(record.incidentDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase border-b pb-1 mb-2">Parties Involved</h3>
            <p className="text-xs"><span className="font-semibold">Complainant:</span> {record.complainant}</p>
            <p className="text-xs"><span className="font-semibold">Incident Type:</span> {record.incidentType}</p>
            <p className="text-xs"><span className="font-semibold">Location:</span> {record.location}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase border-b pb-1 mb-2">Incident Narrative</h3>
            <div className="border rounded p-3 text-xs leading-relaxed whitespace-pre-wrap bg-muted/20">
              {record.narrative || "No narrative provided."}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 p-2 rounded-lg border border-emerald-200">
            <Switch id="certified" checked={isCertified} onCheckedChange={setIsCertified} />
            <Label htmlFor="certified" className="text-xs font-semibold cursor-pointer flex items-center gap-1.5 uppercase tracking-wider">
              <FileBadge2 className="h-4 w-4" />
              Certified True Copy
            </Label>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handlePrint} className="gap-2 flex-1 sm:flex-none">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
