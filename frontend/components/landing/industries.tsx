'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Factory, ShoppingBag, Wrench, Utensils, Truck, Building2 } from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { Reveal } from '@/components/animated/reveal'
import { cn } from '@/lib/utils'

const industries = [
  {
    id: 'manufacturing',
    icon: Factory,
    label: 'Manufacturing',
    headline: 'Run the floor and the ledger from one system',
    modules: ['Production planning', 'Bill of materials', 'Quality control', 'Raw material inventory'],
    outcome: 'Cut production delays with material-ready alerts and live capacity tracking.',
  },
  {
    id: 'retail',
    icon: ShoppingBag,
    label: 'Retail & Wholesale',
    headline: 'Never oversell, never overstock',
    modules: ['Multi-location inventory', 'POS & sales', 'Purchasing', 'Customer loyalty'],
    outcome: 'AI reorder points keep bestsellers in stock and dead stock off your shelves.',
  },
  {
    id: 'services',
    icon: Wrench,
    label: 'Field Services',
    headline: 'From job request to invoice, tracked',
    modules: ['Job scheduling', 'Technician dispatch', 'Parts inventory', 'Billing'],
    outcome: 'Schedule the right tech with the right parts, and bill the moment work is done.',
  },
  {
    id: 'food',
    icon: Utensils,
    label: 'Food & Beverage',
    headline: 'Batch, trace, and comply with confidence',
    modules: ['Batch production', 'Lot traceability', 'Expiry management', 'Compliance'],
    outcome: 'Full lot traceability and expiry alerts protect margins and keep you audit-ready.',
  },
  {
    id: 'distribution',
    icon: Truck,
    label: 'Distribution',
    headline: 'Move product faster with less capital tied up',
    modules: ['Warehouse management', 'Route logistics', 'Supplier scorecards', 'Demand forecasting'],
    outcome: 'Forecast-driven replenishment frees working capital while keeping fill rates high.',
  },
  {
    id: 'construction',
    icon: Building2,
    label: 'Construction',
    headline: 'Every project, cost, and material accounted for',
    modules: ['Project costing', 'Equipment tracking', 'Procurement', 'Subcontractor management'],
    outcome: 'Track project margins in real time and stop budget overruns before they compound.',
  },
]

export function Industries() {
  const [active, setActive] = useState(industries[0].id)
  const current = industries.find((i) => i.id === active)!

  return (
    <section id="industries" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Built For Your Industry"
          title={
            <>
              One platform, <span className="text-gradient">shaped to your world</span>
            </>
          }
          description="GrowLabs adapts its modules and language to your industry. Pick yours to see what your ERP could look like."
        />

        <Reveal className="mt-12">
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {industries.map((ind) => (
              <button
                key={ind.id}
                type="button"
                onClick={() => setActive(ind.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
                  active === ind.id
                    ? 'border-primary/40 bg-primary/15 text-foreground'
                    : 'border-border bg-card/40 text-muted-foreground hover:text-foreground',
                )}
              >
                <ind.icon className="size-4" />
                {ind.label}
              </button>
            ))}
          </div>

          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card/40 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
              >
                <div>
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <current.icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-balance font-display text-2xl font-bold">
                    {current.headline}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{current.outcome}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/60 p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Activated modules
                  </span>
                  <ul className="mt-3 grid gap-2">
                    {current.modules.map((mod) => (
                      <li key={mod} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="size-1.5 rounded-full bg-primary" />
                        {mod}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
