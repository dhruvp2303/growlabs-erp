'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Code2,
  Zap,
  Sliders,
  Layers,
  Wand2,
  Bot,
  Play,
  ArrowRight,
  Shield,
  Smartphone,
  Cpu,
  FileCheck,
  QrCode,
  Coins,
  Fuel,
  BookOpen,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { ShimmerButton } from '@/components/animated/shimmer-button'
import { TiltCard } from '@/components/animated/tilt-card'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'

interface CustomField {
  name: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'qr_code' | 'whatsapp_link'
  required: boolean
}

interface InstalledFeature {
  id: string
  title: string
  category: string
  description: string
  trigger: string
  fields: CustomField[]
  status: 'ACTIVE' | 'TESTING'
  deployedAt: string
}

const prebuiltRecipes = [
  {
    id: 'whatsapp-scratch',
    title: 'WhatsApp Customer Scratch Card Loyalty',
    category: 'Customer & POS',
    description: 'Auto-generates a unique digital scratch card coupon on WhatsApp whenever a customer bill exceeds $50.',
    trigger: 'On Sales Invoice Completed (> $50)',
    icon: Coins,
    fields: [
      { name: 'customer_phone', type: 'whatsapp_link', required: true },
      { name: 'scratch_discount_val', type: 'number', required: true },
      { name: 'unique_coupon_code', type: 'text', required: true },
    ],
    spotlight: 'rgba(236, 72, 153, 0.25)',
    border: 'rgba(236, 72, 153, 0.5)',
  },
  {
    id: 'library-fine-recall',
    title: 'Library Overdue Fine & Auto-Recall Engine',
    category: 'Books & Library',
    description: 'Calculates $0.50/day late fees past due date and dispatches automatic WhatsApp book return recalls with digital renewal links.',
    trigger: 'Daily at 08:00 AM on Overdue Loans',
    icon: BookOpen,
    fields: [
      { name: 'isbn_catalog_number', type: 'text', required: true },
      { name: 'borrower_whatsapp', type: 'whatsapp_link', required: true },
      { name: 'daily_penalty_rate', type: 'number', required: true },
      { name: 'digital_renewal_qr', type: 'qr_code', required: false },
    ],
    spotlight: 'rgba(168, 85, 247, 0.25)',
    border: 'rgba(168, 85, 247, 0.5)',
  },
  {
    id: 'bridal-deposit-tracker',
    title: 'Bridal & Suit Rental Deposit & Dry-Cleaning Tag',
    category: 'Rental & Apparel',
    description: 'Tracks customer security deposit escrow, pre-rental fitting alterations, and release upon dry-cleaning inspection.',
    trigger: 'On Rental Check-In / Item Return',
    icon: RotateCcw,
    fields: [
      { name: 'garment_tag_barcode', type: 'text', required: true },
      { name: 'escrow_deposit_held', type: 'number', required: true },
      { name: 'dry_clean_inspection_passed', type: 'boolean', required: true },
    ],
    spotlight: 'rgba(52, 211, 153, 0.25)',
    border: 'rgba(52, 211, 153, 0.5)',
  },
  {
    id: 'lab-qr-cert',
    title: 'Lab Test Certificate with Instant QR Verification',
    category: 'Quality & Testing',
    description: 'Attaches a cryptographically signed QA certificate with a scannable QR code to every dispatch pallet.',
    trigger: 'On Production Work Order Inspected',
    icon: QrCode,
    fields: [
      { name: 'batch_purity_percent', type: 'number', required: true },
      { name: 'inspection_technician', type: 'text', required: true },
      { name: 'verification_qr_hash', type: 'qr_code', required: true },
    ],
    spotlight: 'rgba(56, 189, 248, 0.25)',
    border: 'rgba(56, 189, 248, 0.5)',
  },
  {
    id: 'driver-fuel-split',
    title: 'Fleet Driver Fuel & Tip Splitter',
    category: 'Logistics',
    description: 'Calculates real-time driver tips, fuel allowance reimbursements, and toll deductions per delivery trip.',
    trigger: 'On Delivery Dispatch Marked Delivered',
    icon: Fuel,
    fields: [
      { name: 'trip_mileage_km', type: 'number', required: true },
      { name: 'fuel_rate_per_km', type: 'number', required: true },
      { name: 'driver_tip_amount', type: 'number', required: false },
    ],
    spotlight: 'rgba(251, 146, 60, 0.25)',
    border: 'rgba(251, 146, 60, 0.5)',
  },
]

