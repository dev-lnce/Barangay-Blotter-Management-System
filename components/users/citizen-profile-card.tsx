"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  User, 
  ShieldAlert, 
  History, 
  ChevronRight, 
  AlertCircle,
  BabyIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CitizenProfileCardProps {
  name: string
  age?: number
  gender?: string
  complainantCount: number
  respondentCount: number
  isPoi?: boolean
  cases: any[]
  onViewDetails?: () => void
}

export function CitizenProfileCard({
  name,
  age,
  gender,
  complainantCount,
  respondentCount,
  isPoi = false,
  cases,
  onViewDetails
}: CitizenProfileCardProps) {
  const isMinor = age && age < 18
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  
  // High risk if respondent count > 2
  const isHighRisk = respondentCount > 2 || isPoi

  return (
    <Card className="group relative overflow-hidden border border-border/50 bg-white transition-all hover:shadow-md hover:border-primary/30">
      {/* Risk Indicator Strip */}
      {isHighRisk && (
        <div className="absolute top-0 left-0 w-full h-1 bg-destructive/60" />
      )}

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-xs font-black font-sans shadow-inner border border-border/40",
              isHighRisk ? "bg-destructive/5 text-destructive" : "bg-primary/5 text-primary"
            )}>
              {initials}
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {isMinor ? <span className="blur-sm select-none opacity-40">Name Protected</span> : name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-wider">
                  {gender || "N/A"} • {age || "N/A"} YRS
                </span>
                {isMinor && (
                  <Badge variant="outline" className="h-4 px-1.5 text-[8px] bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-widest font-black flex items-center gap-1">
                    <BabyIcon className="h-2 w-2" /> Minor
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {isHighRisk && (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] uppercase tracking-[0.15em] font-black flex gap-1 items-center animate-pulse">
              <ShieldAlert className="h-2.5 w-2.5" /> POI
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-muted/30 rounded-lg p-2.5 border border-border/30">
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Nagrereklamo</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-sans font-black text-foreground">{complainantCount}</span>
              <span className="text-[9px] text-muted-foreground font-sans">Kaso</span>
            </div>
          </div>
          <div className={cn(
            "rounded-lg p-2.5 border",
            respondentCount > 0 ? "bg-destructive/5 border-destructive/10" : "bg-muted/30 border-border/30"
          )}>
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Inirereklamo</p>
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-lg font-sans font-black",
                respondentCount > 0 ? "text-destructive" : "text-foreground"
              )}>{respondentCount}</span>
              <span className="text-[9px] text-muted-foreground font-sans">Kaso</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-border/50 pt-4">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <History className="h-2.5 w-2.5" /> Recent Involvement
          </p>
          <div className="space-y-1.5 overflow-hidden">
            {cases.slice(0, 2).map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-muted/40 group/item transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full flex-shrink-0",
                    c.role === "Complainant" ? "bg-emerald-500" : "bg-destructive"
                  )} />
                  <span className="truncate font-medium text-foreground/80 font-sans">{c.type}</span>
                </div>
                <span className="text-[9px] text-muted-foreground font-mono shrink-0">
                  {new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
            {cases.length === 0 && (
              <p className="text-[10px] text-muted-foreground italic font-sans py-1">No active records available.</p>
            )}
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3 h-7 text-[9px] uppercase font-black tracking-widest gap-2 bg-transparent border-border/60 hover:bg-primary hover:text-primary-foreground group-hover:border-primary/20"
          onClick={onViewDetails}
        >
          Full Profile
          <ChevronRight className="h-2.5 w-2.5" />
        </Button>
      </CardContent>
    </Card>
  )
}
