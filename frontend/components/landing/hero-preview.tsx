'use client'

import { motion } from 'motion/react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  DollarSign,
  Factory,
  ShoppingCart,
  Sparkles,
} from 'lucide-react'
import { CountUp } from '@/components/animated/count-up'
import { formatCurrency } from '@/lib/format'

const bars = [42, 58, 51, 66, 72, 63, 80, 74, 88, 82, 94, 90]

export function HeroPreview() {
  return (
    <div className="relative">
      {/* glow */}
      <div className="pointer-events-none absolute -inset-6 -z-10 bg-glow blur-2xl" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="rounded-2xl border border-border glass p-3 shadow-2xl shadow-black/40"
      >
        {/* window chrome */}
        <div className="mb-3 flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-warning/60" />
            <span className="size-2.5 rounded-full bg-success/60" />
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground">
            <Activity className="size-3 text-accent" />
            PrimeFlow Manufacturing · Live
          </div>
          <div className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[11px] font-medium text-success">
            Health 87
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: DollarSign, label: 'Revenue', value: 2840000, currency: true, change: '+8.8%' },
            { icon: ShoppingCart, label: 'Orders', value: 142, change: '+4.1%' },
            { icon: Boxes, label: 'Inventory', value: 3760000, currency: true, change: '+2.9%' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-border bg-card/60 p-3">
              <div className="mb-2 flex items-center justify-between">
                <kpi.icon className="size-4 text-primary" />
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-success">
                  <ArrowUpRight className="size-3" />
                  {kpi.change}
                </span>
              </div>
              <div className="text-sm font-semibold text-foreground">
                {kpi.currency ? (
                  <CountUp value={kpi.value} format={(n) => formatCurrency(n, { compact: true })} />
                ) : (
                  <CountUp value={kpi.value} />
                )}
              </div>
              <div className="text-[11px] text-muted-foreground">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* chart + side */}
        <div className="mt-2.5 grid grid-cols-5 gap-2.5">
          <div className="col-span-3 rounded-xl border border-border bg-card/60 p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Production Output</span>
              <Factory className="size-3.5 text-accent" />
            </div>
            <div className="flex h-24 items-end gap-1.5">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.05, ease: 'easeOut' }}
                  className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-accent/80"
                />
              ))}
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-2.5">
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-accent" />
                <span className="text-[11px] font-semibold text-foreground">AI Recommendation</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Reorder Copper Wire 6mm — demand spike expected in 12 days.
              </p>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
              <p className="text-[11px] leading-relaxed text-foreground/90">
                Bearing 32 stockout risk on 3 production orders.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute -left-5 top-[58%] hidden rounded-xl border border-border glass px-3 py-2 shadow-xl lg:block"
      >
        <div className="text-[10px] text-muted-foreground">Stockout risk</div>
        <div className="text-sm font-semibold text-warning">18% shortage</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="absolute -right-4 bottom-8 hidden rounded-xl border border-border glass px-3 py-2 shadow-xl md:block"
      >
        <div className="text-[10px] text-muted-foreground">Order SO-10482</div>
        <div className="text-sm font-semibold text-success">82% ready</div>
      </motion.div>
    </div>
  )
}
