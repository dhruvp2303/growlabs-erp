'use client'

import { useState } from 'react'
import {
  ShoppingCart,
  Package,
  Factory,
  TrendingUp,
  Wrench,
  Truck,
  Wallet,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function DepartmentFlow() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      id: 'sales',
      title: '1. Sales Order',
      dept: 'Sales & CRM',
      icon: ShoppingCart,
      event: 'Customer order SO-10482 created for 100 Water Pump Motors',
      impact: 'Triggers instant stock availability scan across all warehouse hubs.',
      status: 'complete',
    },
    {
      id: 'inventory',
      title: '2. Stock Allocation',
      dept: 'Inventory',
      icon: Package,
      event: '60 units reserved in Dallas DC; 40 units identified as required production',
      impact: 'Prevents double-booking and locks inventory for customer delivery.',
      status: 'complete',
    },
    {
      id: 'production',
      title: '3. Manufacturing Run',
      dept: 'Production & BOM',
      icon: Factory,
      event: 'MO-2202 scheduled on Plant A Line 2 for 40 units',
      impact: 'Decomposes BOM: 240m Copper, 20 Steel Sheets, 80 Bearings allocated.',
      status: 'active',
    },
    {
      id: 'procurement',
      title: '4. Supplier Replenish',
      dept: 'Procurement',
      icon: TrendingUp,
      event: 'PO-3390 automatically drafted for missing Bearing 32 stock buffer',
      impact: 'Sent to Precision Bearings Intl. with guaranteed 8-day lead cycle.',
      status: 'pending',
    },
    {
      id: 'quality',
      title: '5. Quality Assurance',
      dept: 'Quality Control',
      icon: Wrench,
      event: 'Inspection protocol QC-556 assigned to Batch #WPM-0826',
      impact: 'Batch tested for vibration and heat tolerances before warehouse receipt.',
      status: 'pending',
    },
    {
      id: 'logistics',
      title: '6. Freight Dispatch',
      dept: 'Logistics',
      icon: Truck,
      event: 'Shipment SHP-8801 booked via FreightLine carrier container',
      impact: 'Real-time GPS tracking and waypoint logs updated for customer.',
      status: 'pending',
    },
    {
      id: 'finance',
      title: '7. Invoicing & Ledger',
      dept: 'Finance',
      icon: Wallet,
      event: 'Invoice INV-2102 generated ($48,000) upon bill of lading signoff',
      impact: 'Accounts receivable balance and cash flow projections updated in real time.',
      status: 'pending',
    },
  ]

  const current = steps[activeStep]

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold">
            <Sparkles className="size-3.5" />
            Connected Enterprise Data Graph
          </div>
          <h3 className="text-xl font-bold font-display mt-2">Unified Cross-Department Operations Flow</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Demonstrates how a single customer order coordinates real-time actions across all 7 departments.
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground">Order #SO-10482 Lifecycle</span>
      </div>

      {/* Horizontal Flow Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((s, idx) => {
          const Icon = s.icon
          const isSelected = activeStep === idx
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={cn(
                'flex flex-col items-start p-3 rounded-xl border text-left transition-all relative',
                isSelected
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                  : 'border-border bg-background/50 hover:border-primary/40',
              )}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <span
                  className={cn(
                    'size-2 rounded-full',
                    s.status === 'complete' && 'bg-success',
                    s.status === 'active' && 'bg-primary animate-ping',
                    s.status === 'pending' && 'bg-muted',
                  )}
                />
              </div>
              <p className="font-bold text-xs line-clamp-1">{s.title}</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{s.dept}</p>
            </button>
          )
        })}
      </div>

      {/* Step Detailed Card */}
      <div className="rounded-xl border border-primary/20 bg-background/60 p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30 font-bold">
              {current.dept}
            </Badge>
            <h4 className="font-bold text-sm text-foreground">{current.title}</h4>
          </div>
          <p className="text-sm font-semibold text-foreground">{current.event}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">&bull; System Impact: {current.impact}</p>
        </div>

        <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">State:</span>
            <Badge
              variant="outline"
              className={cn(
                'capitalize font-bold text-xs',
                current.status === 'complete' && 'bg-success/10 text-success border-success/30',
                current.status === 'active' && 'bg-primary/10 text-primary border-primary/30',
                current.status === 'pending' && 'bg-muted text-muted-foreground',
              )}
            >
              {current.status}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs font-semibold"
            onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
          >
            Advance to Next Department <ArrowRight className="size-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
