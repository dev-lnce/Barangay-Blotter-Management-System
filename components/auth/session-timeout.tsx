"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-actions"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Timer, AlertTriangle } from "lucide-react"

const TIMEOUT_DURATION = 30 * 60 * 1000 // 30 minutes
const WARNING_DURATION = 1 * 60 * 1000    // 1 minute

export function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(WARNING_DURATION / 1000)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()

  const resetTimers = () => {
    // Clear everything
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    
    setShowWarning(false)
    setTimeLeft(WARNING_DURATION / 1000)

    // Set new warning timer
    warningRef.current = setTimeout(() => {
      setShowWarning(true)
      startCountdown()
    }, TIMEOUT_DURATION - WARNING_DURATION)

    // Set new logout timer
    timeoutRef.current = setTimeout(() => {
      handleLogout()
    }, TIMEOUT_DURATION)
  }

  const startCountdown = () => {
    countdownRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const handleStayLoggedIn = () => {
    resetTimers()
  }

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"]
    
    const activityHandler = () => {
      if (!showWarning) {
        resetTimers()
      }
    }

    events.forEach(event => window.addEventListener(event, activityHandler))
    resetTimers()

    return () => {
      events.forEach(event => window.removeEventListener(event, activityHandler))
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [showWarning])

  return (
    <Dialog open={showWarning} onOpenChange={(open) => !open && handleStayLoggedIn()}>
      <DialogContent className="sm:max-w-md border-destructive/20 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-destructive animate-pulse" />
          </div>
          <DialogTitle className="font-serif text-xl font-bold">Session Timeout Warning</DialogTitle>
          <DialogDescription className="text-sm font-sans mt-2">
            Inalerto ka ng system dahil matagal kang hindi aktibo. 
            Malo-log out ka sa loob ng <span className="font-bold text-destructive font-mono">{timeLeft}</span> segundo.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" className="flex-1 font-sans" onClick={handleLogout}>
            Mag-logout
          </Button>
          <Button className="flex-1 font-sans bg-primary hover:bg-primary/90" onClick={handleStayLoggedIn}>
            Manatiling Naka-log in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
