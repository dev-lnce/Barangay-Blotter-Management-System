import { Sidebar } from "@/components/dashboard/sidebar"
import { PageHeader } from "@/components/dashboard/page-header"
import { BlotterTable } from "@/components/incidents/blotter-table"

export default function IncidentsPage() {
  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main content — offset for sidebar width */}
      <div className="flex flex-1 flex-col pl-60">
        {/* Sticky Top Header */}
        <PageHeader title="Incident Records" subtitle="Blotter Management" />

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
          <BlotterTable />
        </main>
      </div>
    </div>
  )
}
