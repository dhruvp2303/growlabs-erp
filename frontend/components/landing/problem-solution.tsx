'use client'

import { Check, X, ArrowRight, Sparkles } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { motion } from 'motion/react'

const rows = [
  {
    problem: '18-month multi-million implementation delays & bloated consultant armies',
    solution: 'Live operational ERP in under 3 days — AI synthesizes data models autonomously',
  },
  {
    problem: 'Hundreds of redundant menus, 40-tab screens, and bloated legacy features',
    solution: 'Zero software bloat — exclusively the modules & telemetry your teams use daily',
  },
  {
    problem: 'Rigid workflows that force your business into an inflexible vendor mold',
    solution: 'Neural workflows calibrated dynamically around your existing shop-floor practices',
  },
  {
    problem: 'Stale retrospective PDF reports explaining why revenue was missed last quarter',
    solution: 'Predictive neural radar detecting supplier shortfalls & cash gaps 14 days ahead',
  },
  {
    problem: 'Aggressive per-seat penalty fees that penalize you as headcount scales',
    solution: 'Transparent modular capacity pricing — unlimited user seats with zero lock-in',
  },
]

export function ProblemSolution() {
  return (
    <section id="problem" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Paradigm Shift"
          title={
            <>
              Legacy ERP was engineered for 1995.{' '}
              <span className="text-gradient">GrowLabs is built for autonomous scale.</span>
            </>
          }
          description="Traditional monolithic platforms force your enterprise into rigid vendor templates. GrowLabs reverses the equation: our neural engine shapes itself around your business."
        />

        <div className="mx-auto mt-16 max-w-5xl">
          {/* Column Header Titles */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 px-2">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-destructive" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Legacy Monoliths (SAP / NetSuite)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                GrowLabs Autonomous ERP
              </span>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="flex flex-col gap-3.5">
            {rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {/* Legacy Problem Card */}
                <div className="flex items-start gap-3.5 rounded-2xl border border-white/5 bg-card/40 p-4.5 backdrop-blur-md transition-colors group-hover:border-destructive/25">
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                    <X className="size-3" />
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {row.problem}
                  </p>
                </div>

                {/* GrowLabs Solution Spotlight */}
                <SpotlightCard
                  spotlightColor="rgba(56, 189, 248, 0.2)"
                  borderColor="rgba(56, 189, 248, 0.45)"
                  className="flex items-start gap-3.5 p-4.5 bg-primary/[0.08] border-primary/30"
                >
                  <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-success shadow-sm">
                    <Check className="size-3 font-bold" />
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                    {row.solution}
                  </p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
