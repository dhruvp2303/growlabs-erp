'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Search,
  Plus,
  ArrowUpDown,
  Download,
  AlertTriangle,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  Truck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { mockApi } from '@/lib/services/api'
import { Order, Customer } from '@/lib/mock/data'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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
import { toast } from 'sonner'
import { SmartOrderIntelligence } from '@/components/erp/smart-order-intelligence'

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'orders' | 'customers' | 'fulfillment'>('orders')

  // Sorting
  const [sortField, setSortField] = useState<keyof Order>('reference')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Smart Fulfillment Analyzer target order
  const [selectedOrderForAnalysis, setSelectedOrderForAnalysis] = useState<Order | null>(null)

  useEffect(() => {
    async function loadSalesData() {
      try {
        const orderData = await mockApi.getOrders()
        const custData = await mockApi.getCustomers()
        setOrders(orderData)
        setCustomers(custData)
      } catch (err) {
        toast.error('Failed to load sales data.')
      } finally {
        setLoading(false)
      }
    }
    loadSalesData()
  }, [])

  // Sorting Handler
  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filtered & Sorted Orders
  const processedOrders = useMemo(() => {
    let result = [...orders]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.reference.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q),
      )
    }

    // Status
    if (statusFilter !== 'All') {
      result = result.filter((o) => o.status === statusFilter.toLowerCase())
    }

    // Sort
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
  }, [orders, search, statusFilter, sortField, sortDirection])

  // Paginated Orders
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return processedOrders.slice(start, start + itemsPerPage)
  }, [processedOrders, currentPage])

  const totalPages = Math.ceil(processedOrders.length / itemsPerPage)

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0)
    const openCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length
    const delayedCount = orders.filter((o) => o.status === 'delayed').length
    return { totalRevenue, openCount, delayedCount }
  }, [orders])

  const analyzeFulfillment = (order: Order) => {
    setSelectedOrderForAnalysis(order)
    setActiveTab('fulfillment')
    toast.success(`Analyzing fulfillment parameters for order ${order.reference}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Sales Data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Sales & Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track customer orders, manage account relationships, and analyze fulfillment metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" /> Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" /> New Sales Order
          </Button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Sales Pipeline</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display">{formatCurrency(stats.totalRevenue)}</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <ShoppingCart className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Active Open Orders</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display">{stats.openCount} Orders</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <TrendingUp className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-destructive/15 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-destructive font-semibold uppercase tracking-wider">Fulfillment Delays</p>
            <h3 className="text-2xl font-bold mt-1.5 text-destructive font-display">{stats.delayedCount} Delayed</h3>
          </div>
          <div className="rounded-xl bg-destructive/10 text-destructive p-3">
            <AlertTriangle className="size-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Customer Orders
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'customers'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Customers Directory
        </button>
        <button
          onClick={() => setActiveTab('fulfillment')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'fulfillment'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Smart Order Fulfillment {selectedOrderForAnalysis && `(${selectedOrderForAnalysis.reference})`}
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-card/10 p-4 rounded-xl border border-border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders by customer or reference..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full bg-background border border-border pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Order Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-background border border-border rounded-lg text-xs px-2.5 py-1.5 focus:border-primary outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('reference')} className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      Reference <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('customer')} className="cursor-pointer hover:bg-muted/50">
                    Customer
                  </TableHead>
                  <TableHead>Product Ordered</TableHead>
                  <TableHead className="text-right">Qty (Units)</TableHead>
                  <TableHead className="text-right">Order Amount</TableHead>
                  <TableHead className="text-center">Fulfillment (%)</TableHead>
                  <TableHead className="text-center">Fulfillment Status</TableHead>
                  <TableHead className="w-40 text-right">Fulfillment Analyzer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((o) => (
                  <TableRow key={o.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-bold">{o.reference}</TableCell>
                    <TableCell className="font-semibold">{o.customer}</TableCell>
                    <TableCell>{o.product}</TableCell>
                    <TableCell className="text-right font-mono">{o.units}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(o.amount)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2 max-w-[120px] mx-auto">
                        <Progress value={o.fulfillment} className="h-1.5 flex-1" />
                        <span className="text-xs font-mono font-semibold">{o.fulfillment}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'capitalize font-semibold',
                          o.status === 'fulfilled' && 'bg-success/10 text-success border-success/35',
                          o.status === 'processing' && 'bg-primary/10 text-primary border-primary/35',
                          o.status === 'pending' && 'bg-warning/10 text-warning border-warning/35',
                          o.status === 'delayed' && 'bg-destructive/10 text-destructive border-destructive/35',
                        )}
                        variant="outline"
                      >
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="text-xs font-semibold py-1.5 px-3" onClick={() => analyzeFulfillment(o)}>
                        Analyze Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No customer orders found matching filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">
                Showing {Math.min(processedOrders.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
                {Math.min(processedOrders.length, currentPage * itemsPerPage)} of{' '}
                {processedOrders.length} items
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="rounded-xl border border-border overflow-hidden bg-card/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Industry Segment</TableHead>
                <TableHead>Geographic Location</TableHead>
                <TableHead className="text-right">Lifetime Spend</TableHead>
                <TableHead className="text-right">Open Sales Orders</TableHead>
                <TableHead className="text-center">Account Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-bold">{c.name}</TableCell>
                  <TableCell>{c.segment}</TableCell>
                  <TableCell>{c.location}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(c.lifetimeValue)}</TableCell>
                  <TableCell className="text-right font-mono">{c.openOrders}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        'capitalize font-semibold',
                        c.status === 'active' && 'bg-success/10 text-success border-success/35',
                        c.status === 'new' && 'bg-primary/10 text-primary border-primary/35',
                        c.status === 'at-risk' && 'bg-destructive/10 text-destructive border-destructive/35',
                      )}
                      variant="outline"
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {activeTab === 'fulfillment' && (
        <div className="space-y-6">
          <SmartOrderIntelligence />

          <div className="border-t border-border pt-8 mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-display">Historical Customer Orders Diagnostic Trace</h3>
                <p className="text-xs text-muted-foreground">Select an active sales order from your ledger to inspect its live supply chain trace.</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedOrderForAnalysis?.id || ''}
                  onChange={(e) => {
                    const target = orders.find((o) => o.id === e.target.value)
                    setSelectedOrderForAnalysis(target || null)
                  }}
                  className="bg-background border border-border rounded-lg text-xs px-3 py-1.5 focus:border-primary outline-none font-mono"
                >
                  <option value="">-- Inspect Specific Customer Order --</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.reference} &bull; {o.customer} ({o.product})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedOrderForAnalysis && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
                {/* Simulator Flow visualization */}
                <div className="rounded-2xl border border-border bg-card/40 p-6 lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Historical Order Diagnostics</h4>
                    <Badge variant="outline" className="font-mono text-xs">
                      {selectedOrderForAnalysis.reference} &bull; {selectedOrderForAnalysis.customer}
                    </Badge>
                  </div>

                  <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border text-xs">
                    <div className="relative">
                      <div className="absolute -left-6 mt-1 flex size-5 items-center justify-center rounded-full bg-success text-success-foreground text-[10px] font-bold">✓</div>
                      <div>
                        <h5 className="font-semibold text-sm">Finished Stock Allocation Status</h5>
                        <p className="text-muted-foreground mt-0.5">Database check on {selectedOrderForAnalysis.product} across Dallas DC & Reno DC.</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-6 mt-1 flex size-5 items-center justify-center rounded-full bg-success text-success-foreground text-[10px] font-bold">✓</div>
                      <div>
                        <h5 className="font-semibold text-sm">BOM Component Allocation</h5>
                        <p className="text-muted-foreground mt-0.5">Assembly requirements matched against current warehouse bins.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">Order Summary</h4>
                    <p className="text-sm font-semibold">{selectedOrderForAnalysis.product}</p>
                    <p className="text-xl font-bold font-display mt-1 text-primary">{formatCurrency(selectedOrderForAnalysis.amount)}</p>
                    <p className="text-xs text-muted-foreground mt-2">Status: <span className="capitalize font-semibold text-foreground">{selectedOrderForAnalysis.status}</span></p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSelectedOrderForAnalysis(null)}>
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
