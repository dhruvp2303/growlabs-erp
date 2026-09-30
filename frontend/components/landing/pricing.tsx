'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Check,
  Plus,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  HeartHandshake,
  Calendar,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/landing/section-heading'
import { CountUp } from '@/components/animated/count-up'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { ShimmerButton } from '@/components/animated/shimmer-button'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'

type DurationKey = '30_days' | '3_months' | '6_months' | '1_year'

const durationOptions: { key: DurationKey; label: string; discount: number; badge?: string }[] = [
  { key: '30_days', label: '1 Month (30 Days)', discount: 0, badge: 'Flexible Rental' },
  { key: '3_months', label: '3 Months (Quarter)', discount: 0.05, badge: 'Save 5%' },
  { key: '6_months', label: '6 Months', discount: 0.1, badge: 'Save 10%' },
  { key: '1_year', label: '1 Year (Annual)', discount: 0.2, badge: 'Save 20%' },
]

const tiers = [
  {
    name: 'Free Starter',
    base: 0,
    tagline: 'Free forever for solo founders, micro-shops & workshops getting started',
    included: [
      'Up to 3 team seats (100% Free Forever)',
      'Real-time Stock & Inventory sync',
      'Mobile/Tablet camera barcode scanning',
      'Quotes, Invoices & Orders',
      'Community support & video guides',
    ],
    popular: false,
    spotlight: 'rgba(120, 119, 240, 0.15)',
    border: 'rgba(147, 130, 255, 0.3)',
    ctaText: 'Start Free Forever',
    isFree: true,
  },
  {
    name: 'Growth Engine',
    base: 39,
    tagline: 'For fast-growing retail shops, supermarkets, restaurants & expanding teams',
    included: [
      'Up to 15 team seats included',
      'Autonomous AI Copilot & stockout radar',
      'Automated PO generation & WhatsApp receipts',
      '3-way matching automated financial ledger',
      '24/7 Priority live chat support',
    ],
    popular: true,
    spotlight: 'rgba(56, 189, 248, 0.25)',
    border: 'rgba(56, 189, 248, 0.6)',
    ctaText: 'Start 14-Day Free Rental',
    isFree: false,
  },
  {
    name: 'Scale & Industrial',
    base: 99,
    tagline: 'For mall store chains, high-volume distributors & manufacturing plants',
    included: [
      'Unlimited operator seats',
      'All 12+ enterprise modules unlocked',
      'Multi-level BOM manufacturing & routing',
      'Multi-warehouse & store transfer matrix',
      'SOC 2 Type II Cryptographic Vault',
      'Dedicated Customer Success Manager',
    ],
    popular: false,
    spotlight: 'rgba(168, 85, 247, 0.2)',
    border: 'rgba(168, 85, 247, 0.4)',
    ctaText: 'Deploy Scale Plan',
    isFree: false,
  },
]

const addOns = [
  { id: 'pos', label: 'Fast Barcode POS & Thermal Billing', price: 10, desc: 'Mobile/Tablet cashier checkout' },
  { id: 'whatsapp', label: '1-Click WhatsApp Invoices & Reminders', price: 8, desc: 'Zero paper thermal printer cost' },
  { id: 'multistore', label: 'Multi-Store & Mall Chain Sync', price: 15, desc: 'Live stock transfer across outlets' },
  { id: 'recipe', label: 'Recipe-Level Ingredient Deductions', price: 12, desc: 'Auto-deduct raw food as dishes sell' },
  { id: 'production', label: 'Shop-Floor Routing & Multi-BOM', price: 20, desc: 'Assembly sequencing & work orders' },
  { id: 'logistics', label: 'Live Carrier GPS & Rate Shopping', price: 15, desc: 'Fleet dispatch & live tracking' },
]

