import type { Metadata } from 'next'
import { Poppins, Montserrat, Inter } from 'next/font/google'
import { SessionTimeout } from "@/components/auth/session-timeout"
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "700", "900"],
  variable: '--font-poppins' 
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: '--font-montserrat' 
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
      <body className={`${inter.variable} ${poppins.variable} ${montserrat.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}>
        {/* Decorative Fluid Accents */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <svg className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] text-primary opacity-[0.03]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M44.7,-76.4C58.3,-69.2,70.1,-59,78.5,-46.3C86.9,-33.5,92,-18.3,91.2,-3.3C90.4,11.7,83.7,26.5,74.5,39.5C65.3,52.5,53.5,63.7,39.7,72.4C25.9,81.1,10.1,87.4,-4.8,91.6C-19.7,95.8,-33.7,97.9,-46.8,93.4C-59.9,88.9,-72,77.7,-80.4,64.2C-88.8,50.7,-93.5,34.8,-94.3,18.9C-95,3,-91.8,-8.7,-86.3,-19.7C-80.8,-30.7,-73,-41,-62.7,-49.4C-52.5,-57.8,-39.8,-64.3,-27.2,-72.1C-14.6,-79.9,-2.1,-89,11.5,-88.4C25.1,-87.8,31.1,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
          <svg className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] text-primary opacity-[0.02]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M38.1,-65.4C50.5,-59.1,62.3,-50.2,70.1,-38.7C77.9,-27.2,81.7,-13.1,81.4,0.7C81.1,14.5,76.6,28,68.9,39.7C61.2,51.4,50.2,61.3,37.3,68.7C24.4,76.1,9.6,81.1,-4.2,84.4C-18,87.7,-30.9,89.3,-43.3,85.1C-55.7,80.9,-67.7,70.9,-75.4,58.5C-83.1,46.1,-86.5,31.3,-87.4,16.5C-88.3,1.7,-86.7,-13.1,-81,-26.6C-75.3,-40.1,-65.5,-52.3,-53.1,-58.6C-40.7,-64.9,-25.7,-65.3,-11.2,-68.8C3.3,-72.3,17.8,-76.7,30.3,-75.9C42.8,-75.1,53.2,-69.1,38.1,-65.4Z" transform="translate(100 100)" />
          </svg>
          <svg className="absolute -bottom-[15%] left-[20%] w-[45%] h-[45%] text-primary opacity-[0.04]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M47.5,-78.2C60.1,-71.4,68,-56.3,73.6,-41.8C79.2,-27.3,82.5,-13.7,83.1,0.3C83.7,14.3,81.6,28.6,75.4,41.7C69.2,54.8,58.9,66.8,46,74.7C33.1,82.6,17.6,86.4,1.8,83.4C-14,80.4,-30.1,70.6,-42.1,60.6C-54.1,50.6,-62.1,40.4,-67.2,28.8C-72.3,17.2,-74.6,4.1,-74,-9.1C-73.4,-22.3,-70,-35.6,-62.1,-46.6C-54.2,-57.6,-41.8,-66.3,-28.9,-72.2C-16,-78.1,-2.6,-81.2,12.3,-79.8C27.2,-78.4,43.2,-72.2,47.5,-78.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        {children}
        <SessionTimeout />
        <Analytics />
      </body>
    </html>
  )
}
