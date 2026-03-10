"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopHeader } from "@/components/dashboard/top-header"
import { MonthlyTrendsChart } from "@/components/analytics/monthly-trends-chart"
import { ResolutionDurationChart } from "@/components/analytics/resolution-duration-chart"
import { ResolutionStatusDonut } from "@/components/analytics/resolution-status-donut"
import { LocationCorrelationChart } from "@/components/analytics/location-correlation-chart"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

export default function AnalysisPage() {
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
            <Button className="gap-2 font-sans">
              <FileDown className="h-4 w-4" />
              Export Report (PDF)
            </Button>
          </div>

          {/* Charts Grid */}
          <div className="space-y-6">
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
