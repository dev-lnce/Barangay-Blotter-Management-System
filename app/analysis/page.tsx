"use client"

import { useRef, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopHeader } from "@/components/dashboard/top-header"
import { MonthlyTrendsChart } from "@/components/analytics/monthly-trends-chart"
import { ResolutionDurationChart } from "@/components/analytics/resolution-duration-chart"
import { ResolutionStatusDonut } from "@/components/analytics/resolution-status-donut"
import { LocationCorrelationChart } from "@/components/analytics/location-correlation-chart"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"

export default function AnalysisPage() {
  const reportRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    if (!reportRef.current) return
    setIsExporting(true)

    try {
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      // Capture the charts area
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      // Create PDF in landscape A4
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Add header
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("Barangay Banay-banay — Analytics Report", pdfWidth / 2, 15, { align: "center" })

      pdf.setFontSize(9)
      pdf.setFont("helvetica", "normal")
      pdf.text(
        `Generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}`,
        pdfWidth / 2,
        22,
        { align: "center" },
      )

      // Add a line separator
      pdf.setDrawColor(200, 200, 200)
      pdf.line(14, 25, pdfWidth - 14, 25)

      // Scale image to fit the page (with margins)
      const margin = 14
      const availableWidth = pdfWidth - margin * 2
      const availableHeight = pdfHeight - 35 - margin // 35 = header space
      const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight)
      const scaledW = imgWidth * ratio
      const scaledH = imgHeight * ratio

      pdf.addImage(imgData, "PNG", margin, 30, scaledW, scaledH)

      // Footer
      pdf.setFontSize(7)
      pdf.setTextColor(150, 150, 150)
      pdf.text(
        "Barangay Blotter Management System • Confidential",
        pdfWidth / 2,
        pdfHeight - 8,
        { align: "center" },
      )

      pdf.save("Banay-Banay-Analytics-Report.pdf")
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-60">
        <TopHeader />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground font-sans">
                Advanced Analytics
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground font-sans">
                Comprehensive insights into blotter trends, resolution metrics, and location patterns
              </p>
            </div>
            <Button
              className="gap-2 font-sans"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting…
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  Export Report (PDF)
                </>
              )}
            </Button>
          </div>

          {/* Charts Grid — captured for PDF */}
          <div ref={reportRef} className="space-y-6">
            {/* Top Row - Monthly Trends */}
            <MonthlyTrendsChart />

            {/* Middle Row - Resolution Metrics */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ResolutionDurationChart />
              <ResolutionStatusDonut />
            </div>

            {/* Bottom Row - Location Correlation */}
            <LocationCorrelationChart />
          </div>
        </main>
      </div>
    </div>
  )
}
