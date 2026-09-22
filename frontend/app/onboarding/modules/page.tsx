'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Search, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { useOnboarding, type ModuleId } from '@/lib/onboarding/store'
import { cn } from '@/lib/utils'

const allModules: { id: ModuleId; name: string; category: string; description: string }[] = [
  { id: 'inventory', name: 'Inventory Management', category: 'Core', description: 'Stock tracking, warehouses, reorder points' },
  { id: 'sales', name: 'Sales & CRM', category: 'Core', description: 'Orders, customers, fulfillment tracking' },
  { id: 'production', name: 'Production', category: 'Manufacturing', description: 'BOM, production orders, scheduling' },
  { id: 'procurement', name: 'Procurement', category: 'Core', description: 'Suppliers, POs, approvals, scorecards' },
  { id: 'finance', name: 'Finance', category: 'Core', description: 'Invoicing, payments, cash flow, accounting' },
  { id: 'analytics', name: 'Analytics', category: 'Intelligence', description: 'Dashboards, reports, trends, forecasts' },
  { id: 'hr', name: 'HR & Workforce', category: 'Admin', description: 'Employees, attendance, payroll, performance' },
  { id: 'quality', name: 'Quality Control', category: 'Manufacturing', description: 'Inspections, defects, compliance' },
  { id: 'logistics', name: 'Logistics', category: 'Operations', description: 'Shipments, tracking, carriers, returns' },
]

export default function ModulesPage() {
  const router = useRouter()
  const { state, update, markStep } = useOnboarding()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ['Core', 'Manufacturing', 'Intelligence', 'Operations', 'Admin']

  const filteredModules = allModules.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || m.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  function toggleModule(id: ModuleId) {
    const updated = state.selectedModules.includes(id)
      ? state.selectedModules.filter((m) => m !== id)
      : [...state.selectedModules, id]
    update({ selectedModules: updated })
  }

  async function finish() {
    if (state.selectedModules.length === 0) {
      alert('Please select at least one module')
      return
    }
    markStep('modules')
    router.push('/onboarding/activation')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-4 sm:px-6 sticky top-0 z-30 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/" aria-label="GrowLabs home" className="lg:hidden">
            <Logo />
          </Link>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Finalize Your Modules</h1>
          <div />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background/60 outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm transition-colors',
                  !selectedCategory
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/40',
                )}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-sm transition-colors',
                    selectedCategory === cat
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/40',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {filteredModules.map((module, idx) => {
              const isSelected = state.selectedModules.includes(module.id)

              return (
                <motion.button
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={cn(
                    'rounded-lg border p-4 text-left transition-all hover:shadow-lg',
                    isSelected
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-border bg-card/40 hover:border-primary/40',
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{module.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                        {module.category}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="rounded-full bg-primary p-1">
                        <Check className="size-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {module.description}
                  </p>
                </motion.button>
              )
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No modules match your search</p>
            </div>
          )}

          {/* Summary & CTA */}
          <div className="flex flex-col gap-4 sm:flex-row items-center justify-between border-t border-border pt-8">
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-3xl font-bold font-display">{state.selectedModules.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {state.selectedModules.length === 1 ? 'module' : 'modules'} in your ERP
              </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="h-11"
              >
                Back
              </Button>
              <Button
                size="lg"
                onClick={finish}
                className="h-11 flex-1 sm:flex-none"
              >
                Activate ERP
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
