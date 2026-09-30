'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  Store,
  ShoppingBag,
  Building,
  Shirt,
  Utensils,
  Wrench,
  Truck,
  Factory,
  Pill,
  Car,
  Tractor,
  HardHat,
  Gem,
  BookOpen,
  Crown,
  Camera,
  PartyPopper,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { BrandAside } from '@/components/onboarding/brand-aside'
import { useOnboarding, type IndustryId, type Priority } from '@/lib/onboarding/store'
import { cn } from '@/lib/utils'

const industries: { id: IndustryId; label: string; description: string; icon: any; tag: string }[] = [
  { id: 'retail_shop', label: 'Small Retail Shop', description: 'Inventory, fast POS billing, purchases, expenses & customer ledger', icon: Store, tag: 'Kirana / Local Shop' },
  { id: 'supermarket', label: 'Supermarket & Grocery', description: 'Barcode scanning, POS, suppliers, batch expiry dates & analytics', icon: ShoppingBag, tag: 'High-Volume POS' },
  { id: 'mall_store', label: 'Mall Store / Chain', description: 'Multi-outlet stock sync, staff management, loyalty & expense tracking', icon: Building, tag: 'Multi-Store' },
  { id: 'clothing', label: 'Clothing & Fashion Store', description: 'Size/Color/Fabric matrix, barcode tags, POS, discounts & returns', icon: Shirt, tag: 'Variant Matrix' },
  { id: 'costume_rental', label: 'Costume & Bridal Dress Rental', description: 'Bridal wear, suits, security deposit hold, return condition check & dry-cleaning', icon: Crown, tag: 'Fashion Rental' },
  { id: 'library', label: 'Library & Book Rental', description: 'ISBN barcode catalog, member card check-in/out, due date return alarms & fines', icon: BookOpen, tag: 'Book Circulation' },
  { id: 'equipment_rental', label: 'Equipment & Camera Rental', description: 'Camera gear, sound systems, tools, daily/hourly rent timers & deposit escrow', icon: Camera, tag: 'Gear & Tools' },
  { id: 'event_rental', label: 'Event, Tent & Party Rental', description: 'Tents, sound, lights, wedding furniture, dispatch schedule & event pickup', icon: PartyPopper, tag: 'Event Logistics' },
  { id: 'restaurant', label: 'Restaurant & F&B', description: 'Recipe ingredient tracking, waste logs, daily cashflow & table/POS orders', icon: Utensils, tag: 'Recipe BOM' },
  { id: 'services', label: 'Service & Repair Shop', description: 'Appointments, customer tickets, technician labor, parts stock & invoices', icon: Wrench, tag: 'Field Tech & Jobs' },
  { id: 'distribution', label: 'Distributor & Wholesaler', description: 'Multi-warehouse, wholesale orders, fleet dispatch, supplier POs & B2B GST', icon: Truck, tag: 'Logistics Hub' },
  { id: 'manufacturing', label: 'Manufacturer & Factory', description: 'Multi-level BOM, raw materials, production line scheduling & QC inspection', icon: Factory, tag: 'Smart Factory' },
  { id: 'pharmacy', label: 'Pharmacy & Medical Store', description: 'Drug salt matrix, batch expiry alarms, supplier reordering & doctor Rx logs', icon: Pill, tag: 'Pharma / Batch QC' },
  { id: 'automobile', label: 'Automobile & Spare Parts', description: 'Make/Model part fitment matrix, job cards, mechanic labor & warranty tracking', icon: Car, tag: 'Auto & Fitment' },
  { id: 'agriculture', label: 'Agriculture & Agro-Trading', description: 'Crop harvest batches, fertilizer inputs, weighbridge logs & farmer payouts', icon: Tractor, tag: 'Agro & Commodities' },
  { id: 'jewelry', label: 'Jewelry & Luxury Goods', description: 'Gold/Silver live rate calculations, making charges, purity certificates & vault stock', icon: Gem, tag: 'Purity & Bullion' },
  { id: 'construction', label: 'Construction & Contracting', description: 'Job costing, subcontractor draw approvals, site material dispatch & equipment logs', icon: HardHat, tag: 'Project Costing' },
  { id: 'other', label: '✨ Other / Custom Business', description: 'Custom manufacturing, hybrid services, niche retail or proprietary workflows', icon: Sparkles, tag: 'Custom Architecture' },
]

