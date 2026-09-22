'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Search,
  Plus,
  ArrowUpDown,
  Download,
  AlertTriangle,
  ClipboardCheck,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { mockApi } from '@/lib/services/api'
import { Supplier, PurchaseOrder } from '@/lib/mock/data'
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

export default function ProcurementPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'pos' | 'suppliers' | 'planning'>('pos')

  // Sorting
  const [sortField, setSortField] = useState<keyof PurchaseOrder>('reference')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    async function loadProcurementData() {
      try {
        const supData = await mockApi.getSuppliers()
        const poData = await mockApi.getPurchaseOrders()
        setSuppliers(supData)
        setPurchaseOrders(poData)
      } catch (err) {
        toast.error('Failed to load procurement data.')
      } finally {
        setLoading(false)
      }
    }
    loadProcurementData()
  }, [])

  // Sorting Handler
  const handleSort = (field: keyof PurchaseOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filtered & Sorted POs
  const processedPOs = useMemo(() => {
    let result = [...purchaseOrders]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (po) =>
          po.reference.toLowerCase().includes(q) ||
          po.supplier.toLowerCase().includes(q) ||
          po.item.toLowerCase().includes(q),
      )
    }

    // Status
    if (statusFilter !== 'All') {
      result = result.filter((po) => po.status === statusFilter.toLowerCase())
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
  }, [purchaseOrders, search, statusFilter, sortField, sortDirection])

  // Paginated POs
  const paginatedPOs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return processedPOs.slice(start, start + itemsPerPage)
  }, [processedPOs, currentPage])

  const totalPages = Math.ceil(processedPOs.length / itemsPerPage)

  const handleApprovePO = (id: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: 'ordered' } : po)),
    )
    toast.success('Purchase order approved and transmitted to supplier.')
  }

  const handleRejectPO = (id: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: 'draft' } : po)),
    )
    toast.error('Purchase order returned to draft.')
  }

  const stats = useMemo(() => {
    const pendingCount = purchaseOrders.filter((po) => po.status === 'pending-approval').length
    const totalSpend = suppliers.reduce((sum, s) => sum + s.spend, 0)
    const criticalSuppliers = suppliers.filter((s) => s.onTimeRate < 80).length
    return { pendingCount, totalSpend, criticalSuppliers }
  }, [purchaseOrders, suppliers])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Procurement Data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Procurement</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage suppliers, issue purchase orders, and monitor raw material stock levels.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" /> Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" /> Create PO
          </Button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Annual Spend</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display">{formatCurrency(stats.totalSpend)}</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <TrendingUp className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Awaiting PO Approval</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display text-primary">{stats.pendingCount} POs</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <ClipboardCheck className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-destructive/15 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-destructive font-semibold uppercase tracking-wider">At-Risk Suppliers</p>
            <h3 className="text-2xl font-bold mt-1.5 text-destructive font-display">{stats.criticalSuppliers} Critical</h3>
          </div>
          <div className="rounded-xl bg-destructive/10 text-destructive p-3">
            <AlertTriangle className="size-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('pos')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'pos'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Purchase Orders
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'suppliers'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Suppliers Directory
        </button>
        <button
          onClick={() => setActiveTab('planning')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'planning'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Material Planning & AI
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'pos' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-card/10 p-4 rounded-xl border border-border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search POs by reference, supplier or item..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full bg-background border border-border pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">PO Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-background border border-border rounded-lg text-xs px-2.5 py-1.5 focus:border-primary outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Pending-Approval">Pending Approval</option>
                <option value="Ordered">Ordered</option>
                <option value="Received">Received</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('reference')} className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      PO Reference <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('supplier')} className="cursor-pointer hover:bg-muted/50">
                    Supplier
                  </TableHead>
                  <TableHead>Purchased Material</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">PO Total</TableHead>
                  <TableHead className="text-center">ETA</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-52 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPOs.map((po) => (
                  <TableRow key={po.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-bold">{po.reference}</TableCell>
                    <TableCell className="font-semibold">{po.supplier}</TableCell>
                    <TableCell>{po.item}</TableCell>
                    <TableCell className="text-right font-mono">{po.qty.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(po.amount)}</TableCell>
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">{po.eta}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'capitalize font-semibold',
                          po.status === 'received' && 'bg-success/10 text-success border-success/35',
                          po.status === 'ordered' && 'bg-primary/10 text-primary border-primary/35',
                          po.status === 'pending-approval' && 'bg-warning/10 text-warning border-warning/35',
                          po.status === 'draft' && 'bg-muted text-muted-foreground border-border',
                        )}
                        variant="outline"
                      >
                        {po.status === 'pending-approval' ? 'Pending Approval' : po.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {po.status === 'pending-approval' ? (
                        <div className="flex justify-end gap-1.5">
                          <Button size="sm" className="bg-success text-success-foreground text-xs py-1.5 px-3" onClick={() => handleApprovePO(po.id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10 text-xs py-1.5 px-3" onClick={() => handleRejectPO(po.id)}>
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-xs text-muted-foreground" disabled>
                          Transmitted
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedPOs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No purchase orders found matching filters.
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
                Showing {Math.min(processedPOs.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
                {Math.min(processedPOs.length, currentPage * itemsPerPage)} of{' '}
                {processedPOs.length} items
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

      {activeTab === 'suppliers' && (
        <div className="rounded-xl border border-border overflow-hidden bg-card/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Material Category</TableHead>
                <TableHead className="text-center">On-Time delivery (%)</TableHead>
                <TableHead className="text-center">Lead Time (Days)</TableHead>
                <TableHead className="text-center">Quality Score (%)</TableHead>
                <TableHead className="text-right">Spend (YTD)</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-bold">{s.name}</TableCell>
                  <TableCell>{s.category}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 max-w-[80px] mx-auto">
                      <span className={cn('text-xs font-semibold', s.onTimeRate < 80 ? 'text-destructive' : 'text-foreground')}>{s.onTimeRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono">{s.leadTime} Days</TableCell>
                  <TableCell className="text-center font-semibold text-success">{s.qualityScore}%</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(s.spend)}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        'capitalize font-semibold',
                        s.status === 'preferred' && 'bg-success/10 text-success border-success/35',
                        s.status === 'approved' && 'bg-primary/10 text-primary border-primary/35',
                        s.status === 'review' && 'bg-destructive/10 text-destructive border-destructive/35',
                      )}
                      variant="outline"
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {activeTab === 'planning' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Recommendation card */}
          <div className="rounded-2xl border border-primary/25 bg-primary/[0.06] p-6 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="size-5" />
                <h3 className="font-bold font-display text-lg">AI Material Shortage Alert</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                GrowLabs AI business brain has analyzed your current inventory usage, outstanding orders, and supplier lead times.
              </p>

              <div className="space-y-4 mt-6">
                {[
                  { name: 'Precision Bearing 32', current: 210, required: 380, supplier: 'Precision Bearings Intl. (Review status)', status: 'critical' },
                  { name: 'Steel Sheet A36', current: 640, required: 700, supplier: 'Titan Steel Supply (Approved status)', status: 'warning' },
                  { name: 'Copper Wire 6mm', current: 8200, required: 4000, supplier: 'Apex Copper & Alloys (Preferred status)', status: 'healthy' }
                ].map((item, i) => (
                  <div key={i} className={cn(
                    'p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
                    item.status === 'critical' ? 'border-destructive/20 bg-destructive/5' : item.status === 'warning' ? 'border-warning/20 bg-warning/5' : 'border-border/50 bg-background/20'
                  )}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{item.name}</span>
                        {item.status === 'critical' && <Badge variant="destructive">Safety Risk</Badge>}
                        {item.status === 'warning' && <Badge className="bg-warning text-black hover:bg-warning-hover">Tight stock</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Supplier: {item.supplier}</p>
                    </div>
                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Stock Ratio</p>
                        <p className="text-sm font-semibold font-mono mt-0.5">{item.current} / {item.required} units</p>
                      </div>
                      {item.status !== 'healthy' && (
                        <Button size="sm" variant="outline" className="text-xs font-semibold py-1">Auto-order</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-6 flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-medium">Recommending 2 active procurements.</span>
              <Button size="sm" className="gap-1 text-xs">
                Excute All AI Recommendations <ArrowRight className="size-3" />
              </Button>
            </div>
          </div>

          {/* Supplier lead time comparison charts or metrics */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold font-display mb-4">Supplier Lead Time Comparisons</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Average vendor delivery cycles. Review suppliers might require secondary backups.
              </p>

              <div className="space-y-4">
                {[
                  { name: 'Apex Copper', days: 8, rating: 'preferred', color: 'bg-success' },
                  { name: 'Titan Steel', days: 12, rating: 'approved', color: 'bg-primary' },
                  { name: 'Volt Electronics', days: 15, rating: 'approved', color: 'bg-primary' },
                  { name: 'Precision Bearings', days: 21, rating: 'review', color: 'bg-destructive' }
                ].map((s, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-foreground">{s.name}</span>
                      <span className="text-muted-foreground">{s.days} Days</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 bg-muted/40 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', s.color)} style={{ width: `${(s.days / 25) * 100}%` }} />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide">{s.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