export default function CustomFeaturesPage() {
  const [featureTitle, setFeatureTitle] = useState('')
  const [featureCategory, setFeatureCategory] = useState('Sales & POS')
  const [featureDesc, setFeatureDesc] = useState('')
  const [triggerRule, setTriggerRule] = useState('When invoice exceeds $100')
  const [fields, setFields] = useState<CustomField[]>([
    { name: 'client_reference_id', type: 'text', required: true },
    { name: 'custom_metric_val', type: 'number', required: true },
  ])
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [synthesizedFeature, setSynthesizedFeature] = useState<any | null>(null)
  const [installedFeatures, setInstalledFeatures] = useState<InstalledFeature[]>([
    {
      id: 'cust-101',
      title: 'Auto-GST Reverse Charge Calculator',
      category: 'Finance',
      description: 'Automatically calculates B2B reverse charge liability and splits IGST/CGST.',
      trigger: 'On Purchase Bill Uploaded',
      fields: [
        { name: 'vendor_gstin', type: 'text', required: true },
        { name: 'rcm_amount', type: 'number', required: true },
      ],
      status: 'ACTIVE',
      deployedAt: '2026-09-30',
    },
  ])

  const addField = () => {
    setFields([...fields, { name: `custom_field_${fields.length + 1}`, type: 'text', required: false }])
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSynthesize = () => {
    if (!featureTitle.trim() || !featureDesc.trim()) {
      toast.error('Please provide a feature title and natural language description.')
      return
    }

    setIsSynthesizing(true)
    setTimeout(() => {
      setIsSynthesizing(false)
      setSynthesizedFeature({
        id: `feat-${Date.now().toString().slice(-4)}`,
        title: featureTitle,
        category: featureCategory,
        description: featureDesc,
        trigger: triggerRule,
        fields,
      })
      toast.success('AI Architecture Synthesized!', {
        description: 'Schema generated and test sandbox compiled. Review and install below.',
      })
    }, 1000)
  }

  const handleInstallSynthesized = () => {
    if (!synthesizedFeature) return
    const newFeature: InstalledFeature = {
      ...synthesizedFeature,
      status: 'ACTIVE',
      deployedAt: new Date().toISOString().split('T')[0],
    }
    setInstalledFeatures([newFeature, ...installedFeatures])
    setSynthesizedFeature(null)
    setFeatureTitle('')
    setFeatureDesc('')

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#38bdf8', '#818cf8', '#34d399', '#ec4899'],
    })

    toast.success('Feature Deployed to Workspace!', {
      description: `${newFeature.title} is now active across your ERP.`,
    })
  }

  const handleInstallRecipe = (recipe: typeof prebuiltRecipes[0]) => {
    const newFeature: InstalledFeature = {
      id: `recipe-${Date.now().toString().slice(-4)}`,
      title: recipe.title,
      category: recipe.category,
      description: recipe.description,
      trigger: recipe.trigger,
      fields: recipe.fields as any,
      status: 'ACTIVE',
      deployedAt: new Date().toISOString().split('T')[0],
    }
    setInstalledFeatures([newFeature, ...installedFeatures])

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#34d399', '#f59e0b'],
    })

    toast.success(`Installed: ${recipe.title}`, {
      description: 'Feature recipe activated with zero downtime.',
    })
  }

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Background radial aura */}
      <div className="pointer-events-none absolute -top-20 right-10 -z-10 size-96 rounded-full bg-accent/15 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 left-10 -z-10 size-96 rounded-full bg-primary/15 blur-[140px]" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 text-accent text-xs font-semibold mb-3 shadow-sm">
            <Sparkles className="size-3.5 animate-pulse" />
            <span>AI Autonomous Feature Studio</span>
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-[11px] text-success font-mono">Zero-Code Compiler</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
            Custom Feature Architect
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5 max-w-3xl leading-relaxed">
            Need a proprietary workflow, custom loyalty rule, or unique lab test calculator? Describe it in plain English. GrowLabs synthesizes custom database schemas, automation triggers, and UI controls in seconds.
          </p>
        </div>
      </div>

      {/* Builder Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Feature Designer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Wand2 className="size-4" />
                </span>
                <h3 className="font-bold font-display text-base text-foreground">
                  Describe Your Custom Feature
                </h3>
              </div>
              <span className="text-[10px] text-muted-foreground">Natural Language Compiler</span>
            </div>

            {/* Feature Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Feature Name:
                </label>
                <input
                  type="text"
                  value={featureTitle}
                  onChange={(e) => setFeatureTitle(e.target.value)}
                  placeholder="E.g., WhatsApp Scratch Card Loyalty"
                  className="w-full bg-background/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Target Module Category:
                </label>
                <select
                  value={featureCategory}
                  onChange={(e) => setFeatureCategory(e.target.value)}
                  className="w-full bg-background/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                >
                  <option value="Sales & POS">Sales & POS Checkout</option>
                  <option value="Inventory & Stock">Inventory & Warehouse</option>
                  <option value="Customer Loyalty">Customer Loyalty & WhatsApp</option>
                  <option value="Manufacturing & BOM">Manufacturing & Production</option>
                  <option value="Quality & Lab">Quality, Lab & Verification</option>
                  <option value="Finance & Tax">Finance & Multi-Tax</option>
                  <option value="Logistics & Fleet">Logistics & Route Dispatch</option>
                </select>
              </div>
            </div>

            {/* Natural Language Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">
                  What should this feature do? (Detailed Description):
                </label>
                <span className="text-[10px] text-accent">AI Auto-Inference</span>
              </div>
              <textarea
                value={featureDesc}
                onChange={(e) => setFeatureDesc(e.target.value)}
                placeholder="E.g., Whenever an order exceeds $50, generate a unique random discount scratch card (5% to 20%), format it into a friendly WhatsApp template, and send it directly to the customer's phone number upon checkout."
                rows={3.5}
                className="w-full bg-background/80 border border-white/10 rounded-xl p-3.5 text-xs text-foreground outline-none focus:border-primary leading-relaxed"
              />
            </div>

            {/* Automation Trigger */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Automation Trigger Rule:
              </label>
              <input
                type="text"
                value={triggerRule}
                onChange={(e) => setTriggerRule(e.target.value)}
                placeholder="E.g., When Sales Invoice status changes to COMPLETED"
                className="w-full bg-background/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            {/* Custom Schema Fields */}
            <div className="border-t border-white/10 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Custom Data Fields ({fields.length}):
                </label>
                <button
                  type="button"
                  onClick={addField}
                  className="flex items-center gap-1 text-[11px] font-bold text-accent hover:underline cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add Field</span>
                </button>
              </div>

              <div className="space-y-2">
                {fields.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-2"
                  >
                    <input
                      type="text"
                      value={f.name}
                      onChange={(e) => {
                        const updated = [...fields]
                        updated[i].name = e.target.value
                        setFields(updated)
                      }}
                      className="flex-1 bg-background/80 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-foreground font-mono outline-none focus:border-primary"
                    />
                    <select
                      value={f.type}
                      onChange={(e) => {
                        const updated = [...fields]
                        updated[i].type = e.target.value as any
                        setFields(updated)
                      }}
                      className="bg-background/80 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-foreground outline-none"
                    >
                      <option value="text">Text / String</option>
                      <option value="number">Number / Amount</option>
                      <option value="date">Date & Time</option>
                      <option value="qr_code">QR Code Generator</option>
                      <option value="whatsapp_link">WhatsApp Action</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeField(i)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Synthesize CTA */}
            <div className="pt-2">
              <ShimmerButton
                className="w-full h-11 text-xs font-bold"
                onClick={handleSynthesize}
                disabled={isSynthesizing}
              >
                {isSynthesizing ? (
                  <>
                    <Bot className="size-4 animate-spin" />
                    <span>Synthesizing Schema & Automation Logic…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>Synthesize & Compile Custom Feature</span>
                  </>
                )}
              </ShimmerButton>
            </div>
          </div>

          {/* Synthesized Live Sandbox Preview */}
          <AnimatePresence>
            {synthesizedFeature && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="rounded-2xl border border-accent/40 bg-card/80 p-6 backdrop-blur-xl shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-accent">
                    <CheckCircle2 className="size-4.5" />
                    <span className="font-display font-bold text-sm text-foreground">
                      Compiled Feature Preview: {synthesizedFeature.title}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-accent/40 text-accent text-[10px]">
                    Sandbox Ready
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {synthesizedFeature.description}
                </p>

                <div className="rounded-xl border border-white/10 bg-background/80 p-4 space-y-2.5">
                  <div className="text-[11px] font-bold text-accent uppercase tracking-wider">
                    Generated Data Schema & Handlers
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Trigger: </span>
                      <strong className="text-foreground">{synthesizedFeature.trigger}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target: </span>
                      <strong className="text-foreground">{synthesizedFeature.category}</strong>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {synthesizedFeature.fields.map((f: CustomField, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-md bg-white/[0.05] border border-white/10 px-2 py-0.5 text-[10px] font-mono text-foreground"
                      >
                        {f.name} <span className="text-accent">({f.type})</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setSynthesizedFeature(null)}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    className="bg-accent text-background hover:bg-accent/90 text-xs font-bold"
                    onClick={handleInstallSynthesized}
                  >
                    <span>Deploy to Live ERP</span>
                    <ArrowRight className="size-3.5 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Active Custom Features & Pre-Built Recipes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Workspace Custom Features */}
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold font-display text-sm text-foreground flex items-center gap-2">
                <Cpu className="size-4 text-primary" />
                <span>Installed Custom Features ({installedFeatures.length})</span>
              </h3>
              <span className="text-[10px] text-success font-semibold">All Systems Online</span>
            </div>

            <div className="space-y-3">
              {installedFeatures.map((feat) => (
                <div
                  key={feat.id}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{feat.title}</span>
                    <span className="rounded-full bg-success/15 border border-success/30 px-2 py-0.5 text-[9px] font-bold text-success">
                      {feat.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{feat.description}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Trigger: {feat.trigger}</span>
                    <span>Deployed {feat.deployedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Built Instant Feature Recipes */}
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold font-display text-sm text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-accent" />
                <span>Instant Enterprise Recipes</span>
              </h3>
              <span className="text-[10px] text-muted-foreground">1-Click Install</span>
            </div>

            <div className="space-y-3">
              {prebuiltRecipes.map((recipe) => (
                <SpotlightCard
                  key={recipe.id}
                  spotlightColor={recipe.spotlight}
                  borderColor={recipe.border}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-white/[0.05] border border-white/10 text-accent shrink-0">
                        <recipe.icon className="size-4" />
                      </span>
                      <div>
                        <h4 className="font-bold text-xs text-foreground">{recipe.title}</h4>
                        <span className="text-[10px] text-accent">{recipe.category}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    {recipe.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {recipe.fields.length} Custom Fields
                    </span>
                    <button
                      type="button"
                      onClick={() => handleInstallRecipe(recipe)}
                      className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                    >
                      <Plus className="size-3" />
                      <span>Install Recipe</span>
                    </button>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
