'use client'

import { Star } from 'lucide-react'
import { Reveal } from '@/components/animated/reveal'
import { SectionHeading } from '@/components/landing/section-heading'
import { CountUp } from '@/components/animated/count-up'

const quotes = [
  {
    quote:
      'We replaced three disconnected tools with GrowLabs in under two weeks. The AI flagged a stockout that would have cost us a $200k order.',
    name: 'Dana Whitfield',
    role: 'Operations Director, PrimeFlow',
    initials: 'DW',
  },
  {
    quote:
      'It genuinely feels like the ERP was built for us. We only see what our team actually needs — no clutter, no 40-tab menus.',
    name: 'Marcus Lee',
    role: 'Head of Supply Chain, Coastal Agri',
    initials: 'ML',
  },
  {
    quote:
      'The demand forecasting alone paid for the platform. We cut excess inventory by 22% while improving fill rates.',
    name: 'Priya Nair',
    role: 'VP Procurement, Delta Works',
    initials: 'PN',
  },
]

const stats = [
  { value: 22, suffix: '%', label: 'Less excess inventory' },
  { value: 3, suffix: 'x', label: 'Faster to go live' },
  { value: 98, suffix: '%', label: 'Order fulfillment rate' },
  { value: 40, suffix: 'k+', label: 'Decisions guided by AI' },
]

export function Testimonials() {
  return (
    <section id="resources" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Proof"
          title={
            <>
              Operators who stopped fighting their <span className="text-gradient">software</span>
            </>
          }
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-6">
                <div className="mb-4 flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
                  “{q.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
                    {q.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{q.name}</span>
                    <span className="block text-xs text-muted-foreground">{q.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14" delay={0.1}>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card/40 p-8 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
