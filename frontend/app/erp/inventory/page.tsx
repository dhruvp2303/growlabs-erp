'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Search,
  SlidersHorizontal,
  Plus,
  ArrowUpDown,
  Download,
  AlertTriangle,
  Layers,
  TrendingDown,
  Warehouse as WarehouseIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  Settings,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'
import { mockApi } from '@/lib/services/api'
import { Product, Warehouse } from '@/lib/mock/data'
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { WarehouseMap } from '@/components/erp/warehouse-map'
import { toast } from 'sonner'

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [stockTrend, setStockTrend] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & State
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [warehouseFilter, setWarehouseFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'catalog' | 'warehouses' | 'map' | 'movements' | 'insights'>('catalog')

  // Sorting
  const [sortField, setSortField] = useState<keyof Product>('sku')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Selected Rows (Bulk actions)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])

  // Details Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    async function loadInventory() {
      try {
        const prodData = await mockApi.getInventory()
        const whData = await mockApi.getWarehouses()
        const trendData = await mockApi.getStockValueTrend()
        setProducts(prodData)
        setWarehouses(whData)
        setStockTrend(trendData)
      } catch (err) {
        toast.error('Failed to load inventory data.')
      } finally {
        setLoading(false)
      }
    }
    loadInventory()
  }, [])

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map((p) => p.category)))]
  }, [products])

  const warehouseNames = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map((p) => p.warehouse)))]
  }, [products])

  // Sorting Handler
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filtered & Sorted Products
  const processedProducts = useMemo(() => {
    let result = [...products]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }

    // Category
    if (categoryFilter !== 'All') {
      result = result.filter((p) => p.category === categoryFilter)
    }

    // Warehouse
    if (warehouseFilter !== 'All') {
      result = result.filter((p) => p.warehouse === warehouseFilter)
    }

    // Status
    if (statusFilter !== 'All') {
      result = result.filter((p) => p.status === statusFilter.toLowerCase())
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
  }, [products, search, categoryFilter, warehouseFilter, statusFilter, sortField, sortDirection])

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return processedProducts.slice(start, start + itemsPerPage)
  }, [processedProducts, currentPage])

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage)

  // Stats
  const stats = useMemo(() => {
    const totalItems = products.reduce((acc, p) => acc + p.onHand, 0)
    const totalVal = products.reduce((acc, p) => acc + p.onHand * p.cost, 0)
    const lowStockCount = products.filter((p) => p.status === 'low' || p.status === 'critical').length
    const slowMoving = products.filter((p) => p.turnover < 4.0).length

    return { totalItems, totalVal, lowStockCount, slowMoving }
  }, [products])

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e']

  // Row selection toggle
  const toggleSelectRow = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const toggleSelectAll = () => {
    if (selectedProductIds.length === paginatedProducts.length) {
      setSelectedProductIds([])
    } else {
      setSelectedProductIds(paginatedProducts.map((p) => p.id))
    }
  }

  const handleBulkReorder = () => {
    if (selectedProductIds.length === 0) return
    toast.success(`Purchase requisitions drafted for ${selectedProductIds.length} items.`)
    setSelectedProductIds([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Inventory Data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Inventory</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your physical assets, warehouses, and reorder points.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" /> Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" /> Add Item
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total On-Hand Items</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display">{stats.totalItems.toLocaleString()}</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <Layers className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Stock Valuation (Cost)</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display">{formatCurrency(stats.totalVal)}</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <WarehouseIcon className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-destructive/15 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-destructive font-semibold uppercase tracking-wider">Low/Critical Stock</p>
            <h3 className="text-2xl font-bold mt-1.5 text-destructive font-display">{stats.lowStockCount} Items</h3>
          </div>
          <div className="rounded-xl bg-destructive/10 text-destructive p-3">
            <AlertTriangle className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-warning/15 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-warning font-semibold uppercase tracking-wider">Slow-Moving Inventory</p>
            <h3 className="text-2xl font-bold mt-1.5 text-warning font-display">{stats.slowMoving} Items</h3>
          </div>
          <div className="rounded-xl bg-warning/10 text-warning p-3">
            <TrendingDown className="size-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('catalog')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'catalog'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Stock Catalog
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'warehouses'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Warehouses
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'map'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          3D Interactive Floor Map
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'movements'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Stock Movements Log
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'insights'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          AI Inventory Insights
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-card/10 p-4 rounded-xl border border-border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products by SKU, name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full bg-background border border-border pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="bg-background border border-border rounded-lg text-xs px-2.5 py-1.5 focus:border-primary outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Warehouse:</span>
                <select
                  value={warehouseFilter}
                  onChange={(e) => {
                    setWarehouseFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="bg-background border border-border rounded-lg text-xs px-2.5 py-1.5 focus:border-primary outline-none"
                >
                  {warehouseNames.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="bg-background border border-border rounded-lg text-xs px-2.5 py-1.5 focus:border-primary outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Low">Low</option>
                  <option value="Critical">Critical</option>
                  <option value="Excess">Excess</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk actions panel */}
          {selectedProductIds.length > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">
                {selectedProductIds.length} items selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkReorder}>
                  Draft Procurement
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedProductIds([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-xl border border-border overflow-hidden bg-card/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        paginatedProducts.length > 0 &&
                        selectedProductIds.length === paginatedProducts.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-border size-4"
                    />
                  </TableHead>
                  <TableHead onClick={() => handleSort('sku')} className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      SKU <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('name')} className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      Name <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('category')} className="cursor-pointer hover:bg-muted/50">
                    Category
                  </TableHead>
                  <TableHead onClick={() => handleSort('type')} className="cursor-pointer hover:bg-muted/50">
                    Type
                  </TableHead>
                  <TableHead onClick={() => handleSort('cost')} className="cursor-pointer text-right hover:bg-muted/50">
                    Cost
                  </TableHead>
                  <TableHead onClick={() => handleSort('unitPrice')} className="cursor-pointer text-right hover:bg-muted/50">
                    Price
                  </TableHead>
                  <TableHead onClick={() => handleSort('onHand')} className="cursor-pointer text-right hover:bg-muted/50">
                    On Hand
                  </TableHead>
                  <TableHead onClick={() => handleSort('reserved')} className="cursor-pointer text-right hover:bg-muted/50">
                    Reserved
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead onClick={() => handleSort('turnover')} className="cursor-pointer text-center hover:bg-muted/50">
                    Turnover (x)
                  </TableHead>
                  <TableHead className="w-20 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/30">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(p.id)}
                        onChange={() => toggleSelectRow(p.id)}
                        className="rounded border-border size-4"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {p.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(p.cost)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.unitPrice)}</TableCell>
                    <TableCell className="text-right font-semibold">{p.onHand}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{p.reserved}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'capitalize font-semibold',
                          p.status === 'healthy' && 'bg-success/10 text-success border-success/35',
                          p.status === 'low' && 'bg-warning/10 text-warning border-warning/35',
                          p.status === 'critical' && 'bg-destructive/10 text-destructive border-destructive/35',
                          p.status === 'excess' && 'bg-primary/10 text-primary border-primary/35',
                        )}
                        variant="outline"
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">{p.turnover}x</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="p-1 text-muted-foreground hover:text-primary transition-colors"
                        title="View details"
                      >
                        <Eye className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      No products found matching filters.
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
                Showing {Math.min(processedProducts.length, (currentPage - 1) * itemsPerPage + 1)} to{' '}
                {Math.min(processedProducts.length, currentPage * itemsPerPage)} of{' '}
                {processedProducts.length} items
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

      {activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warehouses.map((w) => (
            <div key={w.id} className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display">{w.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{w.location}</p>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {w.items} Active SKUs
                  </Badge>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground font-medium">Warehouse Capacity</span>
                      <span className="font-semibold">{w.capacityUsed}% Used</span>
                    </div>
                    <Progress value={w.capacityUsed} className="h-2" />
                  </div>

                  <div className="flex justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Inventory Value</p>
                      <p className="text-lg font-bold font-display mt-0.5">{formatCurrency(w.value)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Fill Status</p>
                      <Badge className="mt-1" variant={w.capacityUsed > 75 ? 'destructive' : 'default'}>
                        {w.capacityUsed > 75 ? 'High Density' : 'Optimal'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'map' && (
        <WarehouseMap />
      )}

      {activeTab === 'movements' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <h3 className="text-lg font-bold font-display mb-4">Stock Reservations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Current stock allocations to active production orders (MO) or sales orders (SO).
            </p>
            <div className="rounded-xl border border-border overflow-hidden bg-background/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">On Hand</TableHead>
                    <TableHead className="text-right">Reserved Qty</TableHead>
                    <TableHead className="text-right">Available Qty</TableHead>
                    <TableHead>Allocation Target</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.filter(p => p.reserved > 0).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-semibold">{p.name}</TableCell>
                      <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                      <TableCell className="text-right font-mono">{p.onHand}</TableCell>
                      <TableCell className="text-right text-primary font-mono font-bold">{p.reserved}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{p.onHand - p.reserved}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.sku.startsWith('WP') ? 'SO-10482 (Fulfillment)' : 'MO-2203 (BOM Allocation)'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <h3 className="text-lg font-bold font-display mb-4">Inbound & Outbound Movements Log</h3>
            <div className="space-y-3">
              {[
                { type: 'inbound', ref: 'PO-3388', item: 'Controller Components Kit', qty: 1000, date: '2026-08-30', user: 'Marcus Lee' },
                { type: 'outbound', ref: 'SO-10478', item: 'Water Pump Motor 4200', qty: 200, date: '2026-08-28', user: 'Marcus Lee' },
                { type: 'outbound', ref: 'MO-2205', item: 'Steel Sheet A36', qty: 120, date: '2026-08-28', user: 'Dana Whitfield' },
                { type: 'inbound', ref: 'MO-2205', item: 'Water Pump Motor 4200', qty: 150, date: '2026-08-28', user: 'Dana Whitfield' }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/30">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-xs font-semibold px-2 py-1 rounded',
                      log.type === 'inbound' ? 'bg-success/15 text-success' : 'bg-primary/15 text-primary'
                    )}>
                      {log.type === 'inbound' ? 'Inbound' : 'Outbound'}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{log.item}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Ref: {log.ref} • Checked by {log.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold font-mono">{log.type === 'inbound' ? '+' : '-'}{log.qty}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Valuation */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 lg:col-span-2">
            <h3 className="text-lg font-bold font-display mb-4">Valuation History</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} />
                  <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '11px' }} tickFormatter={(val: any) => `$${(val / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                    formatter={(val: any) => [`$${(val / 1000).toFixed(0)}k`, 'Valuation']}
                  />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Aging details / Stock composition */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between">
            <h3 className="text-lg font-bold font-display mb-4">Stock Composition</h3>
            <div className="h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Finished Motors', value: 340 * 288 },
                      { name: 'Finished Pumps', value: 76 * 600 },
                      { name: 'Raw Material', value: 8840 * 10 },
                      { name: 'Components', value: 1660 * 35 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {[1, 2, 3, 4].map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(0)}k`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-4">
              {[
                { name: 'Motors', val: '43%', color: 'bg-[#6366f1]' },
                { name: 'Pumps', val: '21%', color: 'bg-[#a855f7]' },
                { name: 'Raw Materials', val: '26%', color: 'bg-[#ec4899]' },
                { name: 'Components', val: '10%', color: 'bg-[#f43f5e]' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn('size-2 rounded-full', item.color)} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Details Sheet */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-md h-full bg-card border-l border-border p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div>
                  <Badge variant="outline" className="font-mono text-xs mb-1">
                    {selectedProduct.sku}
                  </Badge>
                  <h2 className="text-xl font-bold font-display">{selectedProduct.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Department / Category</p>
                  <p className="text-sm font-semibold mt-0.5">{selectedProduct.category}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Unit Cost</p>
                    <p className="text-sm font-semibold mt-0.5">{formatCurrency(selectedProduct.cost)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Unit Price</p>
                    <p className="text-sm font-semibold mt-0.5">{formatCurrency(selectedProduct.unitPrice)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total On Hand</p>
                    <p className="text-sm font-bold mt-0.5 text-foreground">{selectedProduct.onHand} units</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Reserved (Allocated)</p>
                    <p className="text-sm font-semibold mt-0.5 text-primary">{selectedProduct.reserved} units</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground font-medium">Reorder Safety Margin</span>
                    <span className="font-semibold">{selectedProduct.onHand} / {selectedProduct.reorderPoint} Point</span>
                  </div>
                  <Progress
                    value={Math.min(100, (selectedProduct.onHand / (selectedProduct.reorderPoint || 1)) * 100)}
                    className={cn(
                      'h-2',
                      selectedProduct.onHand <= selectedProduct.reorderPoint && 'bg-destructive/20'
                    )}
                  />
                  <p className="text-[10px] text-muted-foreground mt-2">
                    * Reorder points are calculated dynamically by AI using current lead times (8-15 days).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Warehouse Storage</p>
                    <p className="text-sm font-semibold mt-0.5">{selectedProduct.warehouse}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Inventory Turnover</p>
                    <p className="text-sm font-semibold mt-0.5">{selectedProduct.turnover}x per year</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-8 flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  toast.success(`Purchase order drafted for ${selectedProduct.sku}`)
                  setSelectedProduct(null)
                }}
              >
                Reorder Item
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedProduct(null)}
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
