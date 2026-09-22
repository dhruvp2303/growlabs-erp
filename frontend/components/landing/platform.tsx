'use client'

import {
  Boxes,
  ShoppingCart,
  Factory,
  Truck,
  Users,
  Wallet,
  ClipboardCheck,
  ShieldCheck,
  BarChart3,
} from 'lucide-react'
import { Reveal } from '@/components/animated/reveal'
import { SectionHeading } from '@/components/landing/section-heading'
import { cn } from '@/lib/utils'

const modules = [
  {
    icon: Boxes,
    title: 'Inventory & Warehouse',
    desc: 'Real-time stock across every location with intelligent reorder points and multi-warehouse transfers.',
    span: 'lg:col-span-2',
    tone: 'primary',
  },
  {
    icon: BarChart3,
    title: 'Business Intelligence',
    desc: 'Live dashboards that turn raw operations into decisions.',
    span: '',
    tone: 'accent',
  },
  {
    icon: ShoppingCart,
    title: 'Sales & CRM',
    desc: 'Orders, customers, and pipeline in one view.',
    span: '',
    tone: 'default',
  },
  {
    icon: Factory,
    title: 'Production',
    desc: 'Plan, schedule, and track manufacturing from BOM to finished goods.',
    span: 'lg:col-span-2',
    tone: 'default',
  },
  {
    icon: Wallet,
    title: 'Finance & Accounting',
    desc: 'Invoicing, receivables, and cash flow with automated reconciliation.',
    span: 'lg:col-span-2',
    tone: 'default',
  },
  {
    icon: Truck,
    title: 'Logistics',
    desc: 'Shipment tracking and carrier management end-to-end.',
    span: '',
    tone: 'default',
  },
  {
    icon: Users,
    title: 'HR & Workforce',
    desc: 'Teams, attendance, and roles.',
    span: '',
    tone: 'default',
  },
  {
    icon: ClipboardCheck,
    title: 'Procurement',
    desc: 'Purchase orders and supplier scorecards with approval flows.',
    span: '',
    tone: 'accent',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Control',
    desc: 'Inspections, pass rates, and defect tracking baked into production.',
    span: '',
    tone: 'default',
  },
]

const toneStyles: Record<string, string> = {
  primary: 'border-primary/25 bg-primary/[0.06]',
  accent: 'border-accent/25 bg-accent/[0.06]',
  default: 'border-border bg-card/40',
}

const iconTone: Record<string, string> = {
  primary: 'bg-primary/15 text-primary',
  accent: 'bg-accent/15 text-accent',
  default: 'bg-muted text-foreground',
}

export function Platform() {
  return (
    <section id="platform" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="One Platform"
          title={
            <>
              Every module your operation needs, <span className="text-gradient">activated on demand</span>
            </>
          }
          description="GrowLabs ships as one connected platform. You switch on exactly the modules your business runs on — and they all share the same data, in real time."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <Reveal key={m.title} delay={(i % 3) * 0.06} className={m.span}>
              <div
                className={cn(
                  'group h-full rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20',
                  toneStyles[m.tone],
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                    iconTone[m.tone],
                  )}
                >
                  <m.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
