'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { useOnboarding } from '@/lib/onboarding/store'

const analysisSteps = [
  { id: 1, label: 'Understanding your industry', icon: '🏭' },
  { id: 2, label: 'Mapping your business model', icon: '🗺️' },
  { id: 3, label: 'Identifying operational problems', icon: '⚠️' },
  { id: 4, label: 'Understanding inventory requirements', icon: '📦' },
  { id: 5, label: 'Analyzing department dependencies', icon: '🔗' },
  { id: 6, label: 'Identifying automation opportunities', icon: '⚡' },
  { id: 7, label: 'Building your ERP recommendation', icon: '🧠' },
]

export default function AnalysisPage() {
  const router = useRouter()
  const { state } = useOnboarding()
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [allComplete, setAllComplete] = useState(false)

  useEffect(() => {
    // Animate through steps
    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      if (currentStep <= analysisSteps.length) {
        setCompletedSteps((prev) => [...prev, currentStep])
        if (currentStep === analysisSteps.length) {
          setAllComplete(true)
        }
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Redirect after all steps complete
    if (allComplete) {
      const timer = setTimeout(() => {
        router.push('/onboarding/business-dna')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [allComplete, router])

  const companyName = state.companyName || 'Your business'
  const industryLabel = state.industry
    ? state.industry.charAt(0).toUpperCase() + state.industry.slice(1)
    : 'Your industry'

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-8">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-glow opacity-60" />

      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="size-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">AI Analysis</h1>
          <p className="mt-2 text-muted-foreground">
            Analyzing {companyName}'s {industryLabel} operations
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {analysisSteps.map((step, idx) => {
            const isComplete = completedSteps.includes(step.id)
            const isCurrent = completedSteps.length === step.id
            const isPending = completedSteps.length < step.id

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.id * 0.08 }}
                className="flex items-center gap-4 rounded-lg border border-border bg-card/40 p-4 transition-colors"
                style={{
                  borderColor: isComplete ? 'var(--color-success)' : isCurrent ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: isComplete
                    ? 'var(--color-success/0.05)'
                    : isCurrent
                      ? 'var(--color-primary/0.05)'
                      : 'var(--color-card/0.4)',
                }}
              >
                <div className="text-2xl">{step.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{step.label}</p>
                </div>
                {isComplete ? (
                  <CheckCircle2 className="size-5 text-success shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="size-5 text-primary animate-spin shrink-0" />
                ) : (
                  <div className="size-5 rounded-full border border-muted-foreground/30 shrink-0" />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Completion Message */}
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 rounded-xl border border-success/25 bg-success/5 p-6 text-center"
          >
            <CheckCircle2 className="mx-auto size-8 text-success mb-3" />
            <p className="font-medium">Analysis complete</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Building your personalized ERP profile…
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
