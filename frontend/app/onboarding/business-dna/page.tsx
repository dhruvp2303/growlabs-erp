'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Package, TrendingUp, Users, Zap, BarChart3, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { useOnboarding } from '@/lib/onboarding/store'
import { cn } from '@/lib/utils'

interface DNAMetric {
  label: string
  value: number
  max: number
  icon: React.ReactNode
  description: string
  tone?: 'default' | 'accent' | 'success' | 'warning'
}

export default function BusinessDNAPage() {
  const router = useRouter()
  const { state, markStep } = useOnboarding()
  const [metrics, setMetrics] = useState<DNAMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Calculate metrics based on business data
    setTimeout(() => {
      const industryComplexity: Record<string, number> = {
        manufacturing: 95,
        distribution: 85,
        retail: 70,
        agriculture: 80,
        construction: 88,
        services: 65,
      }

      const basePriorities = state.priorities.length
      const inventoryDependency = state.painPoints.some((p) => p.includes('Inventory')) ? 90 : 60
      const productionNeed = state.industry === 'manufacturing' ? 95 : state.industry === 'construction' ? 80 : 40
      const procurementComplexity = state.painPoints.some((p) => p.includes('Procurement')) ? 85 : 60

      setMetrics([
        {
          label: 'Industry Complexity',
          value: industryComplexity[state.industry || 'retail'] || 70,
          max: 100,
          icon: <BarChart3 className="size-5" />,
          description: `${state.industry || 'Your industry'} requires complex operations management`,
          tone: 'default',
        },
        {
          label: 'Inventory Dependency',
          value: inventoryDependency,
          max: 100,
          icon: <Package className="size-5" />,
          description: 'How critical inventory management is to your business',
          tone: inventoryDependency > 80 ? 'warning' : 'default',
        },
        {
          label: 'Production Dependency',
          value: productionNeed,
          max: 100,
          icon: <Zap className="size-5" />,
          description: 'Manufacturing and production capabilities needed',
          tone: productionNeed > 80 ? 'accent' : 'default',
        },
        {
          label: 'Operational Complexity',
          value: 65 + basePriorities * 8,
          max: 100,
          icon: <TrendingUp className="size-5" />,
          description: `Based on ${basePriorities} priority focus areas`,
          tone: 'default',
        },
        {
          label: 'Team Size Impact',
          value: state.teamCount ? 70 : 50,
          max: 100,
          icon: <Users className="size-5" />,
          description: 'HR and coordination complexity',
          tone: 'default',
        },
        {
          label: 'Automation Opportunity',
          value: state.painPoints.length * 12,
          max: 100,
          icon: <Zap className="size-5" />,
          description: `${state.painPoints.length} pain points identified for automation`,
          tone: state.painPoints.length > 5 ? 'success' : 'default',
        },
      ])

      setLoading(false)
    }, 400)
  }, [state])

  async function proceed() {
    markStep('business-dna')
    router.push('/onboarding/recommendation')
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Building your business profile…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/" aria-label="GrowLabs home" className="lg:hidden">
            <Logo />
          </Link>
          <h1 className="font-display text-2xl font-bold">Your Business DNA</h1>
          <div /> {/* Spacer for flex */}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-base text-muted-foreground max-w-2xl">
              GrowLabs has analyzed your business and created a profile of your operational DNA. These insights
              determine which ERP modules you need and how they should be configured.
            </p>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={cn(
                  'rounded-2xl border p-6 transition-colors',
                  metric.tone === 'warning'
                    ? 'border-warning/25 bg-warning/5'
                    : metric.tone === 'accent'
                      ? 'border-accent/25 bg-accent/5'
                      : metric.tone === 'success'
                        ? 'border-success/25 bg-success/5'
                        : 'border-border bg-card/40',
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold font-display">{metric.value}%</p>
                  </div>
                  <div
                    className={cn(
                      'rounded-lg p-3',
                      metric.tone === 'warning'
                        ? 'bg-warning/10 text-warning'
                        : metric.tone === 'accent'
                          ? 'bg-accent/10 text-accent'
                          : metric.tone === 'success'
                            ? 'bg-success/10 text-success'
                            : 'bg-primary/10 text-primary',
                    )}
                  >
                    {metric.icon}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.05 }}
                    className={cn(
                      'h-full rounded-full transition-colors',
                      metric.tone === 'warning'
                        ? 'bg-warning'
                        : metric.tone === 'accent'
                          ? 'bg-accent'
                          : metric.tone === 'success'
                            ? 'bg-success'
                            : 'bg-primary',
                    )}
                  />
                </div>

                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-primary/25 bg-primary/[0.06] p-6 mb-8"
          >
            <div className="flex gap-4">
              <div className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <AlertCircle className="size-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Insights</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {state.industry && (
                    <li>
                      ✓ As a <span className="font-medium text-foreground">{state.industry}</span> business, you need
                      specialized workflows
                    </li>
                  )}
                  {state.painPoints.length > 0 && (
                    <li>
                      ✓ You identified <span className="font-medium text-foreground">{state.painPoints.length}</span>{' '}
                      operational challenges — GrowLabs addresses all of them
                    </li>
                  )}
                  {state.priorities.length > 0 && (
                    <li>
                      ✓ Your top priorities are <span className="font-medium text-foreground">{state.priorities.slice(0, 2).join(', ')}</span>
                      {state.priorities.length > 2 && ' and more'} — reflected in module recommendations
                    </li>
                  )}
                  <li>
                    ✓ Your ERP will be configured specifically for your business model, not forced into a generic mold
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="h-11 flex-1"
              onClick={proceed}
            >
              See Your Personalized Recommendation
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
