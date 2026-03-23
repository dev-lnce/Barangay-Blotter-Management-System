"use client"

import { useState, useEffect } from "react"
import { Calendar, Layers, Settings2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface HeatmapControlsProps {
  onSeverityChange: (severity: string, checked: boolean) => void
  onClusterToggle: (enabled: boolean) => void
  severities: { high: boolean; medium: boolean; low: boolean }
  clusteringEnabled: boolean
  onDateChange?: (start?: Date, end?: Date) => void
}

export function HeatmapControls({
  onSeverityChange,
  onClusterToggle,
  severities,
  clusteringEnabled,
  onDateChange,
}: HeatmapControlsProps) {
  const [timePreset, setTimePreset] = useState("30d") // Default to 30 days

  // Compute and emit date range when preset changes
  useEffect(() => {
    const end = new Date()
    let start: Date | undefined
    
    if (timePreset === "7d") {
      start = new Date()
      start.setDate(end.getDate() - 7)
    } else if (timePreset === "30d") {
      start = new Date()
      start.setDate(end.getDate() - 30)
    } else if (timePreset === "6m") {
      start = new Date()
      start.setMonth(end.getMonth() - 6)
    }
    
    // Only call if onDateChange is provided
    if (onDateChange) {
      onDateChange(start, start ? end : undefined)
    }
  }, [timePreset])

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings2 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground font-sans">Map Controls</h2>
      </div>

      {/* Date Range */}
      <Card className="border-border/60 shadow-none bg-card">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2 font-sans">
            <Calendar className="h-3.5 w-3.5" />
            Time Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-1.5">
            <Select value={timePreset} onValueChange={setTimePreset}>
              <SelectTrigger className="w-full text-sm font-sans h-9">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Severity Filters */}
      <Card className="border-border/60 shadow-none bg-card">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2 font-sans">
            <Layers className="h-3.5 w-3.5" />
            Severity Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="high"
              checked={severities.high}
              onCheckedChange={(checked) => onSeverityChange("high", checked as boolean)}
            />
            <Label htmlFor="high" className="flex items-center gap-2 text-sm font-sans cursor-pointer">
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.577_0.245_27.325)]" />
              High Risk
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="medium"
              checked={severities.medium}
              onCheckedChange={(checked) => onSeverityChange("medium", checked as boolean)}
            />
            <Label htmlFor="medium" className="flex items-center gap-2 text-sm font-sans cursor-pointer">
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.18_75)]" />
              Medium Risk
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="low"
              checked={severities.low}
              onCheckedChange={(checked) => onSeverityChange("low", checked as boolean)}
            />
            <Label htmlFor="low" className="flex items-center gap-2 text-sm font-sans cursor-pointer">
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.6_0.16_155)]" />
              Low Risk
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Clustering Toggle */}
      <Card className="border-border/60 shadow-none bg-card">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">
            AI Clustering
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dbscan" className="text-sm font-sans flex flex-col gap-1">
              <span className="font-medium text-foreground">Enable DBSCAN</span>
              <span className="text-xs text-muted-foreground font-normal">
                Groups nearby incidents
              </span>
            </Label>
            <Switch
              id="dbscan"
              checked={clusteringEnabled}
              onCheckedChange={onClusterToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-border/60 shadow-none bg-card mt-auto">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide font-sans">
            Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
            <span className="h-3 w-3 rounded-full border-2 border-[oklch(0.577_0.245_27.325)] bg-[oklch(0.577_0.245_27.325)]/30" />
            Single incident marker
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
            <span className="h-5 w-5 rounded-full bg-[oklch(0.65_0.22_30)]/40 border border-[oklch(0.65_0.22_30)] flex items-center justify-center text-[8px] font-bold text-[oklch(0.35_0.15_30)]">
              5
            </span>
            Cluster marker
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