const painPoints: string[] = [
  'Stockouts & not knowing exact quantities in real time',
  'Tracking items on rent, overdue returns & missing deposits',
  'Slow customer checkout & long billing queues',
  'Manual spreadsheet entry & bookkeeping mistakes',
  'Expired stock, shrinkage & ingredient wastage',
  'Tracking inventory across multiple stores or warehouses',
  'Chasing unpaid customer invoices & supplier credit',
  'Difficulty managing product variants (Sizes, Colors, Batches, ISBNs)',
  'Missing raw material or components when starting orders',
  'Lack of clear daily profit & expense visibility',
]

const priorities: { id: Priority; label: string; description: string }[] = [
  { id: 'pos', label: 'Fast POS & Billing', description: 'Speed up customer checkout and print/WhatsApp invoices' },
  { id: 'rentals', label: 'Rental & Asset Check-In/Out', description: 'Manage security deposits, return dates, late fees & damage inspections' },
  { id: 'inventory', label: 'Live Stock Control', description: 'Real-time quantities, low-stock alarms & barcode tags' },
  { id: 'cost', label: 'Expense & Waste Reduction', description: 'Cut shrinkage, expired goods and unnecessary spending' },
  { id: 'recipes', label: 'Recipe / BOM Breakdown', description: 'Auto-deduct raw materials or ingredients as orders sell' },
  { id: 'visibility', label: 'Daily Profit Insights', description: 'Clear dashboards for revenue, cash in hand & margins' },
  { id: 'automation', label: 'AI Reordering & Reminders', description: 'Auto-generate supplier POs and payment reminders' },
  { id: 'custom', label: 'Bespoke Custom Features', description: 'Custom data fields, unique workflows & proprietary triggers' },
]

const currentTools: string[] = [
  'Paper notebooks / Register book',
  'Excel / Google Sheets',
  'Vyapar / Tally / QuickBooks',
  'Petpooja / Posist (F&B POS)',
  'Shopify / WooCommerce',
  'Multiple disconnected apps',
  'Nothing structured yet (Fresh Setup)',
]

const steps = ['Business Type', 'Store Specifics', 'Challenges', 'Operations']

