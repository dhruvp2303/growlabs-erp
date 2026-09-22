'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { BrandAside } from '@/components/onboarding/brand-aside'
import { useOnboarding, type IndustryId, type Priority } from '@/lib/onboarding/store'
import { cn } from '@/lib/utils'

const industries: { id: IndustryId; label: string; description: string }[] = [
  { id: 'manufacturing', label: 'Manufacturing', description: 'Production, BOM, quality control' },
  { id: 'distribution', label: 'Distribution', description: 'Warehousing, logistics, wholesale' },
  { id: 'retail', label: 'Retail', description: 'Multi-location, POS, inventory' },
  { id: 'agriculture', label: 'Agriculture', description: 'Farming operations, equipment' },
  { id: 'construction', label: 'Construction', description: 'Projects, equipment, subcontractors' },
  { id: 'services', label: 'Services', description: 'Field service, technicians, billing' },
]

const painPoints: string[] = [
  'Inventory management & stockouts',
  'Production delays',
  'Procurement bottlenecks',
  'Poor visibility into operations',
  'Manual data entry & errors',
  'Supplier delays',
  'Cash flow problems',
  'Quality issues',
  'Forecasting accuracy',
  'Department communication',
]

const priorities: { id: Priority; label: string; description: string }[] = [
  { id: 'inventory', label: 'Inventory', description: 'Get control of stock levels' },
  { id: 'cost', label: 'Cost Control', description: 'Reduce waste and expenses' },
  { id: 'growth', label: 'Growth', description: 'Scale operations efficiently' },
  { id: 'compliance', label: 'Compliance', description: 'Track and audit everything' },
  { id: 'visibility', label: 'Visibility', description: 'Real-time business insights' },
  { id: 'automation', label: 'Automation', description: 'Reduce manual work' },
]

const currentTools: string[] = [
  'Excel spreadsheets',
  'QuickBooks / Xero',
  'Shopify / WooCommerce',
  'Custom built system',
  'Nothing structured',
  'Multiple disconnected tools',
]

