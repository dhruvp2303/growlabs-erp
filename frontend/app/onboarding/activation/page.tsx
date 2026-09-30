'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Sparkles,
  Shield,
  Calendar,
  CreditCard,
  Gift,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShimmerButton } from '@/components/animated/shimmer-button'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { useOnboarding, type RentalDuration } from '@/lib/onboarding/store'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

const moduleIcons: Record<string, string> = {
  pos: '💳',
  inventory: '📦',
  sales: '🛒',
  production: '🏭',
  procurement: '📋',
  finance: '💰',
  analytics: '📊',
  hr: '👥',
  quality: '✓',
  logistics: '🚚',
  recipes: '🍳',
  whatsapp: '💬',
  custom_features: '✨',
}

const moduleNames: Record<string, string> = {
  pos: 'Fast Barcode POS Billing',
  inventory: 'Inventory & Stock Control',
  sales: 'Sales & Customer Ledger',
  production: 'Manufacturing BOM',
  procurement: 'Supplier Purchase Orders',
  finance: 'Financial Ledger & 3-Way Match',
  analytics: 'Operational Telemetry BI',
  hr: 'Staff & Shift Attendance',
  quality: 'QC & Expiry Tracking',
  logistics: 'Fleet GPS & Carrier Routing',
  recipes: 'Recipe Ingredient Deductions',
  whatsapp: '1-Click WhatsApp Invoices',
  custom_features: 'AI Custom Feature Studio',
}

const rentalPlans = [
  { id: '30_days', label: '1 Month (30 Days)', badge: 'Most Flexible', desc: 'Renews monthly after trial' },
  { id: '3_months', label: '3 Months (Quarter)', badge: 'Save 5%', desc: 'Save 5% on post-trial cycle' },
  { id: '6_months', label: '6 Months', badge: 'Save 10%', desc: 'Save 10% on post-trial cycle' },
  { id: '1_year', label: '1 Year (Annual)', badge: 'Save 20%', desc: 'Maximum savings & VIP perks' },
]

export default function ActivationPage() {
  const router = useRouter()
  const { state, update, markStep } = useOnboarding()
  const [selectedPlan, setSelectedPlan] = useState<RentalDuration>(state.rentalDuration || '30_days')
  const [isLaunching, setIsLaunching] = useState(false)

  useEffect(() => {
    markStep('activation')
  }, [markStep])

  function enterERP() {
    setIsLaunching(true)
    update({ rentalDuration: selectedPlan, trialActive: true })

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#818cf8', '#34d399', '#f43f5e'],
    })

    setTimeout(() => {
      router.push('/dashboard')
    }, 700)
  }

  const activeModules = state.selectedModules.length > 0
    ? state.selectedModules
    : ['inventory', 'sales', 'pos', 'analytics']

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-glow opacity-70" />
      <div className="pointer-events-none absolute top-10 left-1/2 -z-10 size-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />

      <div className="w-full max-w-xl">
        {/* Success / Free Trial Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
          className="mx-auto mb-5 inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-success/20 to-primary/20 border border-success/30 shadow-lg shadow-success/10"
        >
          <Gift className="size-8 text-success" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3.5 py-1 text-xs font-bold text-success mb-3 shadow-sm">
            <Sparkles className="size-3.5 animate-pulse" />
            <span>15-Day Full-Access Free Trial Activated</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Your Personalized ERP is Ready
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            <strong className="text-foreground">{state.companyName || 'Your Business'}</strong> is calibrated with {activeModules.length} operational modules. Zero credit card required to start.
          </p>
        </motion.div>

        {/* Architecture Spotlight Box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-6 rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Zap className="size-3.5" />
              <span>Configured Neural Subsystems</span>
            </h3>
            <span className="text-[10px] text-muted-foreground">Ready to Deploy</span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
            {activeModules.map((moduleId) => (
              <div
                key={moduleId}
                className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs"
              >
                <span>{moduleIcons[moduleId] || '◆'}</span>
                <span className="font-medium text-foreground truncate">{moduleNames[moduleId] || moduleId}</span>
                <CheckCircle2 className="size-3 text-success ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rental Subscription Selection (Payment Opt In at the very END) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-6 rounded-2xl border border-white/10 bg-card/70 p-5 backdrop-blur-xl shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" />
                <span>Select Post-Trial Rental Cycle</span>
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                You will not be billed today. Your 15-day trial is 100% free.
              </p>
            </div>
            <span className="rounded-full bg-primary/20 border border-primary/40 px-2 py-0.5 text-[10px] font-bold text-primary">
              No Card Needed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {rentalPlans.map((plan) => {
              const isSelected = selectedPlan === plan.id
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id as any)}
                  className={cn(
                    'flex flex-col justify-between rounded-xl border p-2.5 text-left text-xs transition-all cursor-pointer',
                    isSelected
                      ? 'border-primary bg-primary/20 shadow-sm'
                      : 'border-white/5 bg-white/[0.02] text-muted-foreground hover:border-white/15'
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-[11px] text-foreground">{plan.label}</span>
                    <span className="text-[9px] font-bold text-success">{plan.badge}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1">{plan.desc}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Launch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="space-y-3"
        >
          <ShimmerButton
            className="w-full h-12 text-sm font-bold shadow-xl shadow-primary/20"
            onClick={enterERP}
            disabled={isLaunching}
          >
            <span>{isLaunching ? 'Deploying Workspace…' : 'Start 15-Day Free Trial & Enter ERP'}</span>
            <ArrowRight className="size-4" />
          </ShimmerButton>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/80 pt-1">
            <div className="flex items-center gap-1">
              <Shield className="size-3 text-success" />
              <span>Cancel anytime with 1-click</span>
            </div>
            <span>•</span>
            <div>Zero lock-in contract</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
