'use client'

import { Star, Quote, Sparkles, TrendingUp, Zap, CheckCircle2 } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { CountUp } from '@/components/animated/count-up'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { motion } from 'motion/react'

const quotes = [
  {
    quote:
      'We replaced three legacy systems with GrowLabs in 9 days. The autonomous neural agent caught a critical inventory shortfall that protected a $480,000 multi-city delivery.',
    name: 'Dana Whitfield',
    role: 'Operations Director, PrimeFlow Global',
    company: 'PrimeFlow',
    initials: 'DW',
    spotlight: 'rgba(120, 119, 240, 0.22)',
    border: 'rgba(147, 130, 255, 0.45)',
  },
  {
    quote:
      'It feels like our ERP was designed by our own shop floor engineers. Zero menu clutter, lightning-fast lot tracing, and real-time machine telemetry out of the box.',
    name: 'Marcus Lee',
    role: 'Head of Global Supply Chain, Coastal Ag',
    company: 'Coastal Ag',
    initials: 'ML',
    spotlight: 'rgba(56, 189, 248, 0.22)',
    border: 'rgba(56, 189, 248, 0.45)',
  },
  {
    quote:
      'The automated 3-way matching and demand forecasting paid for our annual license within 60 days. We eliminated $180k in excess buffer inventory.',
    name: 'Priya Nair',
    role: 'VP Procurement & Sourcing, Delta Works',
    company: 'Delta Works',
    initials: 'PN',
    spotlight: 'rgba(52, 211, 153, 0.22)',
    border: 'rgba(52, 211, 153, 0.45)',
  },
]

const stats = [
  { value: 24, suffix: '%', label: 'Reduction in buffer stock', icon: TrendingUp, tag: 'Working Capital' },
  { value: 4, suffix: 'x', label: 'Faster time-to-value vs SAP', icon: Zap, tag: 'Rapid Go-Live' },
  { value: 99.4, suffix: '%', label: 'On-time delivery SLA score', icon: CheckCircle2, tag: 'Fulfillment' },
  { value: 85, suffix: 'k+', label: 'Autonomous actions executed', icon: Sparkles, tag: 'AI Autonomy' },
]

export function Testimonials() {
  return (
    <section id="resources" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-20 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Validated Enterprise ROI"
          title={
            <>
              Trusted by industry leaders who demanded{' '}
              <span className="text-gradient">modern agility</span>
            </>
          }
          description="Global manufacturers, distributors, and supply chains rely on GrowLabs to orchestrate mission-critical throughput with zero software friction."
        />

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-full flex"
            >
              <SpotlightCard
                spotlightColor={q.spotlight}
                borderColor={q.border}
                className="h-full flex flex-col justify-between p-7"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="size-4 fill-current drop-shadow-sm" />
                      ))}
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {q.company}
                    </span>
                  </div>

                  <blockquote className="text-sm leading-relaxed text-foreground/90 font-normal">
                    “{q.quote}”
                  </blockquote>
                </div>

                <div className="mt-6 flex items-center gap-3.5 border-t border-white/5 pt-5">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg shadow-primary/20">
                    {q.initials}
                  </span>
                  <div>
                    <span className="block text-sm font-semibold text-foreground">{q.name}</span>
                    <span className="block text-xs text-muted-foreground">{q.role}</span>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Highlight Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-2xl sm:p-8 lg:grid-cols-4 shadow-2xl shadow-black/20"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center p-3">
              <div className="mb-2 flex items-center gap-1 text-[11px] font-semibold text-accent">
                <s.icon className="size-3.5" />
                <span>{s.tag}</span>
              </div>
              <div className="font-display text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1.5 text-xs text-muted-foreground sm:text-sm font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
