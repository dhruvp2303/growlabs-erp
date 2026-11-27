'use client'

import React, { useState } from 'react'
import {
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Package,
  Factory,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  FileText,
  DollarSign,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { ShimmerButton } from '@/components/animated/shimmer-button'
import { useErpWorkflow, Role } from '@/lib/workflow/erp-workflow-provider'
import { SecureInvoiceModal } from '@/components/erp/secure-invoice-modal'
import { toast } from 'sonner'

export function ErpInteractiveWorkflowPanel() {
  const {
    activeRole,
    setActiveRole,
    orders,
    notifications,
    invoices,
    inventory,
    createOrder,
    submitOrderDecision,
    acceptProductionJob,
    completeProductionJob,
    managerApproveAndInvoice,
    resetWorkflowDemo,
  } = useErpWorkflow()

  const [secureModalOpen, setSecureModalOpen] = useState(false)

  // Order Decision form state for the active order
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '')
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0]

  // Form decision inputs
  const [decisionOption, setDecisionOption] = useState<'use_stock_and_make_rest' | 'make_all_from_raw' | 'custom'>(
    'use_stock_and_make_rest'
  )
  const [customStockUse, setCustomStockUse] = useState<number>(20)
  const [customMakeRaw, setCustomMakeRaw] = useState<number>(30)
  const [customExplanation, setCustomExplanation] = useState<string>(
    'Use 20 of them from stock and make 30 new from raw material to preserve buffer.'
  )

  // New order simulation modal state
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [newOrderUnits, setNewOrderUnits] = useState(50)
  const [newOrderCustomer, setNewOrderCustomer] = useState('Delta Engineering Corp')

  // Calculated values for presets
  const stockAvailable = inventory.finishedStock
  const rawCapacity = inventory.rawUnitsCapacity
  const orderUnits = activeOrder ? activeOrder.orderedUnits : 50

  // Handle submit decision
  const handleDecisionSubmit = () => {
    if (!activeOrder) return

    let useFromStock = 0
    let makeFromRaw = 0
    let explanation: string | undefined = undefined

    if (decisionOption === 'use_stock_and_make_rest') {
      useFromStock = Math.min(orderUnits, stockAvailable)
      makeFromRaw = Math.max(0, orderUnits - useFromStock)
      explanation = `Option 1: Use ${useFromStock} from stock and make ${makeFromRaw} from raw material.`
    } else if (decisionOption === 'make_all_from_raw') {
      useFromStock = 0
      makeFromRaw = orderUnits
      explanation = `Option 2: Produce all ${orderUnits} fresh from raw materials.`
    } else {
      useFromStock = customStockUse
      makeFromRaw = customMakeRaw
      explanation = customExplanation
    }

    if (useFromStock + makeFromRaw < orderUnits) {
      toast.error(`Total fulfillment (${useFromStock + makeFromRaw}) is less than ordered units (${orderUnits})!`)
      return
    }

    if (useFromStock > stockAvailable) {
      toast.error(`Cannot use ${useFromStock} from stock. Only ${stockAvailable} available!`)
      return
    }

    if (makeFromRaw > rawCapacity) {
      toast.error(`Cannot make ${makeFromRaw} from raw materials. Only capacity for ${rawCapacity}!`)
      return
    }

    submitOrderDecision(activeOrder.id, {
      option: decisionOption,
      useFromStock,
      makeFromRaw,
      customExplanation: explanation,
    })

    toast.success(`Fulfillment Strategy Approved for ${activeOrder.reference}!`, {
      description: `Notification dispatched to Production floor: Produce ${makeFromRaw} units.`,
    })
  }

  // Handle Production Accept
  const handleProductionAccept = () => {
    if (!activeOrder) return
    acceptProductionJob(activeOrder.id)
    toast.success(`Production Team Accepted Order ${activeOrder.reference}!`, {
      description: `Automatically deducted stock and raw material inventory.`,
    })
  }

  // Handle Production Complete
  const handleProductionComplete = () => {
    if (!activeOrder) return
    completeProductionJob(activeOrder.id)
    toast.success(`Production Finished for ${activeOrder.reference}!`, {
      description: `Notifications sent to HR, Manager, Admin, and Finance (CA) for billing approval.`,
    })
  }

  // Handle Manager Approve & Invoice
  const handleManagerApprove = () => {
    if (!activeOrder) return
    try {
      const inv = managerApproveAndInvoice(activeOrder.id)
      toast.success(`Manager Approved! Invoice ${inv.invoiceNumber} Generated!`, {
        description: `Total amount: $${inv.grandTotal.toLocaleString()}. Saved to secure vault.`,
      })
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  // Handle Create New Order
  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newOrd = createOrder({
      customer: newOrderCustomer,
      itemName: 'Water Pump Industrial Motor 4200',
      orderedUnits: newOrderUnits,
      unitPrice: 480,
    })
    setSelectedOrderId(newOrd.id)
    setIsCreatingOrder(false)
    toast.success(`New Order ${newOrd.reference} Created for ${newOrd.orderedUnits} Motors!`, {
      description: 'Stock & Raw material readiness check completed.',
    })
  }

  return (
    <div className="rounded-3xl border border-primary/30 bg-card/60 p-5 sm:p-7 backdrop-blur-xl space-y-7 shadow-2xl relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 size-96 rounded-full bg-primary/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 -z-10 size-80 rounded-full bg-accent/10 blur-[120px]" />

      {/* Top Banner & Multi-Role Persona Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold mb-2">
            <Sparkles className="size-3.5 text-accent animate-pulse" />
            <span>Interactive Real-World ERP Engine</span>
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-[11px] text-success">Live Reactive Workflow</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-foreground tracking-tight">
            Order-to-Production & Cryptographic Invoicing Hub
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test the exact end-to-end flow: Stock Checking &rarr; Decision Matrix &rarr; Production Sign-off &rarr; Auto-Deduction &rarr; Multi-Role Notifications &rarr; Password-Protected Invoicing.
          </p>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Persona selector */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-background/80 p-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase px-2">Role:</span>
            {(['manager', 'production', 'finance', 'admin', 'hr'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setActiveRole(r)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase transition-all ${
                  activeRole === r
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {r === 'finance' ? 'Finance/CA' : r}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={() => setSecureModalOpen(true)}
            className="rounded-xl font-bold text-xs bg-gradient-to-r from-primary to-accent shadow-md"
          >
            <ShieldCheck className="size-3.5 mr-1.5" />
            Secure Invoices & Bills Vault
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={resetWorkflowDemo}
            className="rounded-xl text-xs border-border hover:bg-muted"
          >
            <RotateCcw className="size-3.5 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Live Inventory Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpotlightCard
          spotlightColor="rgba(56, 189, 248, 0.2)"
          borderColor="rgba(56, 189, 248, 0.4)"
          className="p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Finished Motors in Stock</span>
            <Package className="size-4 text-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-foreground">{inventory.finishedStock}</span>
            <span className="text-xs text-muted-foreground">Units Ready</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Available for immediate customer dispatch</p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(168, 85, 247, 0.2)"
          borderColor="rgba(168, 85, 247, 0.4)"
          className="p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Raw Material Capacity</span>
            <Factory className="size-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-purple-400">{inventory.rawUnitsCapacity}</span>
            <span className="text-xs text-muted-foreground">Motors Capacity</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Sufficient copper, steel & bearings in warehouse</p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(52, 211, 153, 0.2)"
          borderColor="rgba(52, 211, 153, 0.4)"
          className="p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Active Orders in Queue</span>
            <TrendingUp className="size-4 text-success" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-foreground">{orders.length}</span>
            <span className="text-xs text-muted-foreground">Orders Tracking</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Smart order lifecycle management</p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.2)"
          borderColor="rgba(245, 158, 11, 0.4)"
          className="p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Generated Invoices</span>
            <FileText className="size-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-400">{invoices.length}</span>
            <span className="text-xs text-muted-foreground">Bills Secured</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Protected in Password Vault</p>
        </SpotlightCard>
      </div>

      {/* Main Order Pipeline & Decision Interactive Card */}
      {activeOrder ? (
        <div className="rounded-2xl border border-border bg-card/80 p-5 sm:p-6 space-y-6">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-mono font-bold text-sm">
                SO
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    Order {activeOrder.reference}: {activeOrder.orderedUnits}x {activeOrder.itemName}
                  </h3>
                  <Badge
                    variant="outline"
                    className={
                      activeOrder.status === 'APPROVED_INVOICED'
                        ? 'bg-success/20 text-success border-success/40'
                        : activeOrder.status === 'PRODUCTION_COMPLETED_AWAITING_APPROVAL'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : activeOrder.status === 'IN_PRODUCTION'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-primary/20 text-primary border-primary/40'
                    }
                  >
                    {activeOrder.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Customer: <strong>{activeOrder.customer}</strong> • Total Value: <strong>${activeOrder.totalAmount.toLocaleString()}</strong> (${activeOrder.unitPrice}/unit)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreatingOrder(true)}
                className="text-xs rounded-xl"
              >
                <Plus className="size-3.5 mr-1" /> New Test Order
              </Button>
            </div>
          </div>

          {/* Visual Step Progress Tracker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 pb-2">
            {[
              {
                step: '1. Stock & Decision',
                active: activeOrder.status === 'NEW_ORDER_AWAITING_DECISION',
                done: ['SENT_TO_PRODUCTION', 'IN_PRODUCTION', 'PRODUCTION_COMPLETED_AWAITING_APPROVAL', 'APPROVED_INVOICED'].includes(activeOrder.status),
                role: 'Manager / Admin'
              },
              {
                step: '2. Production Floor',
                active: ['SENT_TO_PRODUCTION', 'IN_PRODUCTION'].includes(activeOrder.status),
                done: ['PRODUCTION_COMPLETED_AWAITING_APPROVAL', 'APPROVED_INVOICED'].includes(activeOrder.status),
                role: 'Production Team'
              },
              {
                step: '3. Multi-Role Notify',
                active: activeOrder.status === 'PRODUCTION_COMPLETED_AWAITING_APPROVAL',
                done: activeOrder.status === 'APPROVED_INVOICED',
                role: 'HR, Admin, CA, Manager'
              },
              {
                step: '4. Invoiced in Vault',
                active: activeOrder.status === 'APPROVED_INVOICED',
                done: activeOrder.status === 'APPROVED_INVOICED',
                role: 'Password-Protected'
              },
            ].map((st, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                  st.active
                    ? 'border-primary bg-primary/15 text-primary shadow-sm ring-1 ring-primary/40 font-bold'
                    : st.done
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-border bg-background/40 text-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{st.step}</span>
                  {st.done && <CheckCircle2 className="size-3.5 text-success" />}
                </div>
                <span className="text-[10px] opacity-75 font-mono mt-1">{st.role}</span>
              </div>
            ))}
          </div>

          {/* 1. STOCK CHECK MESSAGE (As requested: checks the stock first and gives msg) */}
          <div className="p-4 rounded-2xl border border-primary/30 bg-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Package className="size-4" />
              </div>
              <div className="text-xs space-y-1">
                <span className="font-bold text-primary text-sm block">Automated Stock & Readiness Diagnostic</span>
                <p className="text-foreground leading-relaxed">
                  We got an order of <strong>{activeOrder.orderedUnits} Motors</strong> for <strong>{activeOrder.customer}</strong>.
                  Our warehouse inventory checks: we currently have stock of <strong>{inventory.finishedStock} Motors</strong> and raw materials sufficient to manufacture <strong>{inventory.rawUnitsCapacity} Motors</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge className="bg-success/20 text-success border-success/40 text-[10px]">
                100% FULFILLABLE
              </Badge>
            </div>
          </div>

          {/* 2. STAGE: AWAITING DECISION -> Choose Option 1, Option 2, or Other */}
          {activeOrder.status === 'NEW_ORDER_AWAITING_DECISION' && (
            <div className="space-y-4 rounded-2xl border border-border p-5 bg-background/50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <UserCheck className="size-4 text-primary" /> Select Production & Stock Strategy
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Choose how the ERP should fulfill this order of {activeOrder.orderedUnits} motors.
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  ACTOR: MANAGER / ADMIN
                </Badge>
              </div>

              {/* 3 Strategy Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {/* OPTION 1: Use 30 from stock & make 20 from raw */}
                <button
                  type="button"
                  onClick={() => setDecisionOption('use_stock_and_make_rest')}
                  className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    decisionOption === 'use_stock_and_make_rest'
                      ? 'border-primary bg-primary/15 shadow-md ring-1 ring-primary'
                      : 'border-border bg-card/40 hover:border-primary/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">Option 1 (Balanced)</span>
                      <Badge className="text-[9px] bg-primary/20 text-primary">RECOMMENDED</Badge>
                    </div>
                    <h5 className="text-sm font-bold text-foreground">
                      Use {inventory.finishedStock} from stock & make {Math.max(0, activeOrder.orderedUnits - inventory.finishedStock)} new
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Depletes finished warehouse stock immediately and dispatches production job for the remaining {Math.max(0, activeOrder.orderedUnits - inventory.finishedStock)} units.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
                    Stock: -{inventory.finishedStock} | Raw: -{Math.max(0, activeOrder.orderedUnits - inventory.finishedStock)}
                  </div>
                </button>

                {/* OPTION 2: Make 50 new from raw materials */}
                <button
                  type="button"
                  onClick={() => setDecisionOption('make_all_from_raw')}
                  className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    decisionOption === 'make_all_from_raw'
                      ? 'border-primary bg-primary/15 shadow-md ring-1 ring-primary'
                      : 'border-border bg-card/40 hover:border-primary/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400">Option 2 (Fresh Build)</span>
                      <Badge className="text-[9px] bg-purple-500/20 text-purple-400">PRESERVE STOCK</Badge>
                    </div>
                    <h5 className="text-sm font-bold text-foreground">
                      Make all {activeOrder.orderedUnits} new from raw material
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Keeps all current {inventory.finishedStock} finished units intact for urgent walk-in buyers and builds entire order from raw warehouse material.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
                    Stock: 0 | Raw: -{activeOrder.orderedUnits}
                  </div>
                </button>

                {/* OPTION 3: Other / Custom */}
                <button
                  type="button"
                  onClick={() => setDecisionOption('custom')}
                  className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    decisionOption === 'custom'
                      ? 'border-primary bg-primary/15 shadow-md ring-1 ring-primary'
                      : 'border-border bg-card/40 hover:border-primary/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-accent">Option 3 (Other / Custom)</span>
                      <Badge className="text-[9px] bg-accent/20 text-accent">CUSTOM RATIO</Badge>
                    </div>
                    <h5 className="text-sm font-bold text-foreground">
                      Write Custom Breakdown
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Manually type exact units from stock, exact units from raw materials, and an operational rationale note.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
                    E.g. Use 20 from stock, make 30 new
                  </div>
                </button>
              </div>

              {/* Custom breakdown fields when Option 3 is selected */}
              {decisionOption === 'custom' && (
                <div className="p-4 rounded-2xl border border-accent/30 bg-accent/5 space-y-3 animate-in fade-in duration-150">
                  <span className="text-xs font-bold text-accent block">Custom Breakdown Specification:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Use from Finished Stock (Max: {stockAvailable}):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={stockAvailable}
                        value={customStockUse}
                        onChange={(e) => setCustomStockUse(parseInt(e.target.value) || 0)}
                        className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Make from Raw Materials (Max: {rawCapacity}):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={rawCapacity}
                        value={customMakeRaw}
                        onChange={(e) => setCustomMakeRaw(parseInt(e.target.value) || 0)}
                        className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Manager Justification / Instructions for Production Team:
                    </label>
                    <textarea
                      rows={2}
                      value={customExplanation}
                      onChange={(e) => setCustomExplanation(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      placeholder="e.g. use 20 of them and make 30 new from raw metereal"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <Button onClick={handleDecisionSubmit} className="font-bold text-xs h-10 px-6">
                  Approve Strategy & Send Notification to Production &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* 3. STAGE: SENT TO PRODUCTION -> Production guy accepts order */}
          {activeOrder.status === 'SENT_TO_PRODUCTION' && (
            <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Factory className="size-5 text-blue-400" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Production Floor Directive Received</h4>
                    <p className="text-xs text-muted-foreground">
                      Decision: <strong>Use {activeOrder.decision?.useFromStock} from stock, produce {activeOrder.decision?.makeFromRaw} units from raw material.</strong>
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  ACTION REQUIRED BY PRODUCTION
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-background/50 border border-border text-xs text-muted-foreground">
                <p>
                  <strong>Automatic Inventory Action:</strong> Clicking <em>&quot;Accept Production Job&quot;</em> will immediately minus <strong>{activeOrder.decision?.useFromStock} motors</strong> from warehouse finished stock and minus raw materials for <strong>{activeOrder.decision?.makeFromRaw} motors</strong>.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleProductionAccept}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  <Factory className="size-3.5 mr-1.5" /> Accept Job & Auto-Deduct Materials
                </Button>
              </div>
            </div>
          )}

          {/* 4. STAGE: IN PRODUCTION -> Production guy marks completed */}
          {activeOrder.status === 'IN_PRODUCTION' && (
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="size-5 text-amber-400 animate-spin" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Job in Assembly: {activeOrder.decision?.makeFromRaw} Units Being Built</h4>
                    <p className="text-xs text-muted-foreground">
                      Accepted at {activeOrder.acceptedByProductionAt}. Raw materials and stock have been deducted.
                    </p>
                  </div>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  PRODUCTION IN PROGRESS
                </Badge>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleProductionComplete}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                >
                  <CheckCircle2 className="size-3.5 mr-1.5" /> Mark Order Done by Production Guy
                </Button>
              </div>
            </div>
          )}

          {/* 5. STAGE: PRODUCTION COMPLETED -> Manager Approval to generate Invoice */}
          {activeOrder.status === 'PRODUCTION_COMPLETED_AWAITING_APPROVAL' && (
            <div className="p-5 rounded-2xl border border-success/30 bg-success/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-5 text-success" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Production Completed! Ready for Manager Invoicing</h4>
                    <p className="text-xs text-muted-foreground">
                      Production finished at {activeOrder.completedByProductionAt}. Notifications sent to HR, Manager, Admin, and Finance (CA).
                    </p>
                  </div>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">
                  AWAITING MANAGER APPROVAL
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-background/50 border border-border text-xs text-muted-foreground">
                <p>
                  Once manager approves, the system will automatically generate the official Tax Invoice & Bill for <strong>${activeOrder.totalAmount.toLocaleString()}</strong>, link it to the order, and store it in the password-protected vault.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleManagerApprove}
                  className="bg-success hover:bg-success/90 text-success-foreground font-bold text-xs"
                >
                  <FileText className="size-3.5 mr-1.5" /> Manager Approve & Auto-Generate Invoice
                </Button>
              </div>
            </div>
          )}

          {/* 6. STAGE: INVOICED & COMPLETED */}
          {activeOrder.status === 'APPROVED_INVOICED' && (
            <div className="p-5 rounded-2xl border border-primary/30 bg-primary/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-5 text-primary" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Order Successfully Invoiced & Finalized</h4>
                    <p className="text-xs text-muted-foreground">
                      Approved at {activeOrder.approvedByManagerAt}. Official bill and invoice generated in the Vault.
                    </p>
                  </div>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  INVOICE ISSUED
                </Badge>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setSecureModalOpen(true)}
                  className="font-bold text-xs"
                >
                  <ShieldCheck className="size-3.5 mr-1.5" /> View Bill & Invoice in Vault (Password Protected)
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground text-xs">No active orders found.</div>
      )}

      {/* Notifications Drawer Summary for the Active Role */}
      <div className="rounded-2xl border border-border bg-card/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Real-Time Role Notifications ({notifications.length})
            </h4>
            <Badge variant="outline" className="text-[10px] font-mono">
              ROLE: {activeRole.toUpperCase()}
            </Badge>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Multi-persona dispatch (Admin, Manager, Production, HR, CA)
          </span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {notifications.map((n) => {
            const isRelevant = n.targetRoles.includes(activeRole)
            return (
              <div
                key={n.id}
                className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 transition-colors ${
                  isRelevant
                    ? 'border-primary/30 bg-primary/5 text-foreground'
                    : 'border-border/50 bg-background/30 text-muted-foreground opacity-60'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{n.title}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{n.timestamp}</span>
                    {isRelevant && (
                      <Badge className="text-[8px] bg-primary/20 text-primary py-0">FOR YOU</Badge>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed">{n.message}</p>
                </div>

                <div className="text-[10px] font-mono text-muted-foreground shrink-0 uppercase">
                  Target: {n.targetRoles.join(', ')}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Secure Modal for Invoices */}
      <SecureInvoiceModal
        open={secureModalOpen}
        onClose={() => setSecureModalOpen(false)}
      />

      {/* Modal to create a test order */}
      {isCreatingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-foreground">Simulate New Customer Order</h3>
            <p className="text-xs text-muted-foreground">
              Create an order to test how the ERP checks warehouse stock and raw materials.
            </p>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Customer Organization
                </label>
                <input
                  type="text"
                  value={newOrderCustomer}
                  onChange={(e) => setNewOrderCustomer(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Quantity of Motors Ordered
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={newOrderUnits}
                  onChange={(e) => setNewOrderUnits(parseInt(e.target.value) || 1)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsCreatingOrder(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="font-bold">
                  Create Order & Run Stock Diagnostics
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
