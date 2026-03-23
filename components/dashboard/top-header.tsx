"use client"

import { useEffect, useState } from "react"
import { Search, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { createSupabaseBrowser } from "@/lib/supabase-browser"
import { signOut } from "@/lib/auth-actions"
import { NotificationCenter } from "@/components/dashboard/notification-center"

interface UserProfile {
  full_name: string
  role: string
}

export function TopHeader() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createSupabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single()
        if (data) setProfile(data)
      }
    }
    loadProfile()
  }, [])

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).slice(0, 2).join('')
    : 'JR'

  const displayName = profile?.full_name
    ? profile.full_name.split(' ').map((n, i, arr) =>
        i === arr.length - 1 ? n[0] + '.' : n
      ).slice(0, 2).join(' ')
    : 'User'

  const roleName = profile?.role || 'Barangay Admin'

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/60 backdrop-blur-md px-6 shadow-sm">
      {/* Left: page title */}
      <div>
        <h1 className="text-sm font-bold text-foreground font-sans tracking-tight uppercase">Dashboard Overview</h1>
        <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Barangay Banay-banay — March 2026</p>
      </div>

      {/* Right: search + bell + avatar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search incidents, IDs..."
            className="w-56 pl-9 h-9 text-sm bg-muted/50 border-border rounded-lg font-sans"
          />
        </div>



        <NotificationCenter />

        {/* Logout */}
        <form action={signOut}>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" type="submit">
            <LogOut className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Sign out</span>
          </Button>
        </form>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-1 border-l border-border">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={profile?.full_name || 'Admin user'} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-foreground font-sans leading-none">{displayName}</p>
            <p className="text-[10px] text-muted-foreground font-sans mt-0.5">{roleName}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
