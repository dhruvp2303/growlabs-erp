'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Store,
  ShoppingBag,
  Building,
  Shirt,
  Utensils,
  Wrench,
  Truck,
  Factory,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Activity,
} from 'lucide-react'
import { SectionHeading } from '@/components/landing/section-heading'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { cn } from '@/lib/utils'

const industries = [
  {
    id: 'retail_shop',
    icon: Store,
    label: 'Small Retail Shop',
    headline: 'Lightning-fast mobile barcode billing, inventory & customer credit ledger',
    modules: ['Phone/Tablet Barcode Scan', '1-Click WhatsApp Invoices', 'Daily Cashflow & Expenses', 'Customer Credit (Khata) Ledger'],
    outcome: 'Eliminates billing lines and manual register books with zero expensive hardware required.',
    stat: 'Zero Hardware Cost',
    badge: 'Kirana & Local Shops',
    spotlight: 'rgba(120, 119, 240, 0.25)',
    border: 'rgba(147, 130, 255, 0.5)',
  },
  {
    id: 'supermarket',
    icon: ShoppingBag,
    label: 'Supermarket & Grocery',
    headline: 'High-speed barcode checkout, batch expiry alerts & automatic supplier POs',
    modules: ['High-Velocity Barcode POS', 'Batch Expiry & Waste Alarms', 'Auto-Replenishment POs', 'Shelf-Space Turnover BI'],
    outcome: 'Never let expired goods reach checkout shelves while keeping high-turnover FMCG items 100% stocked.',
    stat: '99.8% Fill Rate',
    badge: 'High-Volume Grocery',
    spotlight: 'rgba(56, 189, 248, 0.25)',
    border: 'rgba(56, 189, 248, 0.5)',
  },
  {
    id: 'mall_store',
    icon: Building,
    label: 'Mall Store / Chains',
    headline: 'Multi-outlet live stock synchronization, cashier shifts & central analytics',
    modules: ['Inter-Store Stock Transfer', 'Cashier Shift Reconciliations', 'VIP Customer Loyalty Program', 'Consolidated Chain Revenue BI'],
    outcome: 'Transfer stock between mall outlets with one tap and track sales across all stores in real time.',
    stat: 'Instant Multi-Store Sync',
    badge: 'Multi-Outlet Chains',
    spotlight: 'rgba(168, 85, 247, 0.25)',
    border: 'rgba(168, 85, 247, 0.5)',
  },
  {
    id: 'clothing',
    icon: Shirt,
    label: 'Clothing & Boutique',
    headline: 'Size (XS–XXL) & Color variant matrix with custom barcode tag printing',
    modules: ['Size × Color × Fabric Matrix', 'Custom Clothing Barcode Tags', 'Seasonal Discount Campaigns', 'Exchanges & Return Tracking'],
    outcome: 'Track every individual size and color variant accurately without confusing inventory counts.',
    stat: 'Zero Size Stockouts',
    badge: 'Apparel & Fashion',
    spotlight: 'rgba(236, 72, 153, 0.25)',
    border: 'rgba(236, 72, 153, 0.5)',
  },
  {
    id: 'restaurant',
    icon: Utensils,
    label: 'Restaurant & F&B',
    headline: 'Recipe ingredient auto-deduction, waste logs & table/kitchen POS',
    modules: ['Recipe-Level Ingredient Deduct', 'Kitchen Order Ticket (KOT) Display', 'Daily Food Wastage Tracking', 'Supplier Ingredient POs'],
    outcome: 'Deducts exact grams of cheese, sauce, and dough as orders sell — pinpointing food cost leakage.',
    stat: '18% Less Food Waste',
    badge: 'Cafe, Cloud Kitchen & Dining',
    spotlight: 'rgba(251, 146, 60, 0.25)',
    border: 'rgba(251, 146, 60, 0.5)',
  },
  {
    id: 'services',
    icon: Wrench,
    label: 'Service & Repair Shop',
    headline: 'Appointment scheduling, technician labor tracking & parts inventory',
    modules: ['Job Ticket & Dispatch Matrix', 'Spare Parts Stock Control', 'Technician Labor Billing', 'Instant Digital GST Invoicing'],
    outcome: 'Dispatches technicians with the right parts and sends customer invoices the instant repairs finish.',
    stat: '94% First-Time Fix',
    badge: 'Auto, Repair & Field Tech',
    spotlight: 'rgba(52, 211, 153, 0.25)',
    border: 'rgba(52, 211, 153, 0.5)',
  },
  {
    id: 'distribution',
    icon: Truck,
    label: 'Distributor & Wholesale',
    headline: 'Multi-warehouse logistics, fleet telematics, bulk pricing & B2B orders',
    modules: ['Multi-Warehouse Cross-Docking', 'Live GPS Fleet Tracking', 'Tiered Bulk Wholesale Pricing', 'Credit Limit & AR Aging'],
    outcome: 'Accelerates wholesale dispatch cycles while keeping tight control over accounts receivable and credit.',
    stat: '3.2x Faster Fulfillment',
    badge: 'B2B Wholesale Hubs',
    spotlight: 'rgba(56, 189, 248, 0.25)',
    border: 'rgba(56, 189, 248, 0.5)',
  },
  {
    id: 'manufacturing',
    icon: Factory,
    label: 'Manufacturing & Factory',
    headline: 'Multi-tier BOM manufacturing, shop-floor dispatching & quality assurance',
    modules: ['Multi-Tier Bill of Materials', 'Shop Floor Line Sequencing', 'Batch / Lot Traceability Vault', 'In-Line QC Inspections'],
    outcome: 'Eliminates unexpected assembly line stoppages with proactive raw material shortfall warnings.',
    stat: '99.4% Line Uptime',
    badge: 'Smart Factory',
    spotlight: 'rgba(120, 119, 240, 0.25)',
    border: 'rgba(147, 130, 255, 0.5)',
  },
]

