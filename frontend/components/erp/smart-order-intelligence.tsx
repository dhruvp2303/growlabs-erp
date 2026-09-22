'use client'

import { useState } from 'react'
import {
  Sparkles,
  Package,
  Factory,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Zap,
  DollarSign,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { toast } from 'sonner'

export function SmartOrderIntelligence() {
  const [product, setProduct] = useState('Water Pump Motor 4200')
  const [quantity, setQuantity] = useState(1000)
  const [customer, setCustomer] = useState('Meridian Water Systems')
  const [usePreparedStock, setUsePreparedStock] = useState(true)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionDone, setExecutionDone] = useState(false)

  // Dynamic simulation calculations
  const unitPrice = product.includes('1500') ? 1240 : product.includes('4200') ? 480 : 320
  const orderTotal = quantity * unitPrice

  // Finished stock available
  const availableFinished = Math.min(quantity, Math.round(quantity * 0.5))
  const preparedStockAvailable = 40 // from cancelled order SO-10480
  const effectivePrepared = usePreparedStock ? preparedStockAvailable : 0
  const netProductionNeeded = Math.max(0, quantity - availableFinished - effectivePrepared)

  // BOM calculations for Water Pump Motor 4200
  const bom = [
    { name: 'Copper Wire 6mm', required: netProductionNeeded * 6, stock: 8200, unit: 'meters', leadDays: 8, supplier: 'Apex Copper & Alloys' },
    { name: 'Steel Sheet A36', required: Math.round(netProductionNeeded * 0.5), stock: 640, unit: 'sheets', leadDays: 12, supplier: 'Titan Steel Supply' },
    { name: 'Precision Bearing 32', required: netProductionNeeded * 2, stock: 210, unit: 'units', leadDays: 21, supplier: 'Precision Bearings Intl.' },
    { name: 'Motor Controller 880', required: netProductionNeeded, stock: 96, unit: 'units', leadDays: 15, supplier: 'Volt Electronics' },
  ]

  const bomEvaluated = bom.map((item) => {
    const shortage = Math.max(0, item.required - item.stock)
    const availPercent = item.required > 0 ? Math.min(100, Math.round((item.stock / item.required) * 100)) : 100
    return { ...item, shortage, availPercent, ok: shortage === 0 }
  })

  const totalShortages = bomEvaluated.filter((b) => !b.ok).length
  const overallMaterialReadiness = Math.round(
    bomEvaluated.reduce((acc, curr) => acc + curr.availPercent, 0) / bomEvaluated.length,
  )

  const handleExecuteAll = async () => {
    setIsExecuting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setIsExecuting(false)
    setExecutionDone(true)
    toast.success('Smart Order Actions Executed: MO-2205 Scheduled, PO-3392 Created, Inventory Reserved!')
  }

  return (
    <div className="space-y-6">
      {/* Simulation Controls Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold">
              <Sparkles className="size-3.5" />
              GrowLabs Smart Order Intelligence Engine
            </div>
            <h2 className="text-xl font-bold font-display mt-2">Incoming Order Feasibility & Supply Chain Trace</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Simulates finished inventory, BOM material breakdown, capacity load, cancelled order stock, and supplier lead times in real time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-mono">Simulated Order:</span>
            <Badge variant="outline" className="text-sm font-bold font-mono py-1 px-3 bg-primary/5 text-primary border-primary/30">
              {formatCurrency(orderTotal)}
            </Badge>
          </div>
        </div>

        {/* Form parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Product SKU</label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors font-medium"
            >
              <option value="Water Pump Motor 4200">Water Pump Motor 4200 ($480)</option>
              <option value="Industrial Pump X1500">Industrial Pump X1500 ($1,240)</option>
              <option value="Motor Controller 880">Motor Controller 880 ($320)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Order Quantity (Units)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={10}
                step={50}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(10, parseInt(e.target.value) || 0))}
                className="w-full bg-background border border-border px-3 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors font-mono font-bold"
              />
              <div className="flex gap-1">
                {[200, 500, 1000].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className="px-2 py-1.5 text-xs rounded border border-border bg-card hover:border-primary hover:text-primary transition-colors font-mono"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Customer Account</label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full bg-background border border-border px-3 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors font-medium"
            >
              <option value="Meridian Water Systems">Meridian Water Systems (Tier 1)</option>
              <option value="Delta Municipal Works">Delta Municipal Works (Gov)</option>
              <option value="Coastal Agriculture Co.">Coastal Agriculture Co.</option>
              <option value="BlueRock Mining">BlueRock Mining</option>
            </select>
          </div>
        </div>
      </div>

      {/* Multi-Tier Fulfillment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step-by-Step Supply Chain Trace */}
        <div className="rounded-2xl border border-border bg-card/40 p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
              <Zap className="size-4 text-primary" /> Multi-Tier Resolution Trace
            </h3>
            <span className="text-xs font-mono text-muted-foreground">Order Ref: #SIM-{quantity}</span>
          </div>

          {/* Tier 1: Finished Stock Check */}
          <div className="rounded-xl border border-border/80 bg-background/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-success/15 text-success flex items-center justify-center font-bold text-xs">1</div>
                <h4 className="font-semibold text-sm">Finished Stock Inventory Availability</h4>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/30 font-semibold font-mono">
                {availableFinished} Units Available (Dallas DC)
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {availableFinished} of {quantity} units can be locked and allocated immediately from existing warehouse finished goods.
            </p>
            <Progress value={(availableFinished / quantity) * 100} className="h-2" />
          </div>

          {/* Tier 2: Cancelled Order Prepared Stock Reutilization (Vision Section 21 & 22) */}
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">2</div>
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <RotateCcw className="size-4 text-primary" /> Cancelled Order Stock Reutilization
                </h4>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/35 font-mono text-xs">
                40 Units Found in Staging
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Order #SO-10480 was cancelled yesterday. 40 units were already assembled and prepared in Dallas Staging Bay 2.
            </p>
            <div className="flex items-center justify-between bg-card/60 p-2.5 rounded-lg border border-border text-xs">
              <span className="font-medium">Business Owner Choice:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUsePreparedStock(true)}
                  className={cn(
                    'px-2.5 py-1 rounded font-semibold transition-colors',
                    usePreparedStock ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  ✓ Re-allocate 40 Prepared Units (Save $7,040)
                </button>
                <button
                  type="button"
                  onClick={() => setUsePreparedStock(false)}
                  className={cn(
                    'px-2.5 py-1 rounded font-semibold transition-colors',
                    !usePreparedStock ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  Instruct New Batch Production
                </button>
              </div>
            </div>
          </div>

          {/* Tier 3: Production Requirement & BOM Matrix */}
          <div className="rounded-xl border border-border/80 bg-background/40 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-warning/20 text-warning flex items-center justify-center font-bold text-xs">3</div>
                <h4 className="font-semibold text-sm">Bill of Materials (BOM) & Raw Material Availability</h4>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                Net Production: {netProductionNeeded} Units
              </Badge>
            </div>

            <div className="space-y-2">
              {bomEvaluated.map((b, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-card/50 border border-border/60 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{b.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">({b.supplier})</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Needed: {b.required} {b.unit} | On Hand: {b.stock} {b.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    {b.ok ? (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30 font-semibold">
                        ✓ 100% In Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 font-semibold font-mono">
                        Shortage: -{b.shortage} {b.unit} (Lead: {b.leadDays}d)
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
              <span className="text-muted-foreground font-medium">BOM Material Readiness Index:</span>
              <span className={cn('font-bold font-mono text-sm', overallMaterialReadiness >= 80 ? 'text-warning' : 'text-destructive')}>
                {overallMaterialReadiness}% Ready ({totalShortages} Missing Components)
              </span>
            </div>
          </div>
        </div>

        {/* Action Panel & Executive Decision */}
        <div className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-3">
              Fulfillment Verdict & Action Plan
            </h3>

            <div className="space-y-3">
              <div className="bg-background/60 p-3 rounded-xl border border-border space-y-1">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Fulfillment Breakdown</p>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-success">{availableFinished + effectivePrepared} Units Ready Now</span>
                  <span className="text-warning">{netProductionNeeded} Units to Manufacture</span>
                </div>
              </div>

              <div className="bg-background/60 p-3 rounded-xl border border-border space-y-1">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Production Schedule</p>
                <p className="text-xs font-semibold text-foreground">Plant A Queue &bull; Estimated Cycle: 6 Days</p>
                <p className="text-[11px] text-muted-foreground">Earliest dispatch date: 8 business days with rush PO.</p>
              </div>

              <div className="bg-primary/5 p-3 rounded-xl border border-primary/25 space-y-1">
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                  <Sparkles className="size-3.5" /> GrowLabs AI Smart Recommendation
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  1. Lock {availableFinished + effectivePrepared} units at Dallas DC. <br />
                  2. Dispatch immediate PO for {bomEvaluated.find((b) => !b.ok)?.shortage || 400} Bearings & Controllers. <br />
                  3. Split-ship {availableFinished + effectivePrepared} units on Day 2 to satisfy customer urgency.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            {executionDone ? (
              <div className="p-3 bg-success/15 border border-success/30 rounded-xl text-center space-y-1">
                <CheckCircle2 className="size-5 text-success mx-auto" />
                <p className="text-xs font-bold text-success">Automated Workflow Executed!</p>
                <p className="text-[10px] text-muted-foreground">MO-2205 created, PO-3392 sent for approval, 540 units locked.</p>
              </div>
            ) : (
              <Button
                onClick={handleExecuteAll}
                disabled={isExecuting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-bold py-2.5 h-auto text-xs"
              >
                {isExecuting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Executing Multi-Dept Actions…
                  </>
                ) : (
                  <>
                    <Zap className="size-4" /> Execute Full Intelligence Plan
                  </>
                )}
              </Button>
            )}

            <p className="text-[10px] text-center text-muted-foreground">
              Cross-department action creates records in Sales, Inventory, Production & Procurement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
