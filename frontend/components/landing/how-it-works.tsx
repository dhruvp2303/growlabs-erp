'use client'

import { MessageCircleQuestion, Cpu, LayoutDashboard, Rocket, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { motion } from 'motion/react'

const steps = [
  {
    icon: MessageCircleQuestion,
    stepNum: '01',
    title: 'Business DNA Discovery',
    desc: 'Input operational parameters, active sales channels, and suppliers through conversational intelligence.',
    spotlight: 'rgba(120, 119, 240, 0.2)',
    border: 'rgba(147, 130, 255, 0.4)',
    tag: '3 Minutes',
  },
  {
    icon: Cpu,
    stepNum: '02',
    title: 'Neural Architecture Synthesis',
    desc: 'Autonomous AI models orchestrate data schemas, multi-tier BOMs, and role access matrices in seconds.',
    spotlight: 'rgba(56, 189, 248, 0.2)',
    border: 'rgba(56, 189, 248, 0.4)',
    tag: 'Autonomous',
  },
  {
    icon: LayoutDashboard,
    stepNum: '03',
    title: 'Interactive Live Sandbox',
    desc: 'Simulate work orders, mock purchase POs, and verify accounting reconciliations in real-time.',
    spotlight: 'rgba(168, 85, 247, 0.2)',
    border: 'rgba(168, 85, 247, 0.4)',
    tag: 'Visual Audit',
  },
  {
    icon: Rocket,
    stepNum: '04',
    title: 'Zero-Downtime Deployment',
    desc: '1-click automated ingest from legacy CSVs or SQL databases with zero operational interruption.',
    spotlight: 'rgba(52, 211, 153, 0.2)',
    border: 'rgba(52, 211, 153, 0.4)',
    tag: 'Instant Sync',
  },
  {
    icon: TrendingUp,
    stepNum: '05',
    title: 'Continuous Autonomous Tuning',
    desc: 'AI agents continuously watch throughput bottlenecks and recommend automated optimizations as revenue climbs.',
    spotlight: 'rgba(251, 146, 60, 0.2)',
    border: 'rgba(251, 146, 60, 0.4)',
    tag: 'Self-Optimizing',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -bottom-20 left-1/3 -z-10 h-[450px] w-[600px] rounded-full bg-primary/10 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Frictionless Onboarding"
          title={
            <>
              From raw discovery to live enterprise in{' '}
              <span className="text-gradient">five seamless stages</span>
            </>
          }
          description="Forget 18-month legacy rollout nightmares and consultant armies. GrowLabs architects, validates, and deploys your custom ERP stack autonomously."
        />

        {/* Steps Grid */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="h-full flex"
            >
              <SpotlightCard
                spotlightColor={step.spotlight}
                borderColor={step.border}
                className="h-full flex flex-col justify-between p-5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xl font-extrabold text-white/30 group-hover:text-accent transition-colors">
                      {step.stepNum}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-accent">
                      {step.tag}
                    </span>
                  </div>

                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-primary transition-transform group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/10">
                    <step.icon className="size-5 text-accent" />
                  </div>

                  <h3 className="font-display text-base font-semibold text-foreground group-hover:text-gradient transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CheckCircle2 className="size-3 text-success" />
                  <span>Step {i + 1} Verified</span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