export function Industries() {
  const [active, setActive] = useState(industries[0].id)
  const current = industries.find((i) => i.id === active)!

  return (
    <section id="industries" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Engineered For Every Business Scale"
          title={
            <>
              From single-counter shops to multi-site factories,{' '}
              <span className="text-gradient">GrowLabs adapts to you</span>
            </>
          }
          description="Select your exact business type below to explore how GrowLabs configures workflows, eliminates bloated menus, and activates only what your staff uses daily."
        />

        {/* Industry Selector Tabs with Spring Pill */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {industries.map((ind) => {
            const isSelected = active === ind.id
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setActive(ind.id)}
                className={cn(
                  'relative flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-colors duration-200',
                  isSelected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="industry-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-primary/50 bg-primary/20 shadow-md shadow-primary/20"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <ind.icon className="size-4 text-accent" />
                <span>{ind.label}</span>
              </button>
            )
          })}
        </div>

        {/* Industry Showcase Card */}
        <div className="mt-10 mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <SpotlightCard
                spotlightColor={current.spotlight}
                borderColor={current.border}
                className="p-7 sm:p-10"
              >
                <div className="grid gap-8 lg:grid-cols-12 items-center">
                  {/* Left Info */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30">
                        <current.icon className="size-6" />
                      </span>
                      <div>
                        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 text-[11px] font-semibold text-accent">
                          {current.badge}
                        </span>
                        <div className="text-xs text-muted-foreground mt-0.5">Tailored operational profile</div>
                      </div>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                      {current.headline}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {current.outcome}
                    </p>

                    <div className="pt-3 flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3.5 py-2 text-xs font-semibold text-success">
                        <Activity className="size-4" />
                        <span>Core Benefit: {current.stat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Module Matrix */}
                  <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-background/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent">
                        Essential Modules Activated
                      </span>
                      <Sparkles className="size-3.5 text-accent" />
                    </div>

                    <ul className="grid gap-3">
                      {current.modules.map((mod) => (
                        <li
                          key={mod}
                          className="flex items-center gap-2.5 text-xs font-medium text-foreground/90 rounded-lg bg-white/[0.03] border border-white/5 p-2.5"
                        >
                          <CheckCircle2 className="size-4 text-primary shrink-0" />
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
