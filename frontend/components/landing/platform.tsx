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
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { motion } from 'motion/react'

const modules = [
  {
    icon: Boxes,
    title: 'Inventory & Multi-Warehouse',
    desc: 'Real-time stock across every physical location with autonomous reorder points, lot tracking, and warehouse transfer matrix.',
    span: 'lg:col-span-2',
    spotlight: 'rgba(120, 119, 240, 0.22)',
    border: 'rgba(147, 130, 255, 0.5)',
    metric: 'Real-Time Sync · <10ms',
    tag: 'Core Intelligence',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Telemetry & BI',
    desc: 'Live telemetry dashboards that transform raw machine and accounting logs into predictive operational signals.',
    span: '',
    spotlight: 'rgba(56, 189, 248, 0.22)',
    border: 'rgba(56, 189, 248, 0.5)',
    metric: 'Live Streaming',
    tag: 'Predictive',
  },
  {
    icon: ShoppingCart,
    title: 'Omnichannel Sales & CRM',
    desc: 'Lead pipelines, customer lifetime metrics, dynamic pricing quotes, and fulfillment status in a single pane.',
    span: '',
    spotlight: 'rgba(168, 85, 247, 0.2)',
    border: 'rgba(168, 85, 247, 0.45)',
    metric: 'Auto Quotes',
    tag: 'Revenue Engine',
  },
  {
    icon: Factory,
    title: 'Shop-Floor Production & BOM',
    desc: 'Plan, sequence, and dispatch manufacturing schedules from multi-tier Bill of Materials to finished serialized goods.',
    span: 'lg:col-span-2',
    spotlight: 'rgba(120, 119, 240, 0.22)',
    border: 'rgba(147, 130, 255, 0.5)',
    metric: 'BOM Routing',
    tag: 'Smart Factory',
  },
  {
    icon: Wallet,
    title: 'Autonomous Finance & Ledger',
    desc: 'Automated 3-way matching, continuous audit reconciliations, receivables management, and multi-currency ledgers.',
    span: 'lg:col-span-2',
    spotlight: 'rgba(52, 211, 153, 0.2)',
    border: 'rgba(52, 211, 153, 0.45)',
    metric: 'Zero-Touch Ledger',
    tag: 'Continuous Audit',
  },
  {
    icon: Truck,
    title: 'Fleet & Global Logistics',
    desc: 'Real-time GPS dispatching, carrier rate shopping, customs documentation, and delivery SLA predictions.',
    span: '',
    spotlight: 'rgba(251, 146, 60, 0.2)',
    border: 'rgba(251, 146, 60, 0.45)',
    metric: 'Live Route Tracking',
    tag: 'Global Supply',
  },
  {
    icon: Users,
    title: 'Workforce & Shift Matrix',
    desc: 'Dynamic shift scheduling, skill-based labor allocation, compliance certifications, and productivity analytics.',
    span: '',
    spotlight: 'rgba(147, 130, 255, 0.2)',
    border: 'rgba(147, 130, 255, 0.45)',
    metric: 'Skill Allocation',
    tag: 'HR Ops',
  },
  {
    icon: ClipboardCheck,
    title: 'Procurement & Vendor Portal',
    desc: 'Automated RFQ bidding, vendor compliance ratings, automated PO generation, and contract threshold alerts.',
    span: '',
    spotlight: 'rgba(56, 189, 248, 0.22)',
    border: 'rgba(56, 189, 248, 0.5)',
    metric: 'Auto-PO Generator',
    tag: 'Procurement',
  },
  {
    icon: ShieldCheck,
    title: 'Quality & Regulatory Compliance',
    desc: 'In-line tolerance inspections, batch traceability, non-conformance remediation workflows, and ISO/FDA audits.',
    span: '',
    spotlight: 'rgba(52, 211, 153, 0.2)',
    border: 'rgba(52, 211, 153, 0.45)',
    metric: '100% Traceability',
    tag: 'Audit Ready',
  },
]

export function Platform() {
  return (
    <section id="platform" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background radial glows */}
      <div className="pointer-events-none absolute -left-40 top-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 -z-10 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Composable Modular Engine"
          title={
            <>
              Every module your enterprise demands,{' '}
              <span className="text-gradient">activated instantaneously</span>
            </>
          }
          description="GrowLabs functions as a single unified neural substrate. Toggle on precisely the modules your operation requires, and enjoy unified real-time data sync across every department."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={m.span}
            >
              <SpotlightCard
                spotlightColor={m.spotlight}
                borderColor={m.border}
                className="h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground transition-transform duration-300 group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/10">
                      <m.icon className="size-5.5 text-accent" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-foreground">
                      {m.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-gradient transition-colors">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                  <div className="flex items-center gap-1.5 text-accent font-medium">
                    <Sparkles className="size-3" />
                    <span>{m.metric}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground">
                    <span>Explore</span>
                    <ArrowUpRight className="size-3.5" />
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
