import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const incidents: any[] = [];

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold font-sans uppercase tracking-wide",
        severity === "High"
          ? "bg-red-50 text-red-600 border border-red-200"
          : severity === "Medium"
          ? "bg-amber-50 text-amber-600 border border-amber-200"
          : "bg-green-50 text-green-600 border border-green-200"
      )}
    >
      {severity}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant={status === "Resolved" ? "secondary" : "outline"}
      className={cn(
        "text-[10px] font-medium font-sans",
        status === "Resolved"
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
          : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-50"
      )}
    >
      {status}
    </Badge>
  )
}

export function RecentIncidentsTable() {
  return (
    <Card className="shadow-sm border-border h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground font-sans">
              Recent Incident Reports
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
              Latest 7 filed blotter entries
            </CardDescription>
          </div>
          <span className="text-xs text-primary font-medium font-sans cursor-pointer hover:underline underline-offset-2">
            View all
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide font-sans whitespace-nowrap">
                Incident ID
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide font-sans whitespace-nowrap">
                Date
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide font-sans whitespace-nowrap">
                Category
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide font-sans whitespace-nowrap">
                Severity
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide font-sans whitespace-nowrap">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((inc) => (
              <TableRow key={inc.id} className="border-border hover:bg-muted/40 cursor-pointer">
                <TableCell className="text-xs font-mono text-foreground py-2.5 whitespace-nowrap">
                  {inc.id}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-sans py-2.5 whitespace-nowrap">
                  {inc.date}
                </TableCell>
                <TableCell className="text-xs text-foreground font-sans py-2.5 whitespace-nowrap">
                  {inc.category}
                </TableCell>
                <TableCell className="py-2.5">
                  <SeverityBadge severity={inc.severity} />
                </TableCell>
                <TableCell className="py-2.5">
                  <StatusBadge status={inc.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
