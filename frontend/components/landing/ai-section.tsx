'use client'

import { motion } from 'motion/react'
import { Brain, LineChart, MessageSquare, ShieldAlert, Sparkles, Wand2 } from 'lucide-react'
import { Reveal } from '@/components/animated/reveal'
import { SectionHeading } from '@/components/landing/section-heading'

const capabilities = [
  {
    icon: Wand2,
    title: 'Self-Configuring Setup',
    desc: 'Answer a few questions and AI assembles your modules, workflows, and dashboards automatically.',
  },
  {
    icon: ShieldAlert,
    title: 'Predictive Alerts',
    desc: 'Stockouts, delays, and cash gaps are flagged before they happen — with the reason and the fix.',
  },
  {
    icon: LineChart,
    title: 'Demand Forecasting',
    desc: 'Forecasts that learn your seasonality and customer signals to plan production and procurement.',
  },
  {
    icon: MessageSquare,
    title: 'Natural-Language Insights',
    desc: 'Ask “why did margins drop last month?” and get an answer grounded in your live data.',
  },
]

export function AiSection() {
  return (
    <section id="ai" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-glow opacity-60" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The Intelligence Layer"
          title={
            <>
              An ERP that thinks <span className="text-gradient">alongside you</span>
            </>
          }
          description="AI isn't a bolt-on feature in GrowLabs — it's the engine. It configures your system, watches your operations, and turns data into decisions."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-card/40 p-5">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <c.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <AiCopilotMock />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function AiCopilotMock() {
  return (
    <div className="relative rounded-2xl border border-border glass p-4 shadow-2xl shadow-black/40">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <Brain className="size-4" />
        </span>
        <div>
          <div className="text-sm font-semibold">GrowLabs Copilot</div>
          <div className="text-[11px] text-muted-foreground">Analyzing PrimeFlow operations</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary/15 px-3.5 py-2 text-sm text-foreground">
          Why is production order MO-2202 at risk?
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-[92%] rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-3 text-sm"
        >
          <div className="mb-2 flex items-center gap-1.5 text-accent">
            <Sparkles className="size-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wide">Insight</span>
          </div>
          <p className="leading-relaxed text-foreground/90">
            MO-2202 risks missing its Sep 10 due date. Steel Sheet A36 is short by{' '}
            <span className="font-semibold text-warning">60 units</span> against the BOM.
          </p>
          <div className="mt-3 rounded-lg border border-success/25 bg-success/10 px-3 py-2">
            <span className="text-[11px] font-semibold text-success">Recommended action</span>
            <p className="mt-0.5 text-[13px] leading-relaxed text-foreground/90">
              Transfer 80 units from Atlanta DC — arrives in 2 days, keeps the order on schedule.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
