import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { SessionTimeout } from "@/components/auth/session-timeout"
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-playfair' 
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter' 
});

export const metadata: Metadata = {
  title: 'BarangayBlotter — Admin Dashboard',
  description: 'Automated Barangay Blotter Management System — monitor, track, and analyze incident reports.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <SessionTimeout />
        <Analytics />
      </body>
    </html>
  )
}
