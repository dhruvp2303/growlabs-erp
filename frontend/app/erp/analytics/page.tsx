'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  TrendingUp,
  Download,
  RefreshCw,
  BarChart3,
  Factory,
  Package,
  Truck,
  DollarSign,
} from 'lucide-react'
import { mockApi } from '@/lib/services/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { toast } from 'sonner'

export default function AnalyticsPage() {
  const [revenueTrend, setRevenueTrend] = useState<any[]>([])
  const [stockTrend, setStockTrend] = useState<any[]>([])
  const [salesByProduct, setSalesByProduct] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & State
  const [activeTab, setActiveTab] = useState<'finance' | 'operations' | 'inventory' | 'procurement'>('finance')

  useEffect(() => {
    async function loadAnalyticsData() {
      try {
        const rev = await mockApi.getRevenueTrend()
        const stock = await mockApi.getStockValueTrend()
        const sales = await mockApi.getSalesByProduct()
        setRevenueTrend(rev)
        setStockTrend(stock)
        setSalesByProduct(sales)
      } catch (err) {
        toast.error('Failed to load analytical database metrics.')
      } finally {
        setLoading(false)
      }
    }
    loadAnalyticsData()
  }, [])

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e']

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Analytics Portal…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Intelligence & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enterprise analytics queries resolving corporate trends, factory metrics, and supply chains.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" /> Export Report PDF
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('finance')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'finance'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Financial Ledger Trends
        </button>
        <button
          onClick={() => setActiveTab('operations')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'operations'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Production & Shop Floor
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'inventory'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Inventory Composition
        </button>
        <button
          onClick={() => setActiveTab('procurement')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'procurement'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Supplier Performance
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Area Chart */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <DollarSign className="size-5 text-primary" /> Revenue vs Expenditures
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} tickFormatter={(val: any) => `$${(val / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(val: any) => [`$${(val / 1000).toFixed(0)}k`]} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" fillOpacity={0.15} fill="var(--color-primary)" strokeWidth={2.5} name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stroke="var(--color-warning)" fillOpacity={0.05} fill="var(--color-warning)" strokeWidth={2} name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Breakdown */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between">
            <h3 className="text-lg font-bold font-display mb-4">Sales by Product Line</h3>
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByProduct}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {salesByProduct.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(0)}k`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-4">
              {salesByProduct.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn('size-2 rounded-full', i === 0 ? 'bg-[#6366f1]' : i === 1 ? 'bg-[#a855f7]' : i === 2 ? 'bg-[#ec4899]' : 'bg-[#f43f5e]')} />
                    <span className="text-muted-foreground truncate max-w-[160px]">{item.name}</span>
                  </div>
                  <span className="font-semibold">${(item.value / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <Factory className="size-5 text-primary" /> Shop Floor Assembly Scrap Rates
            </h3>
            <p className="text-xs text-muted-foreground">Scrap ratios logged per plant batch run.</p>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { plant: 'Plant A', target: 2.0, actual: 1.2 },
                  { plant: 'Plant B', target: 2.0, actual: 0.8 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="plant" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} tickFormatter={(val: any) => `${val}%`} />
                  <Tooltip formatter={(val: any) => [`${val}%`]} />
                  <Legend />
                  <Bar dataKey="target" fill="var(--color-muted)" radius={[4, 4, 0, 0]} name="Tolerance Limit" />
                  <Bar dataKey="actual" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Actual Scrap %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" /> Scheduling Queue Efficiency
            </h3>
            <p className="text-xs text-muted-foreground">On-time batch completions over the past 5 quarters.</p>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { q: 'Q2-25', efficiency: 91 },
                  { q: 'Q3-25', efficiency: 92 },
                  { q: 'Q4-25', efficiency: 89 },
                  { q: 'Q1-26', efficiency: 94 },
                  { q: 'Q2-26', efficiency: 96 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="q" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} domain={[80, 100]} tickFormatter={(val: any) => `${val}%`} />
                  <Tooltip formatter={(val: any) => [`${val}%`]} />
                  <Line type="monotone" dataKey="efficiency" stroke="var(--color-primary)" strokeWidth={2.5} activeDot={{ r: 8 }} name="Completion Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <Package className="size-5 text-primary" /> Asset Valuation History
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} tickFormatter={(val: any) => `$${(val / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(val: any) => [`$${(val / 1000).toFixed(0)}k`]} />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Valuation ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
            <h3 className="text-lg font-bold font-display">Inventory Health Diagnostics</h3>
            <div className="space-y-4 pt-4">
              {[
                { label: 'Inventory Turnover Rate', value: '5.8x', desc: 'Average stock rotation count per year.' },
                { label: 'Stockout Risk Index', value: 'Low', desc: 'Active BOM material allocation security ratio.' },
                { label: 'Valuation Aging (90+ Days)', value: '$120,000', desc: 'Slow moving component valuation in warehouses.' }
              ].map((h, i) => (
                <div key={i} className="flex justify-between items-start py-2 border-b border-border">
                  <div>
                    <h5 className="font-semibold text-sm">{h.label}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
                  </div>
                  <span className="text-base font-bold font-mono">{h.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'procurement' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <Truck className="size-5 text-primary" /> Vendor Lead Times comparison
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Apex Copper', days: 8 },
                  { name: 'Titan Steel', days: 12 },
                  { name: 'Volt Elec', days: 15 },
                  { name: 'Precision Brg', days: 21 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} tickFormatter={(val: any) => `${val} days`} />
                  <Tooltip formatter={(val: any) => [`${val} days`]} />
                  <Bar dataKey="days" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Lead Time" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
            <h3 className="text-lg font-bold font-display">Supplier Quality Auditing</h3>
            <div className="space-y-4 pt-4">
              {[
                { name: 'Apex Copper & Alloys', quality: '98%', status: 'preferred' },
                { name: 'Titan Steel Supply', quality: '92%', status: 'approved' },
                { name: 'Volt Electronics Group', quality: '94%', status: 'approved' },
                { name: 'Precision Bearings Intl.', quality: '85%', status: 'review' }
              ].map((s, idx) => (
                <div key={idx} className="flex justify-between items-center py-2.5 border-b border-border">
                  <div>
                    <h5 className="font-semibold text-sm">{s.name}</h5>
                    <Badge className="mt-1" variant={s.status === 'preferred' ? 'success' : s.status === 'review' ? 'destructive' : 'default'}>{s.status}</Badge>
                  </div>
                  <span className="text-base font-bold font-mono text-success">{s.quality}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
