'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Zap,
  CreditCard,
  Loader2,
  Sparkles,
  Bot,
  Activity,
  Palette,
  ShieldCheck,
  Globe,
  Sliders,
  Play,
  ArrowRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { mockApi } from '@/lib/services/api'
import { usePersonalization } from '@/lib/personalization/personalization-provider'
import { PersonalizationStudioModal } from '@/components/erp/personalization-studio-modal'
import { DepartmentFlow } from '@/components/erp/department-flow'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { toast } from 'sonner'
import Link from 'next/link'

export default function DashboardPage() {
  const { profile, state } = usePersonalization()
  const [revenueTrend, setRevenueTrend] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [studioOpen, setStudioOpen] = useState(false)

  // Interactive Runway Stress Slider State
  const [simulatedRevenueGrowth, setSimulatedRevenueGrowth] = useState(12)
  const [simulatedTariffImpact, setSimulatedTariffImpact] = useState(0)

  useEffect(() => {
    async function loadData() {
      try {
        const revenue = await mockApi.getRevenueTrend()
        setRevenueTrend(revenue)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Dynamic EBITDA calculations based on slider
  const dynamicEbitda = useMemo(() => {
    const baseRevenue = 2840000
    const baseExpenses = 1640000
    const adjustedRev = baseRevenue * (1 + simulatedRevenueGrowth / 100)
    const adjustedExp = baseExpenses * (1 + simulatedTariffImpact / 100)
    const ebitda = adjustedRev - adjustedExp
    const margin = ((ebitda / adjustedRev) * 100).toFixed(1)
    const runwayMonths = (3840000 / (adjustedExp / 12)).toFixed(1)
    return { ebitda, margin, runwayMonths }
  }, [simulatedRevenueGrowth, simulatedTariffImpact])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Executive War Room…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header with Industry Badge & Studio Trigger */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary/15 text-primary border-primary/30 font-mono text-[11px] px-3 py-0.5">
              {profile.badge}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              Active Tenant: <strong className="text-foreground">{state.companyName}</strong>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
            Executive Intelligence War Room
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{profile.tagline}</p>
        </div>

        {/* Hyper-Personalization Studio Pill */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setStudioOpen(true)}
            variant="outline"
            className="gap-2 border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-semibold shadow-sm"
          >
            <Palette className="size-4" /> Personalize ERP Engine
          </Button>

          <Link href="/erp/ai-copilot">
            <Button className="gap-2 font-semibold shadow-lg shadow-primary/20">
              <Sparkles className="size-4" /> AI Copilot
            </Button>
          </Link>
        </div>
      </div>

      {/* Industry-Personalized KPI Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {profile.kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="rounded-3xl border border-border bg-card/40 p-6 hover:border-primary/40 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-3xl font-bold font-display mt-2 text-foreground tracking-tight">{kpi.value}</h3>
              <p
                className={cn(
                  'mt-2 text-xs font-semibold flex items-center gap-1',
                  kpi.status === 'up' && 'text-success',
                  kpi.status === 'down' && 'text-destructive',
                  kpi.status === 'neutral' && 'text-primary'
                )}
              >
                {kpi.status === 'up' && '↗ '}
                {kpi.status === 'down' && '↘ '}
                {kpi.change}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground pt-3 border-t border-border/40 leading-relaxed">
              {kpi.description}
            </p>
          </div>
        ))}
      </div>

      {/* Specialized Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gradient-to-r from-primary/10 via-card to-accent/10 p-5 rounded-3xl border border-primary/20 shadow-md">
        {profile.specializedMetrics.map((sm, i) => (
          <div key={i} className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block">
              {sm.label}
            </span>
            <span className="text-2xl font-bold font-display text-foreground block">{sm.value}</span>
            <span className="text-xs text-primary font-medium block">{sm.sublabel}</span>
          </div>
        ))}
      </div>

      {/* Interactive Runway & EBITDA Stress Simulator Card */}
      <div className="rounded-3xl border border-border bg-card/40 p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
                <Sliders className="size-5 text-primary" /> Live Financial Runway & EBITDA Shock Simulator
              </h3>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                INTERACTIVE
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag sliders to stress-test your monthly revenue expansion versus supply chain tariff shocks.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-muted-foreground">Calculated Runway: <strong className="text-foreground text-sm">{dynamicEbitda.runwayMonths} Months</strong></span>
            <span className="text-muted-foreground">EBITDA Margin: <strong className="text-success text-sm">{dynamicEbitda.margin}%</strong></span>
          </div>
        </div>

        {/* 2 Slider Controls + Result Metric */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Slider 1 */}
          <div className="p-4 rounded-2xl bg-background/50 border border-border space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Revenue Expansion Rate</span>
              <span className="text-primary font-bold font-mono">+{simulatedRevenueGrowth}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="50"
              value={simulatedRevenueGrowth}
              onChange={(e) => setSimulatedRevenueGrowth(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Slider 2 */}
          <div className="p-4 rounded-2xl bg-background/50 border border-border space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Tariff / Cost Inflation Shock</span>
              <span className="text-destructive font-bold font-mono">+{simulatedTariffImpact}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={simulatedTariffImpact}
              onChange={(e) => setSimulatedTariffImpact(Number(e.target.value))}
              className="w-full accent-destructive cursor-pointer"
            />
          </div>

          {/* Dynamic Calculated EBITDA Result */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Simulated Monthly EBITDA</span>
              <span className="text-2xl font-bold font-display text-primary mt-0.5 block">
                {formatCurrency(dynamicEbitda.ebitda)}
              </span>
            </div>
            <div className="text-right">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => { setSimulatedRevenueGrowth(12); setSimulatedTariffImpact(0); }}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Cross-Department Operations Flow */}
      <DepartmentFlow />

      {/* Charts & Revenue Trends Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue vs Expense Area Chart */}
        <div className="rounded-3xl border border-border bg-card/40 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold font-display text-foreground">Revenue Trajectory & Expenses</h2>
              <p className="text-xs text-muted-foreground">Trailing 7 months actuals with AI linear regression</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              +12.5% MOM
            </Badge>
          </div>

          {revenueTrend.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="warRoomRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} tickFormatter={(val: any) => `$${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                    }}
                    formatter={(value: any) => `$${(value / 1000).toFixed(1)}k`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-primary)"
                    fillOpacity={1}
                    fill="url(#warRoomRevenue)"
                    strokeWidth={2.5}
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="var(--color-warning)"
                    fillOpacity={0}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No telemetry available
            </div>
          )}
        </div>

        {/* Live Anomaly Detection & AI Radar */}
        <div className="rounded-3xl border border-border bg-card/40 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-display text-foreground flex items-center gap-2">
              <Activity className="size-5 text-primary" /> Live Operational Radar
            </h2>
            <Link href="/erp/ai-copilot" className="text-xs text-primary font-semibold hover:underline">
              View All 6 Alerts &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="mt-1 size-2.5 rounded-full bg-destructive animate-ping shrink-0" />
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-foreground">Critical Buffer Deficit: Precision Bearing 32</p>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  Available stock (210) is below scheduled assembly demand (380). PO-3390 is pending approval.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4">
              <div className="mt-1 size-2.5 rounded-full bg-warning shrink-0" />
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-foreground">Delayed Customer Order SO-10481</p>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  Delta Municipal Works delivery risk. AI suggests dispatching rush freight from Reno DC.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/[0.06] p-4">
              <div className="mt-1 size-2.5 rounded-full bg-primary shrink-0" />
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-bold text-primary">Autonomous Optimization Active</p>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  5 AI Agents continuously monitoring inventory, treasury runway, and line quality metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personalization Studio Modal */}
      <PersonalizationStudioModal open={studioOpen} onClose={() => setStudioOpen(false)} />
    </div>
  )
}