export default function DiscoveryPage() {
  const router = useRouter()
  const { state, update, markStep } = useOnboarding()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validateStep(): boolean {
    const e: Record<string, string> = {}

    if (step === 0) {
      if (!state.industry) e.industry = 'Select your business type'
      if (state.industry === 'other' && !state.customIndustryName?.trim()) {
        e.customIndustryName = 'Please enter your business or industry name'
      }
    }

    if (step === 2) {
      if (state.painPoints.length === 0) e.painPoints = 'Select at least one challenge'
      if (!state.goals.trim()) e.goals = 'Tell us your #1 daily business struggle'
    }

    if (step === 3) {
      if (!state.currentTools.length) e.currentTools = 'Select your current tools or register'
      if (!state.monthlyOrders.trim()) e.monthlyOrders = 'Enter approx monthly bills/orders'
      if (!state.teamCount.trim()) e.teamCount = 'Enter staff/team size'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (!validateStep()) return
    if (step < steps.length - 1) {
      setDir(1)
      setStep((s) => s + 1)
    }
  }

  function back() {
    setDir(-1)
    setStep((s) => Math.max(0, s - 1))
  }

  async function finish() {
    if (!validateStep()) return
    setSubmitting(true)
    markStep('discovery')
    await new Promise((r) => setTimeout(r, 1200))
    router.push('/onboarding/analysis')
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,440px)_1fr]">
      <BrandAside
        eyebrow="Universal ERP Engine"
        title="Bespoke ERP for Any Business Size"
        points={[
          '15-Day full-access free trial',
          'Retail, rentals, libraries, and factories',
          'Phone & tablet camera barcode billing',
          'AI custom feature builder for unique needs',
        ]}
      />

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" aria-label="GrowLabs home">
            <Logo />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-6">
          {/* Stepper */}
          <div className="mb-6 flex items-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'inline-flex size-6.5 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                      i < step && 'bg-primary text-primary-foreground',
                      i === step && 'border-2 border-primary text-primary',
                      i > step && 'border border-border text-muted-foreground',
                    )}
                  >
                    {i < step ? <Check className="size-3" /> : i + 1}
                  </span>
                  <span
                    className="hidden text-xs font-medium sm:inline"
                    style={{ color: i <= step ? 'currentColor' : 'var(--muted-foreground)' }}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span
                    className={cn(
                      'h-px flex-1 transition-colors',
                      i < step ? 'bg-primary' : 'bg-border',
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Step 0: Business Type */}
              {step === 0 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">What type of business do you run?</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    GrowLabs configures your workspace and eliminates irrelevant features.
                  </p>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {industries.map((ind) => (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => {
                          update({ industry: ind.id })
                          if (errors.industry) setErrors({ ...errors, industry: '' })
                        }}
                        className={cn(
                          'flex flex-col justify-between rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer',
                          state.industry === ind.id
                            ? 'border-primary bg-primary/10 shadow-md shadow-primary/15'
                            : 'border-border/80 bg-card/40 hover:border-primary/40 hover:bg-card',
                        )}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="flex size-7.5 items-center justify-center rounded-lg bg-white/[0.05] border border-white/10 text-accent">
                            <ind.icon className="size-3.5" />
                          </span>
                          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                            {ind.tag}
                          </span>
                        </div>
                        <div>
                          <p className="font-display text-xs font-bold text-foreground">{ind.label}</p>
                          <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground line-clamp-2">
                            {ind.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Other Form */}
                  {state.industry === 'other' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-3.5 space-y-2.5"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
                        <Sparkles className="size-3.5" />
                        <span>Tell Us About Your Unique Business:</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          Business Name or Industry Sector:
                        </label>
                        <input
                          type="text"
                          value={state.customIndustryName || ''}
                          onChange={(e) => {
                            update({ customIndustryName: e.target.value })
                            if (errors.customIndustryName) setErrors({ ...errors, customIndustryName: '' })
                          }}
                          placeholder="E.g., Solar Installation, 3D Printing Lab, Specialty Ceramics"
                          className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-xs outline-none focus:border-primary text-foreground"
                        />
                        {errors.customIndustryName && (
                          <p className="text-[10px] text-destructive mt-1">{errors.customIndustryName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-foreground mb-1">
                          What is your primary product or service workflow?
                        </label>
                        <input
                          type="text"
                          value={state.industryDetails.customWorkflow || ''}
                          onChange={(e) => update({ industryDetails: { ...state.industryDetails, customWorkflow: e.target.value } })}
                          placeholder="E.g., We design custom molds, order raw resin, cure, and ship to B2B clients"
                          className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-xs outline-none focus:border-primary text-foreground"
                        />
                      </div>
                    </motion.div>
                  )}

                  {errors.industry && <p className="mt-3 text-xs text-destructive">{errors.industry}</p>}
                </div>
              )}

              {/* Step 1: Store & Operational Specifics */}
              {step === 1 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">Configure operational capabilities</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select the key tools and rules your staff needs on a daily basis:
                  </p>

                  <div className="mt-5 space-y-4 max-h-[340px] overflow-y-auto pr-1">
                    {/* Rental Outlets (Costume, Library, Equipment, Events) */}
                    {(state.industry === 'costume_rental' || state.industry === 'library' || state.industry === 'equipment_rental' || state.industry === 'event_rental') && (
                      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 space-y-2">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">Rental & Circulation Engine</span>
                        {[
                          { id: 'depositEscrow', label: 'Security deposit hold & escrow refund tracking' },
                          { id: 'returnAlarms', label: 'Automated return due-date WhatsApp reminders' },
                          { id: 'autoLateFines', label: 'Auto-calculate per-day overdue late fee penalties' },
                          { id: 'itemInspection', label: 'Return condition inspection (Clean, Damaged, Needs Wash)' },
                          { id: 'qrTagCheck', label: 'Fast barcode / QR check-out and check-in scanner' },
                        ].map((item) => (
                          <label key={item.id} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              onChange={(e) => update({ industryDetails: { ...state.industryDetails, [item.id]: e.target.checked } })}
                              className="rounded text-purple-400 focus:ring-purple-400 size-4"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Clothing/Fashion Specific */}
                    {state.industry === 'clothing' && (
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">Fashion Matrix</span>
                        {[
                          { id: 'variantMatrix', label: 'Size (XS, S, M, L, XL) & Color variant grid' },
                          { id: 'barcodeTags', label: 'Print custom clothing price barcode tags' },
                          { id: 'seasonalSales', label: 'Seasonal discount promotions & offers' },
                        ].map((item) => (
                          <label key={item.id} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              onChange={(e) => update({ industryDetails: { ...state.industryDetails, [item.id]: e.target.checked } })}
                              className="rounded text-primary focus:ring-primary size-4"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Pharmacy Specific */}
                    {state.industry === 'pharmacy' && (
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Pharmacy & Healthcare</span>
                        {[
                          { id: 'saltMatrix', label: 'Drug generic composition & chemical salt substitutes' },
                          { id: 'expiryAlarms', label: 'Strict batch expiration date warnings at checkout' },
                          { id: 'doctorRx', label: 'Doctor prescription & Schedule H drug dispensing logs' },
                        ].map((item) => (
                          <label key={item.id} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              onChange={(e) => update({ industryDetails: { ...state.industryDetails, [item.id]: e.target.checked } })}
                              className="rounded text-emerald-400 focus:ring-emerald-400 size-4"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Automobile Specific */}
                    {state.industry === 'automobile' && (
                      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 space-y-2">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">Auto & Spare Parts</span>
                        {[
                          { id: 'fitmentMatrix', label: 'Vehicle Make / Model / Year compatibility search' },
                          { id: 'jobCards', label: 'Workshop repair job cards & mechanic labor times' },
                          { id: 'oemPartLookup', label: 'OEM part number cross-referencing' },
                        ].map((item) => (
                          <label key={item.id} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              onChange={(e) => update({ industryDetails: { ...state.industryDetails, [item.id]: e.target.checked } })}
                              className="rounded text-blue-400 focus:ring-blue-400 size-4"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Restaurant Specific */}
                    {state.industry === 'restaurant' && (
                      <div className="rounded-xl border border-accent/20 bg-accent/5 p-3.5 space-y-2">
                        <span className="text-xs font-bold text-accent uppercase tracking-wide">Kitchen & Recipes</span>
                        {[
                          { id: 'recipeDeduction', label: 'Auto-deduct raw ingredients as dishes are sold' },
                          { id: 'kitchenDisplay', label: 'Kitchen Order Ticket (KOT) display' },
                          { id: 'dailyWastage', label: 'Daily wastage & spoilage tracking' },
                        ].map((item) => (
                          <label key={item.id} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              onChange={(e) => update({ industryDetails: { ...state.industryDetails, [item.id]: e.target.checked } })}
                              className="rounded text-accent focus:ring-accent size-4"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* General Retail & Supermarket */}
                    {(state.industry === 'retail_shop' || state.industry === 'supermarket' || state.industry === 'mall_store' || state.industry === 'jewelry') && (
                      <div className="rounded-xl border border-border bg-card/40 p-3.5 space-y-2">
                        <span className="text-xs font-bold text-foreground uppercase tracking-wide">POS & Checkout</span>
                        {[
                          { id: 'mobileScan', label: 'Phone/Tablet camera barcode scanning (zero hardware cost)' },
                          { id: 'whatsappBill', label: '1-Click WhatsApp & SMS digital receipts' },
                          { id: 'customerCredit', label: 'Customer credit ledger (Khata / Pay Later)' },
                          { id: 'multiStore', label: 'Transfer stock between multiple outlets' },
                        ].map((item) => (
                          <label key={item.id} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              onChange={(e) => update({ industryDetails: { ...state.industryDetails, [item.id]: e.target.checked } })}
                              className="rounded text-primary focus:ring-primary size-4"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Manufacturing & Distribution */}
                    {(state.industry === 'manufacturing' || state.industry === 'distribution' || state.industry === 'construction' || state.industry === 'other') && (
                      <div className="rounded-xl border border-border bg-card/40 p-3.5 space-y-2">
                        <span className="text-xs font-bold text-foreground uppercase tracking-wide">Operations & Workflows</span>
                        {[
                          { id: 'multiBom', label: 'Multi-level Bill of Materials (BOM) & assembly sequencing' },
                          { id: 'lotTrace', label: 'Batch / Lot number traceability & expiry tracking' },
                          { id: 'multiDc', label: 'Multi-warehouse inter-branch transfers' },
                          { id: 'supplierRfqs', label: 'Automated Purchase Orders & supplier scorecards' },
                        ].map((item) => (
                          <label key={item.id} className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              onChange={(e) => update({ industryDetails: { ...state.industryDetails, [item.id]: e.target.checked } })}
                              className="rounded text-primary focus:ring-primary size-4"
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Challenges */}
              {step === 2 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">What is your biggest daily struggle?</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select your friction points and describe your main bottleneck:
                  </p>

                  <div className="mt-4 space-y-2 max-h-[170px] overflow-y-auto pr-1">
                    {painPoints.map((point) => (
                      <button
                        key={point}
                        type="button"
                        onClick={() => {
                          const updated = state.painPoints.includes(point)
                            ? state.painPoints.filter((p) => p !== point)
                            : [...state.painPoints, point]
                          update({ painPoints: updated })
                          if (errors.painPoints) setErrors({ ...errors, painPoints: '' })
                        }}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-lg border p-2.5 text-left text-xs transition-colors cursor-pointer',
                          state.painPoints.includes(point)
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-card/40 hover:border-primary/40',
                        )}
                      >
                        <div
                          className={cn(
                            'size-3.5 rounded border transition-colors flex items-center justify-center shrink-0',
                            state.painPoints.includes(point)
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border',
                          )}
                        >
                          {state.painPoints.includes(point) && <Check className="size-2.5" />}
                        </div>
                        <span className="font-medium text-foreground">{point}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Describe in plain words (AI Auto-Parser):</label>
                    <textarea
                      value={state.goals}
                      onChange={(e) => {
                        update({ goals: e.target.value })
                        if (errors.goals) setErrors({ ...errors, goals: '' })
                      }}
                      placeholder="E.g., We rent bridal dresses and equipment, but keeping track of return dates, customer deposits, and damage fines takes hours on spreadsheets."
                      className="w-full rounded-xl border border-white/10 bg-background/80 p-3 text-xs outline-none focus:border-primary text-foreground"
                      rows={2.5}
                    />
                    {errors.goals && <p className="text-xs text-destructive">{errors.goals}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Operations & Scale */}
              {step === 3 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">Current operations & scale</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Helps us calibrate database throughput and seed starter inventory data.
                  </p>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-foreground">Current bookkeeping tool</label>
                      <div className="grid grid-cols-2 gap-2">
                        {currentTools.slice(0, 4).map((tool) => (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => update({ currentTools: [tool] })}
                            className={cn(
                              'rounded-lg border p-2 text-left text-xs transition-colors font-medium cursor-pointer',
                              state.currentTools.includes(tool)
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'border-border bg-card/40 text-muted-foreground hover:border-primary/40',
                            )}
                          >
                            {tool}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-foreground">Monthly Bills / Orders</label>
                        <input
                          type="text"
                          value={state.monthlyOrders}
                          onChange={(e) => update({ monthlyOrders: e.target.value })}
                          placeholder="E.g., 300 bills, 2,000 orders"
                          className="w-full rounded-lg border border-border bg-background/80 p-2.5 text-xs outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-foreground">Staff / Cashiers</label>
                        <input
                          type="text"
                          value={state.teamCount}
                          onChange={(e) => update({ teamCount: e.target.value })}
                          placeholder="E.g., 1-3, 5-10"
                          className="w-full rounded-lg border border-border bg-background/80 p-2.5 text-xs outline-none focus:border-primary text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-4">
            {step > 0 && (
              <Button variant="outline" size="sm" className="h-10 px-4 text-xs" onClick={back}>
                <ArrowLeft className="size-3.5" data-icon="inline-start" />
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button size="sm" className="h-10 flex-1 text-xs font-semibold" onClick={next}>
                Continue
                <ArrowRight className="size-3.5" data-icon="inline-end" />
              </Button>
            ) : (
              <Button size="sm" className="h-10 flex-1 text-xs font-bold" onClick={finish} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
                    Synthesizing Custom ERP Blueprint…
                  </>
                ) : (
                  <>
                    Build My Tailored ERP
                    <ArrowRight className="size-3.5" data-icon="inline-end" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
