import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { OnboardingProvider } from '@/lib/onboarding/store'
import { PersonalizationProvider } from '@/lib/personalization/personalization-provider'
import { ErpWorkflowProvider } from '@/lib/workflow/erp-workflow-provider'
import { CursorFollower } from '@/components/animated/cursor-follower'
import './globals.css'

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
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
  themeColor: '#12162a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased selection:bg-primary/30 selection:text-white">
        <CursorFollower />
        <OnboardingProvider>
          <PersonalizationProvider>
            <ErpWorkflowProvider>
              {children}
              <Toaster position="top-right" />
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </ErpWorkflowProvider>
          </PersonalizationProvider>
        </OnboardingProvider>
      </body>
    </html>
  )
}
