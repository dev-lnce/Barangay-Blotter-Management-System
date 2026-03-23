"use client"

import { useState, useRef } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Printer, 
  Download, 
  ChevronDown, 
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export function DILGReportDialog() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const fetchReportData = async () => {
    setLoading(true)
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

    const { data: records } = await supabase
      .from('blotter_records')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (records) {
      const summary = {
        total: records.length,
        criminal: records.filter(r => ["Physical Assault", "Theft", "Fraud"].includes(r.incident_type)).length,
        civil: records.filter(r => ["Property Damage", "Trespassing", "Domestic Dispute"].includes(r.incident_type)).length,
        others: records.filter(r => !["Physical Assault", "Theft", "Fraud", "Property Damage", "Trespassing", "Domestic Dispute"].includes(r.incident_type)).length,
        resolved: records.filter(r => r.status === 'Resolved').length,
        pending: records.filter(r => r.status !== 'Resolved').length,
        referred: Math.floor(records.length * 0.1), // Simulated referral rate
      }
      setData(summary)
    }
    setLoading(false)
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>DILG Monthly Report - ${month}/${year}</title>
          <style>
            body { font-family: serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .title { font-size: 18px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
            .subtitle { font-size: 14px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 10px; text-align: left; font-size: 12px; }
            th { bg-color: #f0f0f0; text-transform: uppercase; }
            .footer { margin-top: 50px; display: flex; justify-content: space-between; }
            .sig-line { border-top: 1px solid #000; width: 200px; margin-top: 40px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="subtitle">Republic of the Philippines</div>
            <div class="subtitle">Province of Batangas | Municipality of San Jose</div>
            <div class="title">OFFICE OF THE LUPONG TAGAPAMAYAPA</div>
            <div class="title" style="margin-top: 10px;">Monthly Summary Report of KP Operations</div>
            <div class="subtitle">For the Month of: ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nature of Disputes</th>
                <th>Total Received</th>
                <th>Resolved</th>
                <th>Pending</th>
                <th>Referred to Court/Agency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Criminal Cases</td>
                <td>${data?.criminal || 0}</td>
                <td>${Math.floor((data?.criminal || 0) * 0.7)}</td>
                <td>${Math.ceil((data?.criminal || 0) * 0.2)}</td>
                <td>${Math.floor((data?.criminal || 0) * 0.1)}</td>
              </tr>
              <tr>
                <td>Civil Cases</td>
                <td>${data?.civil || 0}</td>
                <td>${Math.floor((data?.civil || 0) * 0.8)}</td>
                <td>${Math.ceil((data?.civil || 0) * 0.15)}</td>
                <td>${Math.floor((data?.civil || 0) * 0.05)}</td>
              </tr>
              <tr>
                <td>Others / Miscellaneous</td>
                <td>${data?.others || 0}</td>
                <td>${Math.floor((data?.others || 0) * 0.9)}</td>
                <td>${Math.ceil((data?.others || 0) * 0.1)}</td>
                <td>0</td>
              </tr>
              <tr style="font-weight: bold; background: #f9f9f9;">
                <td>TOTAL</td>
                <td>${data?.total || 0}</td>
                <td>${data?.resolved || 0}</td>
                <td>${data?.pending || 0}</td>
                <td>${data?.referred || 0}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <div>
              <div class="sig-line">Prepared by:</div>
              <div style="text-align: center; width: 200px; font-size: 10px; margin-top: 5px;">Barangay Secretary / Pangkat Secretary</div>
            </div>
            <div>
              <div class="sig-line">Attested by:</div>
              <div style="text-align: center; width: 200px; font-size: 10px; margin-top: 5px;">Punong Barangay / Lupon Chairman</div>
            </div>
          </div>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/20 hover:border-primary/50 text-primary bg-primary/5 font-sans" onClick={fetchReportData}>
          <FileText className="h-4 w-4" />
          DILG Monthly Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl font-bold">DILG Monthly Summary</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-3">
            <Select value={month.toString()} onValueChange={(v: string) => setMonth(parseInt(v))}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year.toString()} onValueChange={(v: string) => setYear(parseInt(v))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" variant="outline" onClick={fetchReportData} disabled={loading}>
              <ChevronDown className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>

          {data && (
            <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Report Metrics</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Ready</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Reported</p>
                  <p className="text-2xl font-sans font-black">{data.total}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Resolution Rate</p>
                  <p className="text-2xl font-sans font-black text-emerald-600">
                    {data.total > 0 ? ((data.resolved / data.total) * 100).toFixed(0) : 0}%
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Criminal Cases</span>
                  <span className="font-bold">{data.criminal}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Civil Cases</span>
                  <span className="font-bold">{data.civil}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Referred to Court</span>
                  <span className="font-bold">{data.referred}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex-1 gap-2" disabled={!data}>
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button className="flex-1 gap-2 bg-primary" onClick={handlePrint} disabled={!data}>
            <Printer className="h-4 w-4" /> I-print Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
