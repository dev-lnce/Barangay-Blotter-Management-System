import { Sidebar } from "@/components/dashboard/sidebar"
import { TopHeader } from "@/components/dashboard/top-header"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { ReportsLineChart } from "@/components/dashboard/reports-line-chart"
import { IncidentTypeBarChart } from "@/components/dashboard/incident-type-bar-chart"
import { HeatMapPlaceholder } from "@/components/dashboard/heat-map-placeholder"
import { RecentIncidentsTable } from "@/components/dashboard/recent-incidents-table"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main content — offset for sidebar width */}
      <div className="flex flex-1 flex-col pl-60">
        {/* Sticky Top Header */}
        <TopHeader />

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
          {/* 1. KPI Cards */}
          <KpiCards />

          {/* 2. Charts Row */}
          <section
            className="grid grid-cols-1 gap-4 lg:grid-cols-3"
            aria-label="Charts and analytics"
          >
            {/* Line chart — takes 2 of 3 cols */}
            <div className="lg:col-span-2 flex flex-col">
              <ReportsLineChart />
            </div>
            {/* Bar chart — takes 1 of 3 cols */}
            <div className="flex flex-col">
              <IncidentTypeBarChart />
            </div>
          </section>

          {/* 3. Bottom Row — Heat Map + Table */}
          <section
            className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            aria-label="Map and incident records"
          >
            <HeatMapPlaceholder />
            <RecentIncidentsTable />
          </section>
        </main>
      </div>
    </div>
  )
}
