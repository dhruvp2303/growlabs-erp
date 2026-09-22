'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Check, Info, Package, Factory, Truck, Users, Wallet, BarChart3, Zap, ClipboardCheck, ShieldCheck, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { useOnboarding } from '@/lib/onboarding/store'
import { cn } from '@/lib/utils'

interface ModuleRecommendation {
  id: string
  name: string
  icon: React.ReactNode
  tier: 'essential' | 'recommended' | 'optional'
  why: string
  benefits: string[]
  complexity: 'low' | 'medium' | 'high'
  dependencies?: string[]
}

export default function RecommendationPage() {
  const router = useRouter()
  const { state, update, markStep } = useOnboarding()
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  // Pre-select essential modules
  useEffect(() => {
    const essentials = ['inventory', 'sales', 'procurement', 'finance']
    const missing = essentials.filter((id) => !state.selectedModules.includes(id as any))
    if (missing.length > 0) {
      update({
        selectedModules: [...state.selectedModules, ...missing as any[]],
      })
    }
  }, [state.selectedModules, update])

  // Generate recommendations based on business DNA
  const modules: ModuleRecommendation[] = [
    // Essential
    {
      id: 'inventory',
      name: 'Inventory Management',
      icon: <Package className="size-5" />,
      tier: 'essential',
      why: 'You identified inventory as a pain point. Real-time stock tracking prevents stockouts and overstocking.',
      benefits: [
        'Multi-location inventory visibility',
        'Automated reorder points',
        'Low stock alerts',
        'Inventory aging analysis',
      ],
      complexity: 'medium',
    },
    {
      id: 'sales',
      name: 'Sales & Orders',
      icon: <ShoppingCart className="size-5" />,
      tier: 'essential',
      why: 'Every business needs to track customer orders and fulfillment. This is fundamental.',
      benefits: ['Order management', 'Customer tracking', 'Order status visibility', 'Fulfillment tracking'],
      complexity: 'low',
    },
    {
      id: 'procurement',
      name: 'Procurement',
      icon: <ClipboardCheck className="size-5" />,
      tier: 'essential',
      why: 'Managing suppliers and purchase orders is critical for operations.',
      benefits: [
        'Supplier management',
        'Purchase order workflow',
        'Approval automation',
        'Supplier scorecards',
      ],
      complexity: 'medium',
    },
    {
      id: 'finance',
      name: 'Finance & Accounting',
      icon: <Wallet className="size-5" />,
      tier: 'essential',
      why: 'Every business needs financial tracking, invoicing, and cash flow management.',
      benefits: ['Invoicing', 'Expense tracking', 'Cash flow forecasting', 'Profitability analysis'],
      complexity: 'medium',
    },

    // Recommended
    ...(state.industry === 'manufacturing'
      ? [
          {
            id: 'production',
            name: 'Production & Manufacturing',
            icon: <Factory className="size-5" />,
            tier: 'recommended' as const,
            why: 'As a manufacturing business, you need to track production, BOM, and quality.',
            benefits: [
              'Bill of materials (BOM)',
              'Production order tracking',
              'Capacity management',
              'Quality control',
            ],
            complexity: 'high' as const,
          },
        ]
      : []),

    {
      id: 'analytics',
      name: 'Analytics & Reporting',
      icon: <BarChart3 className="size-5" />,
      tier: 'recommended',
      why: 'Transform your data into insights. Critical for making data-driven decisions.',
      benefits: [
        'Real-time dashboards',
        'Custom reports',
        'Trend analysis',
        'Predictive insights',
      ],
      complexity: 'medium',
      dependencies: ['sales', 'inventory', 'finance'],
    },

    {
      id: 'logistics',
      name: 'Logistics & Shipping',
      icon: <Truck className="size-5" />,
      tier: 'recommended',
      why: 'Manage shipments, carriers, and delivery tracking end-to-end.',
      benefits: [
        'Shipment tracking',
        'Carrier management',
        'Delivery notifications',
        'Returns management',
      ],
      complexity: 'medium',
    },

    {
      id: 'hr',
      name: 'HR & Workforce',
      icon: <Users className="size-5" />,
      tier: 'recommended',
      why: 'Manage employees, attendance, and payroll as you scale.',
      benefits: [
        'Employee directory',
        'Attendance tracking',
        'Payroll management',
        'Performance tracking',
      ],
      complexity: 'medium',
    },

    // Optional
    {
      id: 'quality',
      name: 'Quality Control',
      icon: <ShieldCheck className="size-5" />,
      tier: 'optional',
      why: 'Add defect tracking and quality inspections if compliance is critical.',
      benefits: ['Inspection tracking', 'Defect management', 'Compliance reporting', 'Audit trails'],
      complexity: 'low',
    },

    {
      id: 'ai',
      name: 'AI Business Copilot',
      icon: <Zap className="size-5" />,
      tier: 'optional',
      why: 'Ask questions about your business and get AI-powered insights and recommendations.',
      benefits: [
        'Natural language queries',
        'Predictive alerts',
        'Smart recommendations',
        'Demand forecasting',
      ],
      complexity: 'low',
    },
  ]

  const essentialModules = modules.filter((m) => m.tier === 'essential')
  const recommendedModules = modules.filter((m) => m.tier === 'recommended')
  const optionalModules = modules.filter((m) => m.tier === 'optional')

  function toggleModule(id: string) {
    const isSelected = state.selectedModules.includes(id as any)
    const updated = isSelected
      ? state.selectedModules.filter((m) => m !== id)
      : [...state.selectedModules, id as any]
    update({ selectedModules: updated })
  }

  function proceed() {
    // Ensure essential modules are selected
    const essentialIds = essentialModules.map((m) => m.id)
    const allEssential = essentialIds.every((id) => state.selectedModules.includes(id as any))

    if (!allEssential) {
      alert('Please select all essential modules to continue')
      return
    }

    markStep('recommendation')
    router.push('/onboarding/modules')
  }

  const twoColLayout = (mods: ModuleRecommendation[]) => (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {mods.map((module, idx) => {
        const isSelected = state.selectedModules.includes(module.id as any)
        const isEssential = module.tier === 'essential'

        return (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            onClick={() => !isEssential && toggleModule(module.id)}
            className={cn(
              'rounded-xl border p-4 cursor-pointer transition-colors',
              isEssential && 'border-primary/40 bg-primary/5',
              isSelected && !isEssential && 'border-primary bg-primary/10',
              !isSelected && !isEssential && 'border-border hover:border-primary/40 hover:bg-muted/30',
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'rounded-lg p-2',
                  isEssential ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                )}>
                  {module.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{module.name}</p>
                  {isEssential && (
                    <span className="mt-1 inline-block text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      ESSENTIAL
                    </span>
                  )}
                </div>
              </div>
              {(isSelected || isEssential) && (
                <Check className="size-4 text-primary shrink-0 mt-1" />
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-3">{module.why}</p>

            {expandedModule === module.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3 border-t border-border pt-3"
              >
                <div>
                  <p className="text-xs font-medium mb-2">Key benefits:</p>
                  <ul className="space-y-1">
                    {module.benefits.map((benefit, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpandedModule(expandedModule === module.id ? null : module.id)
              }}
              className="mt-3 text-xs text-primary hover:underline"
            >
              {expandedModule === module.id ? 'Less info' : 'Why this'}
            </button>
          </motion.div>
        )
      })}
    </div>
  )

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/" aria-label="GrowLabs home" className="lg:hidden">
            <Logo />
          </Link>
          <h1 className="font-display text-2xl font-bold">Your ERP Recommendation</h1>
          <div />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 rounded-xl border border-primary/25 bg-primary/[0.06] p-6"
          >
            <div className="flex gap-4">
              <Info className="size-5 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Based on Your Business DNA</h3>
                <p className="text-sm text-muted-foreground">
                  GrowLabs has selected the perfect combination of modules for your {state.industry} business.
                  Essential modules are pre-selected. You can add or remove recommended and optional modules to
                  customize your workspace.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Essential Modules */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 font-display">Essential Modules</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Required to run your business effectively
            </p>
            {twoColLayout(essentialModules)}
          </div>

          {/* Recommended Modules */}
          {recommendedModules.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold mb-4 font-display">Recommended for Your Business</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Significantly improve operations and decision-making
              </p>
              {twoColLayout(recommendedModules)}
            </div>
          )}

          {/* Optional Modules */}
          {optionalModules.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold mb-4 font-display">Add Later (Optional)</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Enhance your ERP as your business evolves
              </p>
              {twoColLayout(optionalModules)}
            </div>
          )}

          {/* Summary & CTA */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 rounded-lg border border-border bg-card/40 p-4">
              <p className="text-sm font-medium mb-2">Selected Modules</p>
              <p className="text-2xl font-bold font-display">{state.selectedModules.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {state.selectedModules.length === 1 ? 'module' : 'modules'} selected
              </p>
            </div>

            <Button
              size="lg"
              className="h-auto sm:h-auto px-6 py-4"
              onClick={proceed}
            >
              <div className="flex flex-col items-start">
                <span>Continue to Setup</span>
                <span className="text-xs opacity-80 mt-1">
                  Customize your selected modules →
                </span>
              </div>
              <ArrowRight className="size-5 ml-auto" data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
