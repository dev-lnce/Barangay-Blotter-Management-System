import { Sidebar } from "@/components/dashboard/sidebar"
import { TopHeader } from "@/components/dashboard/top-header"
import { UsersTable } from "@/components/users/users-table"

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-60">
        <TopHeader />
        <main className="flex-1 p-6 pt-4">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground font-sans">
              User Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage system access for barangay officials and staff members.
            </p>
          </div>

          {/* Users Table */}
          <UsersTable />
        </main>
      </div>
    </div>
  )
}
