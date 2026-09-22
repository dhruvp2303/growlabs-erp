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
} from 'lucide-react'
import { useOnboarding, type ModuleId } from '@/lib/onboarding/store'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { toast } from 'sonner'

interface BillingModule {
  id: ModuleId | 'ai'
  name: string
  price: number
  desc: string
  category: string
}

export default function SettingsPage() {
  const { state, update } = useOnboarding()

  // Active settings tab
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'billing'>('billing')

  // Annual billing toggle
  const [annual, setAnnual] = useState(true)

  // Company Profile state
  const [compName, setCompName] = useState(state.companyName || 'PrimeFlow Manufacturing')
  const [compSize, setCompSize] = useState(state.companySize || '51-200')

  // Available add-ons and pricing configuration
  const billingModules: BillingModule[] = [
    { id: 'inventory', name: 'Inventory Management', price: 90, desc: 'Multi-warehouse stock logs & reorder points.', category: 'Core' },
    { id: 'sales', name: 'Sales & CRM', price: 70, desc: 'Orders fulfillment pipelines & customers ledger.', category: 'Core' },
    { id: 'procurement', name: 'Procurement', price: 60, desc: 'Suppliers directory & PO approval chains.', category: 'Core' },
    { id: 'finance', name: 'Finance & Accounting', price: 80, desc: 'Invoices payments tracking & cash flow charts.', category: 'Core' },
    { id: 'production', name: 'Production & Manufacturing', price: 120, desc: 'Assembly timelines, schedules & BOM matrices.', category: 'Manufacturing' },
    { id: 'quality', name: 'Quality Control', price: 70, desc: 'Quality inspections, defects catalog & CAPA.', category: 'Manufacturing' },
    { id: 'logistics', name: 'Logistics & Shipping', price: 80, desc: 'Freight tracking timeline & carrier metrics.', category: 'Operations' },
    { id: 'hr', name: 'HR & Payroll', price: 60, desc: 'Staff attendance tracking & leaves requests.', category: 'Admin' },
    { id: 'analytics', name: 'Analytics & Reporting', price: 50, desc: 'Cross-department analytical dashboards.', category: 'Intelligence' },
  ]

  // Calculate pricing
  const basePlanPrice = 149 // Starter base
  const activeModulesCount = state.selectedModules.length

  const addOnTotal = useMemo(() => {
    return billingModules
      .filter((m) => state.selectedModules.includes(m.id as ModuleId))
      .reduce((sum, m) => sum + m.price, 0)
  }, [state.selectedModules])

  const totalPriceMonthly = basePlanPrice + addOnTotal
  const totalPrice = annual ? Math.round(totalPriceMonthly * 0.8) : totalPriceMonthly
  const annualSavings = totalPriceMonthly * 12 - totalPrice * 12

  const toggleBillingModule = (id: ModuleId) => {
    const isSelected = state.selectedModules.includes(id)
    const updated = isSelected
      ? state.selectedModules.filter((m) => m !== id)
      : [...state.selectedModules, id]
    update({ selectedModules: updated })

    if (isSelected) {
      toast.error(`Deactivated module: ${id.toUpperCase()}. Sidebar menu updated.`);
    } else {
      toast.success(`Activated module: ${id.toUpperCase()}. Sidebar menu updated.`);
    }
  }

  const saveProfile = () => {
    update({ companyName: compName, companySize: compSize as any })
    toast.success('Company profile successfully updated.')
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Workspace Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure company settings, audit permissions, and customize your personalized ERP plan.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Company Profile
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Users & Permissions
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'billing'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Modular Billing & Subscription
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'profile' && (
        <div className="max-w-xl rounded-2xl border border-border bg-card/40 p-6 space-y-4">
          <h3 className="text-lg font-bold font-display flex items-center gap-2">
            <Building className="size-5 text-primary" /> Profile Parameters
          </h3>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Company Name</label>
              <input
                type="text"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                className="w-full bg-background border border-border px-3.5 py-2.5 rounded-lg text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Company Size</label>
              <select
                value={compSize}
                onChange={(e) => setCompSize(e.target.value as any)}
                className="w-full bg-background border border-border px-3.5 py-2.5 rounded-lg text-sm outline-none focus:border-primary transition-colors"
              >
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-1000">201-1000 Employees</option>
                <option value="1000+">1000+ Employees</option>
              </select>
            </div>
            <div className="pt-4">
              <Button className="w-full" onClick={saveProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="rounded-xl border border-border overflow-hidden bg-card/20">
          <div className="p-5 border-b border-border bg-card/10">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <Users className="size-5 text-primary" /> Roles Permission Matrix
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Manage standard user roles and module authorization flags.</p>
          </div>
          <div className="p-6 space-y-4">
            {[
              { role: 'Administrator', desc: 'Full write access to all active operational and finance directories.', users: 2 },
              { role: 'Manager', desc: 'Full write to operational modules. Procurement approvals up to $50,000.', users: 5 },
              { role: 'Operator / Staff', desc: 'Read-only access. Write capability constrained to batch updates.', users: 18 }
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-border/50 bg-background/20">
                <div>
                  <h4 className="font-bold text-sm">{r.role} ({r.users} active)</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.desc}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">Edit Matrix</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active modules toggle list */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold font-display text-lg">Personalize Your ERP Features</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Activate or deactivate modules instantly. Your monthly bill updates dynamically.</p>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {billingModules.map((m) => {
                const isSelected = state.selectedModules.includes(m.id as ModuleId)
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleBillingModule(m.id as ModuleId)}
                    className={cn(
                      'rounded-xl border p-4 cursor-pointer transition-colors flex flex-col justify-between h-36',
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/40 hover:bg-muted/30'
                    )}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm">{m.name}</p>
                          <Badge variant="outline" className="text-[9px] font-bold mt-1 tracking-wider uppercase bg-background/50">
                            {m.category}
                          </Badge>
                        </div>
                        {isSelected && (
                          <div className="rounded-full bg-primary p-0.5">
                            <Check className="size-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 leading-normal">{m.desc}</p>
                    </div>
                    <div className="text-right border-t border-border/40 pt-2 text-xs font-semibold text-primary">
                      +${m.price}/mo
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pricing breakdown and calculations */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-lg font-bold font-display flex items-center gap-2">
                <CreditCard className="size-5 text-primary" /> Plan Calculation
              </h3>

              {/* Annual switch */}
              <div className="flex items-center justify-between p-3.5 bg-background/50 rounded-xl border border-border">
                <div>
                  <p className="text-xs font-bold">Annual Billing</p>
                  <p className="text-[10px] text-muted-foreground">Save 20% on all modules</p>
                </div>
                <Switch checked={annual} onCheckedChange={setAnnual} />
              </div>

              {/* Breakdown details */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Base Plan (Starter)</span>
                  <span>${basePlanPrice}/mo</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Active Add-Ons ({activeModulesCount})</span>
                  <span>+${addOnTotal}/mo</span>
                </div>
                {annual && (
                  <div className="flex justify-between text-success font-semibold border-b border-border/50 pb-3">
                    <span>Annual discount (20%)</span>
                    <span>-20%</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-4 border-t border-border">
                  <span className="text-sm font-bold">Total Bill</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold font-display">{formatCurrency(totalPrice)}</span>
                    <span className="text-muted-foreground text-[10px] font-bold block">/ month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-6 space-y-3">
              {annual && (
                <div className="flex items-center gap-2 text-success text-[10px] font-semibold bg-success/5 p-2 rounded border border-success/15 leading-relaxed">
                  <Sparkles className="size-4 shrink-0" />
                  Your workspace saves {formatCurrency(annualSavings)} per year under this plan.
                </div>
              )}
              <Button className="w-full">
                Update Subscription
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
