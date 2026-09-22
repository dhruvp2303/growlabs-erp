'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Search,
  Plus,
  ArrowUpDown,
  Download,
  Wallet,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  Clock,
} from 'lucide-react'
import { mockApi } from '@/lib/services/api'
import { Invoice } from '@/lib/mock/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'

export default function FinancePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [revenueTrend, setRevenueTrend] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'cashflow' | 'invoices' | 'expenses'>('cashflow')

  // Sorting
  const [sortField, setSortField] = useState<keyof Invoice>('reference')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    async function loadFinanceData() {
      try {
        const invData = await mockApi.getInvoices()
        const trendData = await mockApi.getRevenueTrend()
        setInvoices(invData)
        setRevenueTrend(trendData)
      } catch (err) {
        toast.error('Failed to load financial data.')
      } finally {
        setLoading(false)
      }
    }
    loadFinanceData()
  }, [])

  // Filtered & Sorted Invoices
  const processedInvoices = useMemo(() => {
    let result = [...invoices]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (inv) =>
          inv.reference.toLowerCase().includes(q) ||
          inv.customer.toLowerCase().includes(q),
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter((inv) => inv.status === statusFilter.toLowerCase())
    }

    result.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (typeof aVal === 'string') {
        aVal = (aVal as string).toLowerCase()
        bVal = (bVal as string).toLowerCase()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [invoices, search, statusFilter, sortField, sortDirection])

  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleRecordPayment = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv)),
    )
    toast.success('Invoice marked as Paid.')
  }

  const stats = useMemo(() => {
    const totalReceivable = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0)
    const overdueReceivable = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
    const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
    return { totalReceivable, overdueReceivable, totalPaid }
  }, [invoices])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Financial Data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Finance & Ledger</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Oversee corporate invoices, monitor accounts receivable, and analyze monthly cash flows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" /> Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" /> Issue Invoice
          </Button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Received (Paid)</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display text-success">{formatCurrency(stats.totalPaid)}</h3>
          </div>
          <div className="rounded-xl bg-success/10 text-success p-3">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Accounts Receivable (Pending)</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display text-primary">{formatCurrency(stats.totalReceivable)}</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <DollarSign className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-destructive/15 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-destructive font-semibold uppercase tracking-wider">Overdue Invoices</p>
            <h3 className="text-2xl font-bold mt-1.5 text-destructive font-display">{formatCurrency(stats.overdueReceivable)}</h3>
          </div>
          <div className="rounded-xl bg-destructive/10 text-destructive p-3">
            <Clock className="size-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('cashflow')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'cashflow'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Cash Flow Dashboard
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'invoices'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Receivables (Invoices)
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'expenses'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Payables (Expenses)
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'cashflow' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cash flow Chart */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold font-display mb-4">Revenue vs Operations Cost</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} tickFormatter={(val: any) => `$${(val / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                    formatter={(val: any) => [`$${(val / 1000).toFixed(0)}k`]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" fillOpacity={1} fill="url(#revGrad)" strokeWidth={2.5} name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stroke="var(--color-warning)" fillOpacity={1} fill="url(#expGrad)" strokeWidth={2} name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick profitability stats */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between">
            <h3 className="text-lg font-bold font-display mb-4">Profitability Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-xs text-muted-foreground font-semibold">Net Profit Margin</span>
                <span className="text-base font-bold font-display text-success">42.2%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-xs text-muted-foreground font-semibold">Average Invoicing Cycle</span>
                <span className="text-sm font-semibold font-mono">14 Days</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-xs text-muted-foreground font-semibold">Monthly Expense Ratio</span>
                <span className="text-sm font-semibold font-mono">57.7%</span>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/[0.05] p-4 text-xs leading-relaxed text-muted-foreground">
              * Profit margins increased by 3.2% this quarter due to automated batch procurement optimization.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-card/10 p-4 rounded-xl border border-border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search invoices by customer or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-background border border-border rounded-lg text-xs px-2.5 py-1.5 focus:border-primary outline-none"
              >
                <option value="All">All Invoices</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('reference')} className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      Invoice Ref <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('customer')} className="cursor-pointer hover:bg-muted/50">
                    Client Customer
                  </TableHead>
                  <TableHead className="text-right">Billing Amount</TableHead>
                  <TableHead className="text-center">Due Date</TableHead>
                  <TableHead className="text-center">Payment Status</TableHead>
                  <TableHead className="w-40 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedInvoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-bold">{inv.reference}</TableCell>
                    <TableCell className="font-semibold">{inv.customer}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(inv.amount)}</TableCell>
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">{inv.due}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'capitalize font-semibold',
                          inv.status === 'paid' && 'bg-success/10 text-success border-success/35',
                          inv.status === 'pending' && 'bg-primary/10 text-primary border-primary/35',
                          inv.status === 'overdue' && 'bg-destructive/10 text-destructive border-destructive/35',
                        )}
                        variant="outline"
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {inv.status !== 'paid' ? (
                        <Button size="sm" variant="outline" className="text-xs font-semibold py-1 px-3.5" onClick={() => handleRecordPayment(inv.id)}>
                          Paid
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground pr-2 font-medium">Reconciled</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {processedInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No invoices found matching filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="rounded-xl border border-border overflow-hidden bg-card/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Expenditure Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right font-semibold">Cost</TableHead>
                <TableHead className="text-center">Payment Date</TableHead>
                <TableHead className="text-center">Approval Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { ref: 'EXP-9831', cat: 'Machinery maintenance', desc: 'Emergency Plant A conveyor belt replacement', cost: 8600, date: '2026-08-28', status: 'approved' },
                { ref: 'EXP-9830', cat: 'Logistics freight', desc: 'Dallas DC to Reno DC transfer shipping', cost: 3200, date: '2026-08-25', status: 'approved' },
                { ref: 'EXP-9829', cat: 'Supplier disbursement', desc: 'Apex Copper raw material PO-3391 settlement', cost: 42000, date: '2026-08-22', status: 'approved' }
              ].map((exp, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-xs font-bold">{exp.ref}</TableCell>
                  <TableCell className="font-medium">{exp.cat}</TableCell>
                  <TableCell>{exp.desc}</TableCell>
                  <TableCell className="text-right font-mono font-bold">{formatCurrency(exp.cost)}</TableCell>
                  <TableCell className="text-center font-mono text-xs text-muted-foreground">{exp.date}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-success/10 text-success border-success/35" variant="outline">
                      {exp.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
