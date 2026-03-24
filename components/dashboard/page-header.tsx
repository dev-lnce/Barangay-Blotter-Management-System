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

interface PageHeaderProps {
  title: string
  subtitle?: string
  showSearch?: boolean
}

export function PageHeader({ title, subtitle, showSearch = true }: PageHeaderProps) {
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
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-black/[0.06] bg-white/80 backdrop-blur-md px-6">
      {/* Left: page title */}
      <div>
        <h1 className="text-sm font-bold text-[#191c1e] font-sans">{title}</h1>
        {subtitle && (
          <p className="text-[10px] text-[#44474e] uppercase tracking-[0.15em] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Center & Right container */}
      <div className="flex items-center gap-3">
        {/* Search */}
        {showSearch && (
          <div className="relative hidden md:block mr-2">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search incidents, IDs..."
              className="w-64 pl-9 pr-4 h-9 text-sm bg-[#f2f4f6] border-0 rounded-lg focus-visible:ring-2 focus-visible:ring-[#002576]/20 font-sans"
            />
          </div>
        )}

        {/* Bell */}
        <NotificationCenter />

        {/* Logout */}
        <form action={signOut}>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" type="submit">
            <LogOut className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Sign out</span>
          </Button>
        </form>

        {/* Divider & Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-black/[0.06]">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={profile?.full_name || 'Admin user'} />
            <AvatarFallback className="bg-[#002576] text-white text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-[#191c1e] font-sans leading-none">{displayName}</p>
            <p className="text-[10px] text-[#44474e] font-sans mt-0.5">{roleName}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
