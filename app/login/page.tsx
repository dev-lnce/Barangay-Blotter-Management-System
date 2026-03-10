"use client"

import { useState } from "react"
import Image from "next/image"
import { Shield, Eye, EyeOff, Lock, IdCard, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [idNumber, setIdNumber] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, oklch(0.18 0.04 258) 0%, oklch(0.25 0.06 258) 45%, oklch(0.35 0.10 258) 100%)",
        }}
      >
        {/* Subtle geometric grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 48px, oklch(0.9 0.01 250) 48px, oklch(0.9 0.01 250) 49px), repeating-linear-gradient(90deg, transparent, transparent 48px, oklch(0.9 0.01 250) 48px, oklch(0.9 0.01 250) 49px)",
          }}
        />

        {/* Decorative large circle accent — bottom right */}
        <div
          className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full opacity-[0.07]"
          style={{ background: "oklch(0.9 0.01 250)" }}
        />
        {/* Decorative smaller circle accent — top left */}
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-[0.05]"
          style={{ background: "oklch(0.9 0.01 250)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full px-12 py-10">
          {/* Top — Republic header */}
          <div className="flex items-center gap-3">
            <div
              className="w-1.5 h-7 rounded-full"
              style={{ background: "oklch(0.78 0.18 75)" }}
            />
            <span
              className="text-xs font-semibold tracking-[0.18em] uppercase"
              style={{ color: "oklch(0.75 0.04 250)" }}
            >
              Republic of the Philippines
            </span>
          </div>

          {/* Center — Seal + branding */}
          <div className="flex flex-col items-center text-center gap-7">
            {/* Seal ring */}
            <div
              className="relative w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 75) 0%, oklch(0.68 0.15 65) 100%)",
                boxShadow: "0 0 0 6px oklch(0.78 0.18 75 / 0.18), 0 20px 48px oklch(0.1 0.04 258 / 0.5)",
              }}
            >
              <div
                className="w-[126px] h-[126px] rounded-full overflow-hidden"
                style={{ border: "3px solid oklch(0.78 0.18 75 / 0.6)" }}
              >
                <Image
                  src="/brgy-seal.jpg"
                  alt="Official seal of Barangay Banay-Banay 2nd"
                  width={126}
                  height={126}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            <div className="space-y-2">
              <p
                className="text-xs font-semibold tracking-[0.15em] uppercase"
                style={{ color: "oklch(0.65 0.08 255)" }}
              >
                Brgy. Banay-Banay 2nd &bull; Dasmariñas City
              </p>
              <h1
                className="text-3xl font-bold leading-tight text-balance"
                style={{ color: "oklch(0.97 0.004 247)" }}
              >
                Barangay Blotter
                <br />
                Management System
              </h1>
              <p
                className="text-sm leading-relaxed mt-1"
                style={{ color: "oklch(0.68 0.04 250)" }}
              >
                Centralized digital platform for incident recording,
                <br />
                case tracking, and community safety analytics.
              </p>
            </div>

            {/* Authorized Personnel badge */}
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
              style={{
                background: "oklch(0.577 0.245 27.325 / 0.12)",
                border: "1px solid oklch(0.577 0.245 27.325 / 0.35)",
              }}
            >
              <Shield
                className="w-3.5 h-3.5"
                style={{ color: "oklch(0.75 0.18 27)" }}
              />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "oklch(0.75 0.18 27)" }}
              >
                Authorized Personnel Only
              </span>
            </div>
          </div>

          {/* Bottom — system version */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: "oklch(0.45 0.03 255)" }}
            >
              BBMS v2.1.0
            </span>
            <span
              className="text-xs"
              style={{ color: "oklch(0.45 0.03 255)" }}
            >
              © 2025 Brgy. Banay-Banay 2nd
            </span>
          </div>
        </div>
      </div>

      {/* ── Right panel — login form ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative"
        style={{ background: "oklch(0.97 0.004 247)" }}
      >
        {/* Mobile-only seal header */}
        <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
          <div
            className="w-16 h-16 rounded-full overflow-hidden"
            style={{ boxShadow: "0 4px 16px oklch(0.1 0.04 258 / 0.2)" }}
          >
            <Image
              src="/brgy-seal.jpg"
              alt="Barangay Banay-Banay 2nd seal"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm font-semibold text-foreground text-center text-balance">
            Barangay Blotter Management System
          </p>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-md rounded-2xl bg-card shadow-xl"
          style={{ border: "1px solid oklch(0.9 0.01 250)" }}
        >
          {/* Card header stripe */}
          <div
            className="h-1.5 w-full rounded-t-2xl"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.45 0.18 255) 0%, oklch(0.55 0.18 255) 100%)",
            }}
          />

          <div className="px-8 py-8 space-y-7">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.45 0.18 255)" }}
                >
                  <Lock className="w-4 h-4" style={{ color: "oklch(0.99 0 0)" }} />
                </div>
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "oklch(0.45 0.18 255)" }}
                >
                  Secure Access Portal
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                Sign in to your account
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter your credentials to access the Blotter Management System.
              </p>
            </div>

            <Separator />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Official ID Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="official-id"
                  className="text-sm font-medium text-foreground"
                >
                  Official ID Number
                </Label>
                <div className="relative">
                  <IdCard
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "oklch(0.52 0.025 255)" }}
                  />
                  <Input
                    id="official-id"
                    type="text"
                    placeholder="e.g. BRY-2024-0042"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className={cn(
                      "pl-10 h-11 bg-background text-foreground placeholder:text-muted-foreground",
                      "focus-visible:ring-2 focus-visible:ring-primary/60 transition-all"
                    )}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "oklch(0.52 0.025 255)" }}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "pl-10 pr-11 h-11 bg-background text-foreground placeholder:text-muted-foreground",
                      "focus-visible:ring-2 focus-visible:ring-primary/60 transition-all"
                    )}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded",
                      "text-muted-foreground hover:text-foreground transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50"
                    )}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading || !idNumber || !password}
                className={cn(
                  "w-full h-11 font-semibold text-sm tracking-wide transition-all duration-200",
                  "hover:opacity-90 hover:shadow-lg active:scale-[0.99]",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                style={{ background: "oklch(0.45 0.18 255)", color: "oklch(0.99 0 0)" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    />
                    Authenticating…
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Secure Login
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </span>
                )}
              </Button>
            </form>

            {/* Security notice */}
            <div
              className="flex items-start gap-2.5 rounded-lg px-4 py-3"
              style={{
                background: "oklch(0.45 0.18 255 / 0.06)",
                border: "1px solid oklch(0.45 0.18 255 / 0.15)",
              }}
            >
              <Shield
                className="w-3.5 h-3.5 mt-0.5 shrink-0"
                style={{ color: "oklch(0.45 0.18 255)" }}
              />
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.45 0.18 255)" }}>
                This system is restricted to authorized Barangay personnel only.
                Unauthorized access attempts are logged and monitored.
              </p>
            </div>

            <Separator />

            {/* Contact link */}
            <p className="text-center text-xs text-muted-foreground">
              Need access?{" "}
              <a
                href="mailto:secretary@banaybanay2.gov.ph"
                className="font-medium underline underline-offset-4 transition-colors hover:text-foreground"
                style={{ color: "oklch(0.45 0.18 255)" }}
              >
                Contact the Brgy. Secretary.
              </a>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-center text-muted-foreground max-w-sm">
          All sessions are encrypted and activity is logged in accordance with
          the Data Privacy Act of 2012 (R.A. 10173).
        </p>
      </div>
    </div>
  )
}
