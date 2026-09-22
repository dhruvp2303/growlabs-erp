'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOnboarding } from '@/lib/onboarding/store'
import { cn } from '@/lib/utils'

const moduleIcons: Record<string, string> = {
  inventory: '📦',
  sales: '🛒',
  production: '🏭',
  procurement: '📋',
  finance: '💰',
  analytics: '📊',
  hr: '👥',
  quality: '✓',
  logistics: '🚚',
  ai: '⚡',
}

const moduleNames: Record<string, string> = {
  inventory: 'Inventory Management',
  sales: 'Sales & CRM',
  production: 'Production',
  procurement: 'Procurement',
  finance: 'Finance',
  analytics: 'Analytics',
  hr: 'HR & Workforce',
  quality: 'Quality Control',
  logistics: 'Logistics',
  ai: 'AI Copilot',
}

export default function ActivationPage() {
  const router = useRouter()
  const { state, markStep } = useOnboarding()
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    // Complete all onboarding steps and wait for animation
    markStep('activation')
    
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [markStep])

  function enterERP() {
    router.push('/dashboard')
  }

  const selectedModuleLabels = state.selectedModules.map((id) => moduleNames[id])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-glow opacity-60" />

      <div className="w-full max-w-lg">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
          className="mx-auto mb-8 inline-flex size-20 items-center justify-center rounded-2xl bg-success/10"
        >
          <CheckCircle2 className="size-10 text-success" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h1 className="font-display text-4xl font-bold">Your ERP is Ready</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {state.companyName || 'Your workspace'} has been configured with all your selected modules.
          </p>
        </motion.div>

        {/* Module Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 rounded-2xl border border-primary/25 bg-primary/[0.06] p-6"
        >
          <h3 className="font-semibold mb-4">Your ERP Architecture</h3>
          <div className="space-y-2">
            {state.selectedModules.map((moduleId) => (
              <motion.div
                key={moduleId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/30 px-4 py-3"
              >
                <span className="text-xl">{moduleIcons[moduleId] || '◆'}</span>
                <span className="text-sm font-medium">{moduleNames[moduleId] || moduleId}</span>
                <CheckCircle2 className="size-4 text-success ml-auto" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ready Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8 rounded-xl border border-accent/25 bg-accent/[0.06] p-6 text-center"
        >
          <Zap className="mx-auto size-6 text-accent mb-3" />
          <p className="font-medium">You're all set!</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Your data and workflows are ready. Start using GrowLabs to transform your business operations.
          </p>
        </motion.div>

        {/* CTA - Show after animation */}
        {animationComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <Button
              size="lg"
              className="w-full h-11"
              onClick={enterERP}
            >
              Enter Your ERP
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              You'll be directed to your dashboard
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
