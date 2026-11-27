'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Bell, Search, MessageSquare, User, Menu, X, ArrowRight, CornerDownLeft, Sparkles, Palette, Globe, ShieldCheck, Lock, Unlock, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { products, customers, orders, suppliers } from '@/lib/mock/data'
import { useRouter } from 'next/navigation'
import { usePersonalization } from '@/lib/personalization/personalization-provider'
import { useErpWorkflow, Role } from '@/lib/workflow/erp-workflow-provider'
import { PersonalizationStudioModal } from '@/components/erp/personalization-studio-modal'
import { SecureInvoiceModal } from '@/components/erp/secure-invoice-modal'

interface TopNavProps {
  onMenuClick?: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const router = useRouter()
  const { profile } = usePersonalization()
  const { notifications, activeRole, markNotificationRead, setActiveRole } = useErpWorkflow()
  const [profileOpen, setProfileOpen] = useState(false)
  const [studioOpen, setStudioOpen] = useState(false)
  const [vaultOpen, setVaultOpen] = useState(false)
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false)

  // Unread notifications targeting this role
  const unreadCount = notifications.filter((n) => n.targetRoles.includes(activeRole) && !n.readBy.includes(activeRole)).length

  // Command Palette Overlay state
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto-focus input on open
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (paletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSearchQuery('')
      setSelectedIndex(0)
    }
  }, [paletteOpen])

  // Filtered lists
  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) {
      return [
        { category: 'Modules', label: 'Go to Inventory Management', href: '/erp/inventory' },
        { category: 'Modules', label: 'Go to Sales Dashboard', href: '/erp/sales' },
        { category: 'Modules', label: 'Go to AI Copilot Studio', href: '/erp/ai-copilot' },
        { category: 'Modules', label: 'Go to Workflow Automation', href: '/erp/automation' },
        { category: 'Modules', label: 'Go to App Marketplace & Connectors', href: '/erp/marketplace' },
        { category: 'Modules', label: 'Go to Cryptographic Compliance Vault', href: '/erp/compliance' },
        { category: 'Modules', label: 'Go to Finance Ledger', href: '/erp/finance' },
      ]
    }

    const items: { category: string; label: string; href: string }[] = []

    const modulesList = [
      { label: 'Inventory Management & 3D Map', href: '/erp/inventory' },
      { label: 'Sales & CRM Deals', href: '/erp/sales' },
      { label: 'Procurement Requisitions', href: '/erp/procurement' },
      { label: 'Production Scheduling', href: '/erp/production' },
      { label: 'Quality Control Inspections', href: '/erp/quality' },
      { label: 'Finance & Cash Flow', href: '/erp/finance' },
      { label: 'HR Workforce', href: '/erp/hr' },
      { label: 'Logistics tracking', href: '/erp/logistics' },
      { label: 'Analytics Reports', href: '/erp/analytics' },
      { label: 'AI Copilot Brain & Agents', href: '/erp/ai-copilot' },
      { label: 'Workflow Automation Studio', href: '/erp/automation' },
      { label: 'App Marketplace & Connectors', href: '/erp/marketplace' },
      { label: 'Compliance & Audit Vault', href: '/erp/compliance' },
      { label: 'Workspace Settings', href: '/erp/settings' },
    ]
    modulesList.forEach((m) => {
      if (m.label.toLowerCase().includes(q)) {
        items.push({ category: 'Modules', label: m.label, href: m.href })
      }
    })

    products.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) {
        items.push({ category: 'Products', label: `Product: ${p.name} (${p.sku})`, href: '/erp/inventory' })
      }
    })

    customers.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        items.push({ category: 'Customers', label: `Customer: ${c.name} (${c.segment})`, href: '/erp/sales' })
      }
    })

    orders.forEach((o) => {
      if (o.reference.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)) {
        items.push({ category: 'Orders', label: `Sales Order: ${o.reference} - ${o.customer}`, href: '/erp/sales' })
      }
    })

    return items
  }, [searchQuery])

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(filteredResults.length - 1, prev + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(0, prev - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex].href)
      }
    }
  }

  const handleSelectItem = (href: string) => {
    setPaletteOpen(false)
    router.push(href)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Menu & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="inline-flex size-10 items-center justify-center rounded-lg text-foreground lg:hidden hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="size-5" />
          </button>

          {/* Search trigger button */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-2.5 sm:px-3.5 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all w-36 sm:w-64 text-left"
          >
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">Search ERP…</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[9px] font-medium text-muted-foreground shadow-sm">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Secure Vault Button (Bills & Invoices) */}
          <button
            onClick={() => setVaultOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-amber-400 transition-all hover:bg-amber-500/20"
            title="Password-Protected Invoices & Bills Vault"
          >
            <Lock className="size-3.5 text-amber-400" />
            <span className="hidden sm:inline">Bills & Invoices</span>
            <span className="sm:hidden">Vault</span>
          </button>

          {/* Hyper-Personalization Studio Launcher */}
          <button
            onClick={() => setStudioOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20"
          >
            <Palette className="size-3.5" />
            <span>Studio</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 inline-flex size-4.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl p-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-border pb-2.5 mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <Bell className="size-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">ERP Live Notifications</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono uppercase">
                    Role: {activeRole}
                  </Badge>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {notifications.filter((n) => n.targetRoles.includes(activeRole)).length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      No notifications for role &quot;{activeRole}&quot;.
                    </div>
                  ) : (
                    notifications
                      .filter((n) => n.targetRoles.includes(activeRole))
                      .map((n) => {
                        const isUnread = !n.readBy.includes(activeRole)
                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id)
                              if (n.actionUrl) {
                                setNotifDropdownOpen(false)
                                router.push(n.actionUrl)
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                              isUnread
                                ? 'bg-primary/10 border-primary/30 text-foreground font-medium'
                                : 'bg-background/40 border-border/40 text-muted-foreground hover:bg-muted/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-[11px] truncate">{n.title}</span>
                              <span className="text-[9px] font-mono opacity-70 shrink-0">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed line-clamp-2">{n.message}</p>
                          </div>
                        )
                      })
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-border flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Logged in as {activeRole.toUpperCase()}</span>
                  <button
                    onClick={() => { setNotifDropdownOpen(false); router.push('/erp/sales'); }}
                    className="text-primary font-semibold hover:underline"
                  >
                    Open Workflow Hub &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Assistant */}
          <button
            onClick={() => router.push('/erp/ai-copilot')}
            className="inline-flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            aria-label="AI Assistant"
          >
            <MessageSquare className="size-4" />
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={cn(
                'inline-flex size-10 items-center justify-center rounded-xl transition-colors',
                profileOpen
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              aria-label="Profile menu"
            >
              <User className="size-4" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-border bg-card shadow-2xl p-2">
                <div className="border-b border-border px-3 py-2.5">
                  <p className="text-sm font-semibold">Jordan Reyes</p>
                  <p className="text-xs text-muted-foreground">jordan@primeflow.corp</p>
                  <Badge className="mt-1.5 bg-primary/15 text-primary border-primary/25 text-[9px] font-mono">
                    {profile.badge}
                  </Badge>
                </div>
                <div className="pt-2">
                  <button onClick={() => { setProfileOpen(false); setStudioOpen(true); }} className="w-full rounded-xl px-3 py-2 text-xs font-semibold text-left text-primary transition-colors hover:bg-primary/10 flex items-center gap-2">
                    <Palette className="size-3.5" /> Personalization Studio
                  </button>
                  <button onClick={() => { setProfileOpen(false); router.push('/erp/marketplace'); }} className="w-full rounded-xl px-3 py-2 text-xs text-left text-muted-foreground transition-colors hover:text-foreground hover:bg-muted">
                    App Marketplace
                  </button>
                  <button onClick={() => { setProfileOpen(false); router.push('/erp/compliance'); }} className="w-full rounded-xl px-3 py-2 text-xs text-left text-muted-foreground transition-colors hover:text-foreground hover:bg-muted">
                    Compliance Vault
                  </button>
                  <button onClick={() => { setProfileOpen(false); router.push('/erp/settings'); }} className="w-full rounded-xl px-3 py-2 text-xs text-left text-muted-foreground transition-colors hover:text-foreground hover:bg-muted">
                    Workspace Settings
                  </button>
                  <div className="border-t border-border my-2" />
                  <button onClick={() => { setProfileOpen(false); router.push('/'); }} className="w-full rounded-xl px-3 py-2 text-xs text-left text-destructive transition-colors hover:bg-destructive/10">
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personalization Studio Modal */}
      <PersonalizationStudioModal open={studioOpen} onClose={() => setStudioOpen(false)} />

      {/* Password-Protected Bills & Invoices Vault Modal */}
      <SecureInvoiceModal open={vaultOpen} onClose={() => setVaultOpen(false)} />

      {/* CTRL+K Search Overlay Modal */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15dvh] px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPaletteOpen(false)} />
          
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[440px] focus:outline-none">
            {/* Search Input bar */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-background/50">
              <Search className="size-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products, orders, customers, modules..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                onKeyDown={handleListKeyDown}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
              />
              <button
                onClick={() => setPaletteOpen(false)}
                className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded hover:text-foreground hover:bg-muted transition-colors shrink-0"
              >
                esc
              </button>
            </div>

            {/* Results box */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3">
              {filteredResults.length > 0 ? (
                <div>
                  {/* We group by category */}
                  {Array.from(new Set(filteredResults.map((r) => r.category))).map((cat) => (
                    <div key={cat} className="space-y-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1.5 block">
                        {cat}
                      </span>
                      {filteredResults
                        .map((r, itemIdx) => ({ ...r, overallIndex: itemIdx }))
                        .filter((r) => r.category === cat)
                        .map((r) => {
                          const isSelected = r.overallIndex === selectedIndex
                          return (
                            <button
                              key={r.overallIndex}
                              onClick={() => handleSelectItem(r.href)}
                              onMouseEnter={() => setSelectedIndex(r.overallIndex)}
                              className={cn(
                                'w-full text-left rounded-xl px-3 py-2.5 text-xs transition-colors flex items-center justify-between font-medium',
                                isSelected ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                              )}
                            >
                              <span>{r.label}</span>
                              {isSelected && (
                                <CornerDownLeft className="size-3.5 opacity-80" />
                              )}
                            </button>
                          )
                        })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm flex flex-col items-center gap-1.5">
                  <Sparkles className="size-5 text-muted-foreground/50" />
                  <span>No results match your query.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
