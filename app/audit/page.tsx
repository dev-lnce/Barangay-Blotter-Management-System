import { Sidebar } from "@/components/dashboard/sidebar"
import { TopHeader } from "@/components/dashboard/top-header"
import { AuditLogTable } from "@/components/audit/audit-log-table"

export default function AuditPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-60 font-sans">
        <TopHeader />
        <main className="p-8 space-y-8">
          {/* Page Header */}
          <div className="border-b border-border pb-6">
            <h1 className="text-3xl font-black text-foreground font-sans tracking-tight">
              Audit ng Sistema
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-2 font-bold">
              Subaybayan ang lahat ng aktibidad ng system para sa seguridad.
            </p>
          </div>

          {/* Audit Log Table */}
          <AuditLogTable />
        </main>
      </div>
    </div>
  )
}