export function Pricing() {
  const [duration, setDuration] = useState<DurationKey>('30_days')
  const [selected, setSelected] = useState<string[]>(['pos', 'whatsapp'])

  const activeDurationObj = durationOptions.find((d) => d.key === duration)!
  const discountRate = activeDurationObj.discount

  const addOnTotal = useMemo(
    () => addOns.filter((a) => selected.includes(a.id)).reduce((sum, a) => sum + a.price, 0),
    [selected]
  )

  const rawGrowthPrice = 39 + addOnTotal
  const displayGrowthPrice = Math.round(rawGrowthPrice * (1 - discountRate))

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#38bdf8', '#818cf8', '#34d399'],
    })
  }

  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[650px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Modular Rental Model"
          title={
            <>
              Rent your ERP like Netflix:{' '}
              <span className="text-gradient">Pay only for what you use</span>
            </>
          }
          description="Rent modules on 30-day or longer cycles. If you don't need a feature next month, simply turn it off — your next subscription updates automatically with zero lock-in penalties."
        />

        {/* Netflix-Style Rental Feature Guarantee Pill */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur-xl shadow-md">
            <div className="flex items-center gap-1.5 text-accent">
              <RotateCcw className="size-4 animate-spin-slow" />
              <span>Netflix-Style Flexibility:</span>
            </div>
            <span className="text-muted-foreground">Add features in peak season • Remove when done • Pay only for active days</span>
          </div>
        </div>

        {/* Rental Duration Switcher */}
        <div className="mt-8 flex justify-center">
          <div className="relative flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-card/70 p-1.5 backdrop-blur-xl shadow-lg">
            {durationOptions.map((opt) => {
              const isActive = duration === opt.key
              return (
                <button
                  key={opt.key}
                  onClick={() => setDuration(opt.key)}
                  className={cn(
                    'relative z-10 flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="rental-duration-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-primary/50 bg-primary/30 shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span>{opt.label}</span>
                  {opt.badge && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold',
                        opt.discount > 0
                          ? 'border border-success/30 bg-success/20 text-success'
                          : 'border border-white/10 bg-white/10 text-muted-foreground'
                      )}
                    >
                      {opt.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3 items-stretch">
          {tiers.map((tier, i) => {
            const isGrowth = tier.name === 'Growth Engine'
            const calculatedPrice = isGrowth
              ? displayGrowthPrice
              : tier.isFree
                ? 0
                : Math.round(tier.base * (1 - discountRate))

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full flex"
              >
                <SpotlightCard
                  spotlightColor={tier.spotlight}
                  borderColor={tier.border}
                  className={cn(
                    'relative flex w-full flex-col justify-between p-7',
                    tier.popular && 'border-primary/50 bg-card/80 shadow-2xl shadow-primary/15'
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-7 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary via-accent to-purple-500 px-3.5 py-1 text-xs font-bold text-white shadow-lg shadow-primary/30">
                      <Sparkles className="size-3" />
                      <span>Most Popular for Growing Businesses</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-bold text-foreground">{tier.name}</h3>
                      {tier.isFree && (
                        <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[10px] font-semibold text-success">
                          100% Free
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{tier.tagline}</p>

                    {/* Price display */}
                    <div className="mt-6 flex items-baseline gap-1 border-b border-white/5 pb-6">
                      {tier.isFree ? (
                        <div>
                          <span className="font-display text-4xl font-extrabold text-foreground">$0</span>
                          <span className="ml-2 text-xs text-muted-foreground">/ free forever</span>
                        </div>
                      ) : (
                        <>
                          <span className="font-display text-4xl font-extrabold text-foreground">
                            <CountUp value={calculatedPrice} format={(n) => formatCurrency(Math.round(n))} />
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">/ month</span>
                          {discountRate > 0 && (
                            <span className="ml-2 text-xs text-success font-semibold">
                              ({Math.round(discountRate * 100)}% off applied)
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="mt-6">
                      {tier.popular ? (
                        <Link href="/signup" onClick={triggerConfetti}>
                          <ShimmerButton className="w-full h-11 text-xs font-bold">
                            <span>{tier.ctaText}</span>
                            <ArrowRight className="size-3.5" />
                          </ShimmerButton>
                        </Link>
                      ) : (
                        <Button
                          className="w-full h-11 border-white/10 bg-white/[0.04] text-xs font-semibold hover:border-white/20 hover:bg-white/[0.08]"
                          variant="outline"
                          nativeButton={false}
                          render={<Link href="/signup" />}
                          onClick={triggerConfetti}
                        >
                          {tier.ctaText}
                        </Button>
                      )}
                    </div>

                    {/* Included Features */}
                    <div className="mt-7 space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        Included Features
                      </p>
                      <ul className="flex flex-col gap-2.5">
                        {tier.included.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-xs">
                            <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                              <Check className="size-2.5" />
                            </span>
                            <span className="text-foreground/90 leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Add-ons for growth plan */}
                  {isGrowth && (
                    <div className="mt-7 border-t border-white/10 pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wide text-accent flex items-center gap-1">
                          <Sliders className="size-3.5" />
                          <span>Rent Custom Add-On Modules</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">Toggle anytime</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {addOns.map((a) => {
                          const on = selected.includes(a.id)
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => toggle(a.id)}
                              className={cn(
                                'flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-left text-xs transition-all duration-200',
                                on
                                  ? 'border-accent/40 bg-accent/10 shadow-sm'
                                  : 'border-white/5 bg-white/[0.02] hover:border-white/15'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    'inline-flex size-4 items-center justify-center rounded-md transition-colors',
                                    on ? 'bg-accent text-background font-bold' : 'bg-white/10 text-muted-foreground'
                                  )}
                                >
                                  {on ? <Check className="size-2.5" /> : <Plus className="size-2.5" />}
                                </span>
                                <div>
                                  <div className={cn('font-medium', on ? 'text-foreground' : 'text-muted-foreground')}>
                                    {a.label}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground/70">{a.desc}</div>
                                </div>
                              </div>
                              <span className="font-mono text-xs font-semibold text-accent shrink-0 ml-2">
                                +${a.price}/mo
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </SpotlightCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
