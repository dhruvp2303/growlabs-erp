'use client'

import { useState, useMemo } from 'react'
import {
  Settings,
  CreditCard,
  Users,
  Building,
  Check,
  Plus,
  RefreshCw,
  Sparkles,
  RotateCcw,
  Sliders,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { useOnboarding, type ModuleId, type RentalDuration } from '@/lib/onboarding/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShimmerButton } from '@/components/animated/shimmer-button'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

interface BillingModule {
  id: ModuleId
  name: string
  price: number
  desc: string
  category: string
}

export default function SettingsPage() {
  const { state, update } = useOnboarding()

  // Active settings tab
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'billing'>('billing')

  // Rental duration selector
  const [duration, setDuration] = useState<RentalDuration>(state.rentalDuration || '30_days')

  // Company Profile state
  const [compName, setCompName] = useState(state.companyName || 'PrimeFlow Retail & Manufacturing')
  const [compSize, setCompSize] = useState(state.companySize || '6-20 (Small Team)')

  // Available add-ons and pricing configuration
  const billingModules: BillingModule[] = [
    { id: 'pos', name: 'Fast Barcode POS & Thermal Billing', price: 10, desc: 'Mobile/Tablet cashier checkout & camera scanning.', category: 'Retail & POS' },
    { id: 'whatsapp', name: '1-Click WhatsApp Invoices & Reminders', price: 8, desc: 'Instant digital receipts without paper printers.', category: 'Customer' },
    { id: 'inventory', name: 'Stock Control & Multi-Location', price: 12, desc: 'Real-time stock quantities, low-stock alarms & barcode tags.', category: 'Core' },
    { id: 'sales', name: 'Sales Pipeline & Customer Ledger', price: 10, desc: 'Orders fulfillment pipelines & credit (Khata) ledger.', category: 'Core' },
    { id: 'procurement', name: 'Supplier Reordering & Auto-POs', price: 10, desc: 'Suppliers directory & automated purchase orders.', category: 'Supply' },
    { id: 'recipes', name: 'Recipe Ingredient Auto-Deduction', price: 12, desc: 'Auto-deduct raw food as dishes sell & track wastage.', category: 'F&B' },
    { id: 'production', name: 'Shop-Floor Routing & Multi-BOM', price: 20, desc: 'Assembly timelines, schedules & multi-tier BOMs.', category: 'Manufacturing' },
    { id: 'quality', name: 'Quality Control & Expiry Tracking', price: 15, desc: 'In-line inspections, defects catalog & batch expiry alarms.', category: 'Compliance' },
    { id: 'logistics', name: 'Live Carrier GPS & Route Logistics', price: 15, desc: 'Fleet dispatching, delivery SLAs & vehicle tracking.', category: 'Logistics' },
    { id: 'hr', name: 'Workforce Shifts & Attendance', price: 12, desc: 'Staff attendance tracking, shifts & leave requests.', category: 'Admin' },
    { id: 'finance', name: 'Finance & 3-Way Matching Ledger', price: 15, desc: 'Automated bank reconciliation & cash flow telemetry.', category: 'Finance' },
    { id: 'analytics', name: 'Deep Multi-Signal Analytics BI', price: 12, desc: 'Predictive sales forecasting & gross margin heatmaps.', category: 'Intelligence' },
  ]

  const durationDiscountMap: Record<RentalDuration, { discount: number; label: string }> = {
    '30_days': { discount: 0, label: '1 Month (30 Days)' },
    '3_months': { discount: 0.05, label: '3 Months (5% off)' },
    '6_months': { discount: 0.1, label: '6 Months (10% off)' },
    '1_year': { discount: 0.2, label: '1 Year (20% off)' },
  }

  const basePlanPrice = 39 // Growth Engine Base
  const activeDiscount = durationDiscountMap[duration].discount

  const addOnTotal = useMemo(() => {
    return billingModules
      .filter((m) => state.selectedModules.includes(m.id))
      .reduce((sum, m) => sum + m.price, 0)
  }, [state.selectedModules])

  const totalRawMonthly = basePlanPrice + addOnTotal
  const finalPrice = Math.round(totalRawMonthly * (1 - activeDiscount))

  const toggleBillingModule = (id: ModuleId) => {
    const isSelected = state.selectedModules.includes(id)
    const updated = isSelected
      ? state.selectedModules.filter((m) => m !== id)
      : [...state.selectedModules, id]
    update({ selectedModules: updated })

    if (isSelected) {
      toast.info(`Removed module: ${id.toUpperCase()}. Rental fee updated.`);
    } else {
      toast.success(`Rented module: ${id.toUpperCase()}. Available immediately.`);
    }
  }

  const handleUpdateSubscription = () => {
    update({ rentalDuration: duration })
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#818cf8', '#34d399'],
    })
    toast.success('Modular Rental Subscription Updated!', {
      description: `Active plan renewed for ${durationDiscountMap[duration].label} with ${state.selectedModules.length} custom modules.`,
    })
  }

  const saveProfile = () => {
    update({ companyName: compName, companySize: compSize as any })
    toast.success('Company profile successfully updated.')
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-2">
            <Settings className="size-3.5" />
            <span>Workspace Control Panel</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground">Workspace & Modular Rental Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure company profile, team permissions, and rent or toggle ERP features on demand.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        {[
          { id: 'profile', label: 'Company Profile' },
          { id: 'users', label: 'Users & Permissions' },
          { id: 'billing', label: 'Modular Rental Subscriptions (Netflix Model)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content: Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-xl rounded-2xl border border-white/10 bg-card/60 p-6 space-y-4 backdrop-blur-xl shadow-xl">
          <h3 className="text-lg font-bold font-display flex items-center gap-2 text-foreground">
            <Building className="size-5 text-accent" /> Profile Parameters
          </h3>
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Company Name</label>
              <input
                type="text"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                className="w-full bg-background/80 border border-white/10 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Company Scale</label>
              <select
                value={compSize}
                onChange={(e) => setCompSize(e.target.value as any)}
                className="w-full bg-background border border-white/10 px-3.5 py-2.5 rounded-xl text-sm outline-none focus:border-primary transition-colors text-foreground"
              >
                <option value="1-5 (Micro/Solo)">1-5 Staff (Micro/Solo Store)</option>
                <option value="6-20 (Small Team)">6-20 Staff (Small Business)</option>
                <option value="21-100 (Growing)">21-100 Staff (Growing Multi-Store)</option>
                <option value="101-500 (Mid-Enterprise)">101-500 Staff (Mid-Enterprise)</option>
                <option value="500+ (Industrial Scale)">500+ Staff (Industrial Plant)</option>
              </select>
            </div>
            <div className="pt-2">
              <Button className="w-full font-semibold" onClick={saveProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab content: Users */}
      {activeTab === 'users' && (
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-card/40 backdrop-blur-xl shadow-xl">
          <div className="p-5 border-b border-white/10 bg-white/[0.02]">
            <h3 className="text-lg font-bold font-display flex items-center gap-2 text-foreground">
              <Users className="size-5 text-primary" /> Roles & Authorization Matrix
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Manage staff roles, cashier access rights, and manager approval thresholds.</p>
          </div>
          <div className="p-6 space-y-3">
            {[
              { role: 'Owner / Administrator', desc: 'Full write access to financial ledgers, settings, and all active modules.', users: 1 },
              { role: 'Store Manager', desc: 'Full access to POS, inventory transfers, and vendor PO creation.', users: 3 },
              { role: 'Cashier / Operator', desc: 'Restricted POS billing & barcode scanning mode.', users: 8 }
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{r.role} <span className="text-xs font-normal text-muted-foreground">({r.users} active)</span></h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs border-white/10">Configure Rights</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab content: Modular Rental Billing */}
      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active modules toggle list */}
          <div className="rounded-2xl border border-white/10 bg-card/50 p-6 lg:col-span-8 space-y-6 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold font-display text-lg text-foreground">Personalize Your Active Modules</h3>
                  <span className="rounded-full bg-accent/15 border border-accent/30 px-2 py-0.5 text-[10px] font-bold text-accent">
                    Pay-As-You-Use
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Click any module to rent or remove. Features activate/deactivate instantly.</p>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {billingModules.map((m) => {
                const isSelected = state.selectedModules.includes(m.id)
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleBillingModule(m.id)}
                    className={cn(
                      'rounded-xl border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between h-36 select-none',
                      isSelected
                        ? 'border-primary bg-primary/15 shadow-md shadow-primary/10'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                    )}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-xs text-foreground leading-snug">{m.name}</p>
                          <Badge variant="outline" className="text-[9px] font-bold mt-1 tracking-wider uppercase bg-background/60 border-white/10">
                            {m.category}
                          </Badge>
                        </div>
                        <div
                          className={cn(
                            'size-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors',
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-white/20'
                          )}
                        >
                          {isSelected && <Check className="size-3" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed line-clamp-2">{m.desc}</p>
                    </div>
                    <div className="text-right border-t border-white/5 pt-2 text-xs font-mono font-bold text-accent">
                      +${m.price}/mo
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pricing breakdown and calculations */}
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 lg:col-span-4 flex flex-col justify-between backdrop-blur-xl shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold font-display flex items-center gap-2 text-foreground">
                  <CreditCard className="size-4 text-primary" /> Rental Cycle Calculator
                </h3>
              </div>

              {/* Rental Duration Options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-accent" />
                  <span>Choose Rental Term:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(durationDiscountMap) as RentalDuration[]).map((durKey) => {
                    const isSelected = duration === durKey
                    const durInfo = durationDiscountMap[durKey]
                    return (
                      <button
                        key={durKey}
                        type="button"
                        onClick={() => setDuration(durKey)}
                        className={cn(
                          'flex flex-col justify-between rounded-xl border p-2.5 text-left text-xs transition-all cursor-pointer',
                          isSelected
                            ? 'border-primary bg-primary/20 text-foreground font-semibold shadow-sm'
                            : 'border-white/5 bg-white/[0.02] text-muted-foreground hover:border-white/15'
                        )}
                      >
                        <span className="font-medium text-[11px] text-foreground">{durInfo.label}</span>
                        {durInfo.discount > 0 ? (
                          <span className="text-[10px] text-success font-bold mt-1">
                            Save {Math.round(durInfo.discount * 100)}%
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground mt-1">Standard</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Breakdown details */}
              <div className="space-y-2.5 pt-2 text-xs border-t border-white/10">
                <div className="flex justify-between font-medium text-muted-foreground">
                  <span>Growth Engine Base</span>
                  <span className="text-foreground">${basePlanPrice}/mo</span>
                </div>
                <div className="flex justify-between font-medium text-muted-foreground">
                  <span>Active Rented Modules ({state.selectedModules.length})</span>
                  <span className="text-foreground">+${addOnTotal}/mo</span>
                </div>
                {activeDiscount > 0 && (
                  <div className="flex justify-between text-success font-semibold border-b border-white/10 pb-2">
                    <span>Term Discount ({Math.round(activeDiscount * 100)}%)</span>
                    <span>-{Math.round(activeDiscount * 100)}%</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
                  <span className="text-sm font-bold text-foreground">Total Rental Fee</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold font-display text-foreground">{formatCurrency(finalPrice)}</span>
                    <span className="text-muted-foreground text-[10px] font-bold block">/ month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-6 space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground text-[10px] leading-relaxed">
                <RotateCcw className="size-3.5 text-accent shrink-0" />
                <span>Next billing cycle will automatically reflect any added or removed modules.</span>
              </div>
              <ShimmerButton className="w-full h-11 text-xs font-bold" onClick={handleUpdateSubscription}>
                <span>Confirm & Update Rental Plan</span>
              </ShimmerButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
