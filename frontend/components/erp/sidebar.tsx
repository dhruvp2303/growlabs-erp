'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Factory,
  Wrench,
  Users,
  Wallet,
  LogOut,
  Menu,
  Truck,
  BarChart3,
  Sparkles,
  Workflow,
  Globe,
  ShieldCheck,
  Palette,
  Settings as SettingsIcon,
} from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useOnboarding } from '@/lib/onboarding/store'
import { usePersonalization } from '@/lib/personalization/personalization-provider'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Package, label: 'Inventory', href: '/erp/inventory', moduleId: 'inventory' },
  { icon: ShoppingCart, label: 'Sales', href: '/erp/sales', moduleId: 'sales' },
  { icon: TrendingUp, label: 'Procurement', href: '/erp/procurement', moduleId: 'procurement' },
  { icon: Factory, label: 'Production', href: '/erp/production', moduleId: 'production' },
  { icon: Wrench, label: 'Quality', href: '/erp/quality', moduleId: 'quality' },
  { icon: Wallet, label: 'Finance', href: '/erp/finance', moduleId: 'finance' },
  { icon: Users, label: 'HR', href: '/erp/hr', moduleId: 'hr' },
  { icon: Truck, label: 'Logistics', href: '/erp/logistics', moduleId: 'logistics' },
  { icon: BarChart3, label: 'Analytics', href: '/erp/analytics', moduleId: 'analytics' },
  { icon: Sparkles, label: 'AI Copilot', href: '/erp/ai-copilot', moduleId: 'ai' },
  { icon: Workflow, label: 'Automation', href: '/erp/automation' },
  { icon: Globe, label: 'Marketplace', href: '/erp/marketplace' },
  { icon: ShieldCheck, label: 'Compliance Vault', href: '/erp/compliance' },
  { icon: SettingsIcon, label: 'Settings', href: '/erp/settings' },
]

export function Sidebar({ mobile = false, open = true, onClose }: { mobile?: boolean; open?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { state: onboardingState } = useOnboarding()
  const { profile, state: personalizationState } = usePersonalization()

  const visibleItems = navItems.filter((item) => {
    if (!item.moduleId) return true
    if (!onboardingState?.selectedModules || onboardingState.selectedModules.length === 0) return true
    return onboardingState.selectedModules.includes(item.moduleId as any)
  })

  function handleLogout() {
    localStorage.removeItem('growlabs_email')
    sessionStorage.clear()
    router.push('/')
  }

  const classes = mobile
    ? cn(
        'fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-background transition-transform duration-300 flex flex-col',
        open ? 'translate-x-0' : '-translate-x-full',
      )
    : 'hidden lg:flex flex-col w-64 border-r border-border bg-card/40'

  return (
    <>
      {mobile && open && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={onClose}
        />
      )}
      <div className={classes}>
        <div className="flex flex-col gap-2 border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-xs font-bold text-primary tracking-wider uppercase">ERP PRO</span>
          </div>
          <div className="pt-1">
            <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground w-full justify-center truncate">
              {profile.badge}
            </Badge>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={mobile ? onClose : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all',
                  isActive
                    ? 'bg-primary/15 text-primary font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border px-3 py-3 space-y-2">
          <div className="text-[11px] text-muted-foreground px-2 truncate">
            Tenant: <strong className="text-foreground">{personalizationState.companyName}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  )
}
