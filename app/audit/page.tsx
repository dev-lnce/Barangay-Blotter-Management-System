import { Sidebar } from "@/components/dashboard/sidebar"
import { TopHeader } from "@/components/dashboard/top-header"
import { AuditLogTable } from "@/components/audit/audit-log-table"

export default function AuditPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-60">
        <TopHeader />
        <main className="px-6 py-6 pt-22">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground font-sans">
              System Audit Log
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and monitor all system activities for compliance and security auditing.
            </p>
          </div>

          {/* Audit Log Table */}
          <AuditLogTable />
        </main>
      </div>
    </div>
  )
}
