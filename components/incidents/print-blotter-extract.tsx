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

    const printWindow = window.open("", "_blank", "width=800,height=1000")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Blotter Extract - ${record.id}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20mm; }
          }
          body {
            font-family: 'Times New Roman', Georgia, serif;
            color: #111;
            max-width: 700px;
            margin: 0 auto;
            padding: 40px 30px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px double #333;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .header .republic {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 4px;
          }
          .header .province {
            font-size: 11px;
            margin-bottom: 2px;
          }
          .header .brgy {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 8px 0;
          }
          .header .office {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 3px;
          }
          .title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 24px 0;
            text-decoration: underline;
          }
          .meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 13px;
          }
          .meta-item {
            margin-bottom: 6px;
          }
          .meta-label {
            font-weight: bold;
          }
          .section {
            margin-bottom: 16px;
          }
          .section-title {
            font-weight: bold;
            font-size: 13px;
            text-transform: uppercase;
            border-bottom: 1px solid #999;
            padding-bottom: 4px;
            margin-bottom: 8px;
          }
          .field {
            margin-bottom: 6px;
            font-size: 13px;
          }
          .field-label {
            font-weight: bold;
            display: inline;
          }
          .narrative-box {
            border: 1px solid #ccc;
            padding: 12px 16px;
            font-size: 13px;
            text-align: justify;
            min-height: 100px;
            white-space: pre-wrap;
          }
          .footer {
            margin-top: 50px;
            border-top: 2px solid #333;
            padding-top: 16px;
          }
          .certification {
            font-size: 12px;
            text-align: justify;
            margin-bottom: 40px;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
          }
          .sig-block {
            text-align: center;
            width: 45%;
          }
          .sig-line {
            border-top: 1px solid #333;
            padding-top: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .sig-title {
            font-size: 11px;
            color: #555;
          }
          .status-badge {
            display: inline-block;
            padding: 2px 10px;
            border: 1px solid #333;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 70px;
            color: rgba(220, 38, 38, 0.12); /* Red watermark */
            z-index: -1;
            white-space: nowrap;
            pointer-events: none;
            font-weight: 900;
            font-family: sans-serif;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        ${isCertified ? '<div class="watermark">CERTIFIED TRUE COPY</div>' : ''}
        <div class="header">
          <div class="republic">Republic of the Philippines</div>
          <div class="province">Province of Batangas</div>
          <div class="province">Municipality of San Jose</div>
          <div class="brgy">Barangay Banay-banay</div>
          <div class="office">Office of the Barangay</div>
        </div>

        <div class="title">${isCertified ? "CERTIFIED TRUE COPY OF BLOTTER EXTRACT" : "BLOTTER EXTRACT"}</div>

        <div class="meta">
          <div>
            <div class="meta-item"><span class="meta-label">Blotter No.:</span> ${record.id}</div>
            <div class="meta-item"><span class="meta-label">Status:</span> <span class="status-badge">${record.status}</span></div>
          </div>
          <div>
            <div class="meta-item"><span class="meta-label">Date Reported:</span> ${new Date(record.dateReported).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
            <div class="meta-item"><span class="meta-label">Date of Incident:</span> ${record.incidentDate ? new Date(record.incidentDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Parties Involved</div>
          <div class="field"><span class="field-label">Complainant:</span> ${record.complainant}</div>
          <div class="field"><span class="field-label">Incident Type:</span> ${record.incidentType}</div>
          <div class="field"><span class="field-label">Location:</span> ${record.location}</div>
        </div>

        <div class="section">
          <div class="section-title">Incident Narrative</div>
          <div class="narrative-box">${record.narrative || "No narrative provided."}</div>
        </div>

        <div class="footer">
          <div class="certification">
            This is to certify that the above information is a true and faithful extract from the
            Official Barangay Blotter of Barangay Banay-banay, Municipality of San Jose,
            Province of Batangas.
          </div>

          <div class="signatures">
            <div class="sig-block">
              <div class="sig-line">_________________________</div>
              <div class="sig-title">Requesting Party / Complainant</div>
            </div>
            <div class="sig-block">
              <div class="sig-line">_________________________</div>
              <div class="sig-title">Punong Barangay / Authorized Officer</div>
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
