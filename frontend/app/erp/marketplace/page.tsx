'use client'

import { useState } from 'react'
import {
  Globe,
  Plus,
  Check,
  Zap,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  Radio,
  Sliders,
  Sparkles,
  ArrowRight,
  Code,
  Key,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AppIntegration {
  id: string
  name: string
  category: 'ERP & Core' | 'Commerce & Billing' | 'DevOps & Cloud' | 'CRM & Comms'
  description: string
  installed: boolean
  syncInterval: string
  apiCallsToday: string
  iconBg: string
  features: string[]
}

const INTEGRATIONS: AppIntegration[] = [
  {
    id: 'sap-bridge',
    name: 'SAP S/4HANA Enterprise Bridge',
    category: 'ERP & Core',
    description: 'Bi-directional real-time ledger, material master (MM), and sales distribution (SD) sync.',
    installed: true,
    syncInterval: 'Real-Time Webhook (32ms)',
    apiCallsToday: '14,820 calls',
    iconBg: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
    features: ['IDoc & OData v4 Support', 'Two-Way General Ledger Sync', 'Automatic Conflict Resolution'],
  },
  {
    id: 'stripe-billing',
    name: 'Stripe Global Merchant & Treasury',
    category: 'Commerce & Billing',
    description: 'Autonomous customer recurring billing, global multi-currency settlements, and ACH direct debits.',
    installed: true,
    syncInterval: 'Instant Webhooks',
    apiCallsToday: '8,410 calls',
    iconBg: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    features: ['Auto-reconcile Bank Payouts', 'Stripe Billing Invoicing', 'Smart Retries & Dunning'],
  },
  {
    id: 'salesforce-crm',
    name: 'Salesforce CRM & CPQ Enterprise',
    category: 'CRM & Comms',
    description: 'Sync customer accounts, deal stages, price books, and closed-won orders into GrowLabs ERP.',
    installed: true,
    syncInterval: 'Every 5 mins',
    apiCallsToday: '4,290 calls',
    iconBg: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
    features: ['Opportunity-to-Order Conversion', 'Tiered Discount Validation', 'Contact 360 Sync'],
  },
  {
    id: 'shopify-plus',
    name: 'Shopify Plus Omnichannel Sync',
    category: 'Commerce & Billing',
    description: 'Automated catalog sync, multi-location stock decrementing, and order fulfillment tracking.',
    installed: false,
    syncInterval: 'Event Driven',
    apiCallsToday: '0 calls',
    iconBg: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    features: ['Multi-Warehouse Allocation', 'Live SKU Inventory Webhooks', 'Return & Refund Webhooks'],
  },
  {
    id: 'slack-bot',
    name: 'Slack Executive Operations Bot',
    category: 'CRM & Comms',
    description: 'Push high-priority AI alerts, PO approval requests, and production line halts into Slack channels.',
    installed: true,
    syncInterval: 'Real-Time',
    apiCallsToday: '1,120 calls',
    iconBg: 'bg-amber-600/20 text-amber-400 border-amber-500/30',
    features: ['Interactive 1-Click Approve in Slack', 'Daily Executive Morning Digest', '#ops-alerts Dispatch'],
  },
  {
    id: 'aws-cloudwatch',
    name: 'AWS GovCloud & IoT Telemetry',
    category: 'DevOps & Cloud',
    description: 'Ingest sensor metrics from factory IoT edge nodes directly into GrowLabs anomaly radar.',
    installed: true,
    syncInterval: 'Continuous (MQTT)',
    apiCallsToday: '124,500 calls',
    iconBg: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
    features: ['AWS IoT Core Integration', 'Cold-Chain S3 Telemetry Archive', 'Kinesis Real-Time Stream'],
  },
  {
    id: 'netsuite-hub',
    name: 'Oracle NetSuite Migration Hub',
    category: 'ERP & Core',
    description: 'Migrate and sync chart of accounts, journal entries, and vendor matrices from NetSuite.',
    installed: false,
    syncInterval: 'Hourly',
    apiCallsToday: '0 calls',
    iconBg: 'bg-rose-600/20 text-rose-400 border-rose-500/30',
    features: ['SuiteScript & RESTlet Sync', 'Historical 5-Year Ledger Import', 'Tax Schedule Mapping'],
  },
  {
    id: 'quickbooks-online',
    name: 'QuickBooks Online Advanced',
    category: 'Commerce & Billing',
    description: 'Seamless bi-directional sync for mid-market tax returns, payroll, and banking feeds.',
    installed: false,
    syncInterval: 'Every 15 mins',
    apiCallsToday: '0 calls',
    iconBg: 'bg-green-600/20 text-green-400 border-green-500/30',
    features: ['QBO Tax Engine', 'Automated Journal Entries', 'Bank Feed Auto-Matching'],
  },
]

export default function MarketplacePage() {
  const [apps, setApps] = useState<AppIntegration[]>(INTEGRATIONS)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [selectedApp, setSelectedApp] = useState<AppIntegration | null>(null)

  const filteredApps = apps.filter((app) => {
    const matchCat = selectedCategory === 'All' || app.category === selectedCategory
    const matchSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const toggleInstall = (id: string, name: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, installed: !a.installed } : a))
    )
    toast.success(`Connector state updated: ${name}`)
  }

  const handleTestPing = (name: string) => {
    toast.success(`Ping Successful to ${name}! Latency: 28ms. Health: 100% OK.`)
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-2">
            <Globe className="size-3.5" />
            GrowLabs Enterprise Ecosystem
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            App Marketplace & Enterprise Connectors
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Connect GrowLabs with SAP S/4HANA, NetSuite, Salesforce, Stripe, Shopify, and your custom REST webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => toast.info('Webhook Gateway: API Key generated in Settings.')}
          >
            <Key className="size-4" /> API Credentials
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card/40 border border-border p-4 rounded-3xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search enterprise apps and connectors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-primary font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['All', 'ERP & Core', 'Commerce & Billing', 'CRM & Comms', 'DevOps & Cloud'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all',
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground font-bold shadow'
                    : 'bg-background/60 text-muted-foreground hover:text-foreground border border-border'
                )}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* App Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className={cn(
              'rounded-3xl border p-6 flex flex-col justify-between space-y-5 transition-all shadow-lg',
              app.installed
                ? 'border-primary/40 bg-card/60 ring-1 ring-primary/20'
                : 'border-border bg-card/30 hover:border-primary/30'
            )}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className={cn('size-12 rounded-2xl flex items-center justify-center border font-bold text-base shadow', app.iconBg)}>
                  <Globe className="size-6" />
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    'text-[10px] font-mono uppercase font-bold',
                    app.installed
                      ? 'bg-success/15 text-success border-success/30'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {app.installed ? 'CONNECTED' : 'AVAILABLE'}
                </Badge>
              </div>

              <h4 className="font-bold text-base font-display text-foreground">{app.name}</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{app.description}</p>

              {/* Feature Pills */}
              <div className="space-y-1.5 pt-4">
                {app.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Check className="size-3 text-primary shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/50">
              {app.installed ? (
                <>
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Sync: {app.syncInterval}</span>
                    <span className="text-primary font-bold">{app.apiCallsToday}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs font-semibold"
                      onClick={() => handleTestPing(app.name)}
                    >
                      <Radio className="size-3 text-primary mr-1" /> Test Ping
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/20 hover:bg-destructive/10 text-xs"
                      onClick={() => toggleInstall(app.id, app.name)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  size="sm"
                  className="w-full text-xs font-semibold gap-1.5"
                  onClick={() => toggleInstall(app.id, app.name)}
                >
                  <Plus className="size-3.5" /> 1-Click Connect
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
