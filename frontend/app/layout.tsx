import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { OnboardingProvider } from '@/lib/onboarding/store'
import { PersonalizationProvider } from '@/lib/personalization/personalization-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GrowLabs — Pro Enterprise AI-Powered Personalized ERP',
  description:
    'GrowLabs is the next-generation AI-powered personalized ERP platform competing with SAP and NetSuite. Autonomous multi-model agents, live telemetry, and modular industry engines.',
  generator: 'v0.app',
  keywords: [
    'ERP',
    'AI ERP',
    'personalized ERP',
    'business intelligence',
    'SAP alternative',
    'NetSuite competitor',
    'autonomous agents',
  ],
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#12162a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} bg-background`}>
      <body className="font-sans antialiased">
        <OnboardingProvider>
          <PersonalizationProvider>
            {children}
            <Toaster position="top-right" />
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </PersonalizationProvider>
        </OnboardingProvider>
      </body>
    </html>
  )
}
