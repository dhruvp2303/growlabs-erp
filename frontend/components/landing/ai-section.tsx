'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Brain,
  LineChart,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Wand2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Cpu,
} from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { TiltCard } from '@/components/animated/tilt-card'

const capabilities = [
  {
    icon: Wand2,
    title: 'Self-Configuring Neural Setup',
    desc: 'Answer natural questions about your supply lines; AI synthesizes schemas, workflows, and role permissions dynamically.',
    spotlight: 'rgba(120, 119, 240, 0.25)',
    border: 'rgba(147, 130, 255, 0.5)',
  },
  {
    icon: ShieldAlert,
    title: 'Autonomous Anomaly Radar',
    desc: 'Preempt stockouts, freight bottlenecks, and cash flow troughs 14 days before disruption strikes with auto-mitigations.',
    spotlight: 'rgba(251, 146, 60, 0.25)',
    border: 'rgba(251, 146, 60, 0.5)',
  },
  {
    icon: LineChart,
    title: 'Deep Multi-Signal Forecasting',
    desc: 'Continuous training across weather trends, macro indices, and past seasonals to predict exact SKU requirements.',
    spotlight: 'rgba(56, 189, 248, 0.25)',
    border: 'rgba(56, 189, 248, 0.5)',
  },
  {
    icon: MessageSquare,
    title: 'Conversational Data Copilot',
    desc: 'Query live ERP states with plain English: "Why are Chicago margins slipping?" with instant root-cause breakdowns.',
    spotlight: 'rgba(52, 211, 153, 0.25)',
    border: 'rgba(52, 211, 153, 0.5)',
  },
]

export function AiSection() {
  return (
    <section id="ai" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-glow opacity-70" />
      <div className="pointer-events-none absolute top-1/2 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[150px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Autonomous Neural Layer"
          title={
            <>
              An ERP that reasons & predicts{' '}
              <span className="text-gradient">in real time</span>
            </>
          }
          description="Intelligence isn't an afterthought or a plugin — it is the heartbeat of GrowLabs. Real-time neural agents monitor your assembly lines, detect deviations, and suggest verified remediations."
        />

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Capabilities Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <SpotlightCard
                  spotlightColor={c.spotlight}
                  borderColor={c.border}
                  className="h-full p-5"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-primary transition-transform duration-300 group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/10">
                    <c.icon className="size-5 text-accent" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {c.desc}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* Copilot Interactive Mock */}
          <TiltCard maxTilt={5} scale={1.01}>
            <AiCopilotMock />
          </TiltCard>
        </div>
      </div>
    </section>
  )
}

function AiCopilotMock() {
  const [executed, setExecuted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleExecuteAction = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setExecuted(true)
    }, 700)
  }

  return (
    <div className="relative rounded-2xl border border-white/10 bg-card/70 p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-accent/20 blur-3xl" />

      {/* Top Header */}
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30">
            <Brain className="size-4.5" />
            <span className="absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-card bg-success" />
          </span>
          <div>
            <div className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
              <span>GrowLabs Autonomous Copilot</span>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
                Online
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              Deep operational scan · PrimeFlow Production DC
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted-foreground">
          <Cpu className="size-3 text-accent" />
          <span>Neural Engine v4.2</span>
        </div>
      </div>

      {/* Chat Flow */}
      <div className="flex flex-col gap-3.5">
        {/* User Prompt */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm border border-primary/30 bg-primary/15 px-4 py-2.5 text-sm text-foreground shadow-sm"
        >
          Why is production order <span className="font-mono font-semibold text-accent">#MO-2202</span> marked as High Risk for next Tuesday?
        </motion.div>

        {/* AI Answer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-[94%] rounded-2xl rounded-bl-sm border border-white/10 bg-card/90 p-4 shadow-xl backdrop-blur-md"
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-accent">
              <Sparkles className="size-3.5 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Root Cause Diagnostics</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Confidence: 99.4%</span>
          </div>

          <p className="text-xs leading-relaxed text-foreground/90">
            Work order <span className="font-semibold text-foreground">#MO-2202</span> will stall at Stage 3. Raw inventory of{' '}
            <span className="font-semibold text-foreground">Titanium Fastener 4mm</span> is short by{' '}
            <span className="rounded bg-destructive/20 px-1.5 py-0.5 font-mono font-semibold text-destructive">
              80 units
            </span>{' '}
            due to a delayed supplier batch.
          </p>

          {/* Action Recommendation Box */}
          <div className="mt-3.5 rounded-xl border border-accent/30 bg-accent/10 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                <Sparkles className="size-3.5" />
                <span>Autonomous Action Recommendation</span>
              </div>
              <span className="text-[10px] text-accent/80">Saves 48 hrs</span>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-foreground/85">
              Transfer 80 units from secondary hub (Atlanta DC) via expedited local courier. Zero downtime impact.
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-accent/20 pt-2.5">
              <span className="text-[11px] text-muted-foreground">
                Estimated Transit: <strong>1.5 Days</strong> · Cost: <strong>$42.00</strong>
              </span>

              <AnimatePresence mode="wait">
                {executed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 rounded-lg bg-success/20 px-3 py-1.5 text-xs font-medium text-success"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Transfer Dispatched</span>
                  </motion.div>
                ) : (
                  <button
                    onClick={handleExecuteAction}
                    disabled={isProcessing}
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-background shadow-md transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="size-3 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <span>Approve Transfer</span>
                        <ArrowRight className="size-3" />
                      </>
                    )}
                  </button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