const steps = ['Industry', 'Specifications', 'Challenges', 'Priorities', 'Operations']

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
      if (!state.industry) e.industry = 'Select your industry'
    }
    
    if (step === 1) {
      // Validate dynamic industry specs
      if (state.industry === 'manufacturing') {
        if (!state.industryDetails.manufactureType?.trim()) {
          e.manufactureType = 'Describe what you manufacture'
        }
      }
      if (state.industry === 'retail') {
        if (!state.industryDetails.retailChannel) {
          e.retailChannel = 'Select your retail channel'
        }
      }
      if (state.industry === 'services') {
        if (!state.industryDetails.billingModel) {
          e.billingModel = 'Select your billing model'
        }
      }
    }

    if (step === 2) {
      if (state.painPoints.length === 0) e.painPoints = 'Select at least one challenge'
      if (!state.goals.trim()) e.goals = 'Tell us your biggest challenge'
    }

    if (step === 3) {
      if (state.priorities.length === 0) e.priorities = 'Select at least one priority'
    }

    if (step === 4) {
      if (!state.currentTools.length) e.currentTools = 'Select your current tools'
      if (!state.monthlyOrders.trim()) e.monthlyOrders = 'Enter monthly volume'
      if (!state.teamCount.trim()) e.teamCount = 'Enter team size'
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
        eyebrow="Business Discovery"
        title="Tell us how your business works"
        points={[
          'Industry-specific questions',
          'Understand your challenges',
          'Map your priorities',
          'AI learns your operations',
        ]}
      />

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" aria-label="GrowLabs home">
            <Logo />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          {/* Stepper */}
          <div className="mb-8 flex items-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                      i < step && 'bg-primary text-primary-foreground',
                      i === step && 'border-2 border-primary text-primary',
                      i > step && 'border border-border text-muted-foreground',
                    )}
                  >
                    {i < step ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  <span className="hidden text-xs font-medium sm:inline" 
                    style={{color: i <= step ? 'currentColor' : 'var(--muted-foreground)'}}>
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
              initial={{ opacity: 0, x: dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -24 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {/* Step 0: Industry */}
              {step === 0 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">What industry are you in?</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    This helps us tailor your ERP to your business
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    {industries.map((ind) => (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => {
                          update({ industry: ind.id })
                          if (errors.industry) setErrors({ ...errors, industry: '' })
                        }}
                        className={cn(
                          'rounded-lg border p-4 text-left transition-colors',
                          state.industry === ind.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/40 hover:bg-muted/30',
                        )}
                      >
                        <p className="font-medium">{ind.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{ind.description}</p>
                      </button>
                    ))}
                  </div>
                  {errors.industry && <p className="mt-3 text-xs text-destructive">{errors.industry}</p>}
                </div>
              )}

              {/* Step 1: Specifications (Dynamic) */}
              {step === 1 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    {state.industry === 'manufacturing' && 'Manufacturing Specs'}
                    {state.industry === 'retail' && 'Retail Specs'}
                    {state.industry === 'services' && 'Service Specs'}
                    {state.industry === 'distribution' && 'Distribution Specs'}
                    {state.industry === 'agriculture' && 'Agriculture Specs'}
                    {state.industry === 'construction' && 'Construction Specs'}
                    {!state.industry && 'Business Specs'}
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Tailoring GrowLabs for your operational workflows
                  </p>

                  <div className="mt-6 space-y-5 max-h-[320px] overflow-y-auto pr-1">
                    {state.industry === 'manufacturing' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">What do you manufacture?</label>
                          <input
                            type="text"
                            value={state.industryDetails.manufactureType || ''}
                            onChange={(e) => update({ industryDetails: { ...state.industryDetails, manufactureType: e.target.value } })}
                            placeholder="E.g., Water pumps, machinery, electronics"
                            className={cn(
                              'w-full rounded-lg border bg-background/60 px-3 py-2 text-sm outline-none transition-colors focus:border-primary',
                              errors.manufactureType ? 'border-destructive' : 'border-border'
                            )}
                          />
                          {errors.manufactureType && <p className="text-xs text-destructive mt-1">{errors.manufactureType}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1.5">Plants</label>
                            <input
                              type="number"
                              value={state.industryDetails.plantCount || ''}
                              onChange={(e) => update({ industryDetails: { ...state.industryDetails, plantCount: e.target.value } })}
                              placeholder="E.g., 2"
                              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1.5">Warehouses</label>
                            <input
                              type="number"
                              value={state.industryDetails.warehouseCount || ''}
                              onChange={(e) => update({ industryDetails: { ...state.industryDetails, warehouseCount: e.target.value } })}
                              placeholder="E.g., 3"
                              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Production Capabilities</label>
                          {[
                            { id: 'useBom', label: 'We use Bill of Materials (BOM)' },
                            { id: 'trackRawMaterials', label: 'We track raw materials inventory' },
                            { id: 'trackBatches', label: 'We track batches / lot numbers' },
                            { id: 'trackSerials', label: 'We track serial numbers' },
                            { id: 'performQA', label: 'We perform quality inspections' },
                            { id: 'manageCapacity', label: 'We manage production capacity' }
                          ].map((proc) => (
                            <button
                              key={proc.id}
                              type="button"
                              onClick={() => update({ industryDetails: { ...state.industryDetails, [proc.id]: !state.industryDetails[proc.id] } })}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                                state.industryDetails[proc.id]
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/40 hover:bg-muted/30',
                              )}
                            >
                              <div
                                className={cn(
                                  'size-4 rounded border transition-colors',
                                  state.industryDetails[proc.id]
                                    ? 'border-primary bg-primary'
                                    : 'border-border',
                                )}
                              />
                              <span className="text-sm font-medium">{proc.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {state.industry === 'retail' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Retail Channels</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Online Only', 'Brick & Mortar', 'Omnichannel'].map((ch) => (
                              <button
                                key={ch}
                                type="button"
                                onClick={() => {
                                  update({ industryDetails: { ...state.industryDetails, retailChannel: ch } })
                                  if (errors.retailChannel) setErrors({ ...errors, retailChannel: '' })
                                }}
                                className={cn(
                                  'rounded-lg border py-2 text-xs transition-colors font-medium',
                                  state.industryDetails.retailChannel === ch
                                    ? 'border-primary bg-primary/10 text-foreground'
                                    : 'border-border text-muted-foreground hover:border-primary/40'
                                )}
                              >
                                {ch}
                              </button>
                            ))}
                          </div>
                          {errors.retailChannel && <p className="text-xs text-destructive mt-1.5">{errors.retailChannel}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">POS System Used</label>
                          <input
                            type="text"
                            value={state.industryDetails.posSystem || ''}
                            onChange={(e) => update({ industryDetails: { ...state.industryDetails, posSystem: e.target.value } })}
                            placeholder="E.g., Square, Shopify POS, Clover"
                            className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Logistics Details</label>
                          {[
                            { id: 'shipThirdParty', label: 'We ship via UPS, FedEx, or DHL' },
                            { id: 'hasOwnDelivery', label: 'We manage our own delivery team' },
                            { id: 'use3pl', label: 'We use a 3rd Party Logistics (3PL) provider' }
                          ].map((log) => (
                            <button
                              key={log.id}
                              type="button"
                              onClick={() => update({ industryDetails: { ...state.industryDetails, [log.id]: !state.industryDetails[log.id] } })}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                                state.industryDetails[log.id]
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/40 hover:bg-muted/30',
                              )}
                            >
                              <div
                                className={cn(
                                  'size-4 rounded border transition-colors',
                                  state.industryDetails[log.id]
                                    ? 'border-primary bg-primary'
                                    : 'border-border',
                                )}
                              />
                              <span className="text-sm font-medium">{log.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {state.industry === 'services' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Billing Model</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Hourly Rate', 'Fixed Price', 'Monthly Retainer'].map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => {
                                  update({ industryDetails: { ...state.industryDetails, billingModel: m } })
                                  if (errors.billingModel) setErrors({ ...errors, billingModel: '' })
                                }}
                                className={cn(
                                  'rounded-lg border py-2 text-xs transition-colors font-medium',
                                  state.industryDetails.billingModel === m
                                    ? 'border-primary bg-primary/10 text-foreground'
                                    : 'border-border text-muted-foreground hover:border-primary/40'
                                )}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                          {errors.billingModel && <p className="text-xs text-destructive mt-1.5">{errors.billingModel}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Service Delivery</label>
                          {[
                            { id: 'hasFieldTechs', label: 'We dispatch technicians to field locations' },
                            { id: 'needsScheduling', label: 'We require booking & scheduling tools' },
                            { id: 'trackContracts', label: 'We manage service level agreements (SLAs)' }
                          ].map((srv) => (
                            <button
                              key={srv.id}
                              type="button"
                              onClick={() => update({ industryDetails: { ...state.industryDetails, [srv.id]: !state.industryDetails[srv.id] } })}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                                state.industryDetails[srv.id]
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/40 hover:bg-muted/30',
                              )}
                            >
                              <div
                                className={cn(
                                  'size-4 rounded border transition-colors',
                                  state.industryDetails[srv.id]
                                    ? 'border-primary bg-primary'
                                    : 'border-border',
                                )}
                              />
                              <span className="text-sm font-medium">{srv.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {(state.industry !== 'manufacturing' && state.industry !== 'retail' && state.industry !== 'services') && (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">Operational Specifics</label>
                          {[
                            { id: 'hasFleet', label: 'We manage our own delivery fleet/equipment' },
                            { id: 'trackBatches', label: 'We track inventory batches / lots' },
                            { id: 'tempControlled', label: 'We require temperature control' },
                            { id: 'siteTracking', label: 'We require multi-site/project tracking' }
                          ].map((spec) => (
                            <button
                              key={spec.id}
                              type="button"
                              onClick={() => update({ industryDetails: { ...state.industryDetails, [spec.id]: !state.industryDetails[spec.id] } })}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                                state.industryDetails[spec.id]
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/40 hover:bg-muted/30',
                              )}
                            >
                              <div
                                className={cn(
                                  'size-4 rounded border transition-colors',
                                  state.industryDetails[spec.id]
                                    ? 'border-primary bg-primary'
                                    : 'border-border',
                                )}
                              />
                              <span className="text-sm font-medium">{spec.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Challenges */}
              {step === 2 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">What are your biggest challenges?</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Select all that apply, then describe your #1 problem
                  </p>

                  <div className="mt-6 space-y-2 max-h-[180px] overflow-y-auto">
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
                          'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                          state.painPoints.includes(point)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/40 hover:bg-muted/30',
                        )}
                      >
                        <div
                          className={cn(
                            'size-4 rounded border transition-colors',
                            state.painPoints.includes(point)
                              ? 'border-primary bg-primary'
                              : 'border-border',
                          )}
                        />
                        <span className="text-sm font-medium">{point}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Describe your #1 business problem</label>
                      <span className="text-[11px] text-muted-foreground">Natural Language AI Parser</span>
                    </div>
                    <textarea
                      value={state.goals}
                      onChange={(e) => {
                        update({ goals: e.target.value })
                        if (errors.goals) setErrors({ ...errors, goals: '' })
                      }}
                      placeholder="E.g., We often receive large orders but don't know whether we have enough raw material to produce them."
                      className={cn(
                        'w-full rounded-lg border bg-background/60 px-3 py-2 text-sm outline-none transition-colors focus:border-primary',
                        errors.goals ? 'border-destructive' : 'border-border',
                      )}
                      rows={3}
                    />
                    {errors.goals && <p className="text-xs text-destructive">{errors.goals}</p>}

                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold py-1">Quick Try:</span>
                      {[
                        'We receive large orders without raw material visibility',
                        'Frequent stockouts & delayed supplier deliveries',
                        'Manual invoicing and slow payment tracking'
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => update({ goals: prompt })}
                          className="rounded-md border border-border/80 bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground hover:border-primary hover:text-primary transition-colors text-left"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    {/* Live AI Decoded Intent Badge */}
                    {state.goals.trim().length > 10 && (
                      <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs animate-in fade-in slide-in-from-top-1">
                        <div className="flex items-center gap-1.5 font-semibold text-primary">
                          <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
                          <span>GrowLabs AI Decoded Architecture:</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {state.goals.toLowerCase().includes('order') && <span className="rounded bg-primary/15 text-primary px-2 py-0.5 text-[11px] font-medium">🛒 Sales Order Intelligence</span>}
                          {(state.goals.toLowerCase().includes('raw') || state.goals.toLowerCase().includes('material') || state.goals.toLowerCase().includes('stockout')) && <span className="rounded bg-accent/20 text-accent px-2 py-0.5 text-[11px] font-medium">📦 Inventory & BOM</span>}
                          {(state.goals.toLowerCase().includes('produce') || state.goals.toLowerCase().includes('production')) && <span className="rounded bg-warning/20 text-warning px-2 py-0.5 text-[11px] font-medium">⚡ Production Scheduling</span>}
                          {(state.goals.toLowerCase().includes('supplier') || state.goals.toLowerCase().includes('deliver')) && <span className="rounded bg-success/20 text-success px-2 py-0.5 text-[11px] font-medium">🤝 Procurement Lead Times</span>}
                          {(state.goals.toLowerCase().includes('invoice') || state.goals.toLowerCase().includes('payment')) && <span className="rounded bg-primary/15 text-primary px-2 py-0.5 text-[11px] font-medium">💳 Finance & Cash Flow</span>}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {errors.painPoints && <p className="mt-3 text-xs text-destructive">{errors.painPoints}</p>}
                </div>
              )}

              {/* Step 3: Priorities */}
              {step === 3 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">What matters most?</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    What would have the biggest impact on your business right now?
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    {priorities.map((pri) => (
                      <button
                        key={pri.id}
                        type="button"
                        onClick={() => {
                          const updated = state.priorities.includes(pri.id)
                            ? state.priorities.filter((p) => p !== pri.id)
                            : [...state.priorities, pri.id]
                          update({ priorities: updated })
                          if (errors.priorities) setErrors({ ...errors, priorities: '' })
                        }}
                        className={cn(
                          'flex items-start gap-3 rounded-lg border p-4 text-left transition-colors',
                          state.priorities.includes(pri.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/40 hover:bg-muted/30',
                        )}
                      >
                        <div
                          className={cn(
                            'mt-1 size-4 shrink-0 rounded border transition-colors',
                            state.priorities.includes(pri.id)
                              ? 'border-primary bg-primary'
                              : 'border-border',
                          )}
                        />
                        <div>
                          <p className="font-medium">{pri.label}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{pri.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.priorities && <p className="mt-3 text-xs text-destructive">{errors.priorities}</p>}
                </div>
              )}

              {/* Step 4: Operations */}
              {step === 4 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">Tell us about your operations</h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    This helps us understand your scale
                  </p>

                  <div className="mt-6 space-y-6">
                    {/* Current Tools */}
                    <div>
                      <label className="mb-3 block text-sm font-medium">Current systems (select all)</label>
                      <div className="space-y-2">
                        {currentTools.map((tool) => (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => {
                              const updated = state.currentTools.includes(tool)
                                ? state.currentTools.filter((t) => t !== tool)
                                : [...state.currentTools, tool]
                              update({ currentTools: updated })
                              if (errors.currentTools) setErrors({ ...errors, currentTools: '' })
                            }}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                              state.currentTools.includes(tool)
                                ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/40 hover:bg-muted/30',
                              )}
                            >
                              <div
                                className={cn(
                                  'size-4 rounded border transition-colors',
                                  state.currentTools.includes(tool)
                                    ? 'border-primary bg-primary'
                                    : 'border-border',
                                )}
                              />
                              <span className="text-sm">{tool}</span>
                            </button>
                          ))}
                        </div>
                        {errors.currentTools && <p className="mt-2 text-xs text-destructive">{errors.currentTools}</p>}
                      </div>
  
                      {/* Monthly Volume */}
                      <div>
                        <label className="mb-2 block text-sm font-medium">Orders or transactions per month</label>
                        <input
                          type="text"
                          value={state.monthlyOrders}
                          onChange={(e) => {
                            update({ monthlyOrders: e.target.value })
                            if (errors.monthlyOrders) setErrors({ ...errors, monthlyOrders: '' })
                          }}
                          placeholder="E.g., 500, 2-5k, 50k+"
                          className={cn(
                            'w-full rounded-lg border bg-background/60 px-3 py-2 text-sm outline-none transition-colors focus:border-primary',
                            errors.monthlyOrders ? 'border-destructive' : 'border-border',
                          )}
                        />
                        {errors.monthlyOrders && <p className="mt-1.5 text-xs text-destructive">{errors.monthlyOrders}</p>}
                      </div>
  
                      {/* Team Size */}
                      <div>
                        <label className="mb-2 block text-sm font-medium">Team size</label>
                        <input
                          type="text"
                          value={state.teamCount}
                          onChange={(e) => {
                            update({ teamCount: e.target.value })
                            if (errors.teamCount) setErrors({ ...errors, teamCount: '' })
                          }}
                          placeholder="E.g., 5, 10-20, 50+"
                          className={cn(
                            'w-full rounded-lg border bg-background/60 px-3 py-2 text-sm outline-none transition-colors focus:border-primary',
                            errors.teamCount ? 'border-destructive' : 'border-border',
                          )}
                        />
                        {errors.teamCount && <p className="mt-1.5 text-xs text-destructive">{errors.teamCount}</p>}
                      </div>
                    </div>
                  </div>
                )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center gap-3">
            {step > 0 && (
              <Button variant="outline" size="lg" className="h-11" onClick={back}>
                <ArrowLeft className="size-4" data-icon="inline-start" />
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button size="lg" className="h-11 flex-1" onClick={next}>
                Continue
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
            ) : (
              <Button size="lg" className="h-11 flex-1" onClick={finish} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    Start AI Analysis
                    <ArrowRight className="size-4" data-icon="inline-end" />
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
