'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Search,
  Plus,
  ArrowUpDown,
  Download,
  AlertTriangle,
  Factory,
  Layers,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Cpu,
  Workflow,
  Wrench,
} from 'lucide-react'
import { mockApi } from '@/lib/services/api'
import { ProductionOrder, ProductionStage } from '@/lib/mock/data'
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
import { toast } from 'sonner'

export default function ProductionPage() {
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & State
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'orders' | 'bom' | 'capacity'>('orders')

  // Selected order details for BOM view
  const [selectedBomProduct, setSelectedBomProduct] = useState<string>('p1')

  useEffect(() => {
    async function loadProductionData() {
      try {
        const prodData = await mockApi.getProductionOrders()
        setProductionOrders(prodData)
      } catch (err) {
        toast.error('Failed to load production data.')
      } finally {
        setLoading(false)
      }
    }
    loadProductionData()
  }, [])

  // Filtered & Sorted orders
  const processedOrders = useMemo(() => {
    let result = [...productionOrders]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.reference.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q) ||
          o.plant.toLowerCase().includes(q),
      )
    }

    // Stage
    if (stageFilter !== 'All') {
      result = result.filter((o) => o.stage === stageFilter.toLowerCase())
    }

    return result
  }, [productionOrders, search, stageFilter])

  // Move stage (Simulated action)
  const handlePromoteStage = (id: string, currentStage: ProductionStage) => {
    const stagesOrder: ProductionStage[] = ['planned', 'material-ready', 'production', 'quality', 'completed']
    const currentIndex = stagesOrder.indexOf(currentStage)
    if (currentIndex === -1 || currentIndex === stagesOrder.length - 1) return

    const nextStage = stagesOrder[currentIndex + 1]
    const nextProgress = nextStage === 'completed' ? 100 : nextStage === 'quality' ? 90 : nextStage === 'production' ? 50 : 20

    setProductionOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, stage: nextStage, progress: nextProgress } : o)),
    )
    toast.success(`Production order updated to stage: ${nextStage.toUpperCase()}`)
  }

  const boms = {
    p1: {
      name: 'Water Pump Motor 4200',
      sku: 'WPM-4200',
      materials: [
        { name: 'Copper Wire 6mm', qty: '40 meters', avail: true },
        { name: 'Steel Sheet A36', qty: '2 sheets', avail: true },
        { name: 'Precision Bearing 32', qty: '2 units', avail: false },
      ]
    },
    p2: {
      name: 'Motor Controller 880',
      sku: 'MCT-880',
      materials: [
        { name: 'Controller Components Kit', qty: '1 kit', avail: true },
        { name: 'Copper Wire 6mm', qty: '5 meters', avail: true }
      ]
    },
    p3: {
      name: 'Industrial Pump X1500',
      sku: 'IPX-1500',
      materials: [
        { name: 'Water Pump Motor 4200', qty: '1 unit', avail: true },
        { name: 'Steel Sheet A36', qty: '4 sheets', avail: false },
        { name: 'Precision Bearing 32', qty: '4 units', avail: false }
      ]
    }
  }

  const stats = useMemo(() => {
    const activeCount = productionOrders.filter((o) => o.stage === 'production').length
    const capacityLoad = 82 // Plant workload %
    const totalQty = productionOrders.reduce((sum, o) => sum + o.qty, 0)
    return { activeCount, capacityLoad, totalQty }
  }, [productionOrders])

  const stages: { value: ProductionStage; label: string }[] = [
    { value: 'planned', label: 'Planned' },
    { value: 'material-ready', label: 'Material Ready' },
    { value: 'production', label: 'Production' },
    { value: 'quality', label: 'Quality' },
    { value: 'completed', label: 'Completed' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Production Data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Production Scheduling</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor shop floor capacity, schedule assembly orders, and manage Bill of Materials (BOM).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" /> Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" /> Create MO
          </Button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Active Batch Assembly</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display">{stats.activeCount} Runs</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <Factory className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Production Volume scheduled</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display">{stats.totalQty.toLocaleString()} Units</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <Layers className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Shop floor workload</p>
            <div className="flex items-center gap-3 mt-1.5">
              <h3 className="text-2xl font-bold font-display">{stats.capacityLoad}% Capacity</h3>
            </div>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <Cpu className="size-5" />
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
          Manufacturing Orders
        </button>
        <button
          onClick={() => setActiveTab('bom')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'bom'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Bill of Materials (BOM)
        </button>
        <button
          onClick={() => setActiveTab('capacity')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'capacity'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Plant Workload Capacity
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
                placeholder="Search MOs by SKU, name, or plant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Workflow Stage:</span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-background border border-border rounded-lg text-xs px-2.5 py-1.5 focus:border-primary outline-none"
              >
                <option value="All">All Stages</option>
                <option value="Planned">Planned</option>
                <option value="Material-Ready">Material Ready</option>
                <option value="Production">Production</option>
                <option value="Quality">Quality</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MO Reference</TableHead>
                  <TableHead>Target Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Operational Plant</TableHead>
                  <TableHead className="text-center">Active Stage Progression</TableHead>
                  <TableHead className="text-center">Due Date</TableHead>
                  <TableHead className="text-center">Batch Status</TableHead>
                  <TableHead className="w-48 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedOrders.map((o) => (
                  <TableRow key={o.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-bold">{o.reference}</TableCell>
                    <TableCell className="font-semibold">{o.product}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{o.qty}</TableCell>
                    <TableCell>{o.plant}</TableCell>
                    <TableCell>
                      {/* Timeline stage indicator */}
                      <div className="flex items-center justify-center gap-1.5 max-w-[280px] mx-auto">
                        {stages.map((st) => {
                          const stagesOrder: ProductionStage[] = ['planned', 'material-ready', 'production', 'quality', 'completed']
                          const idx = stagesOrder.indexOf(o.stage)
                          const stIdx = stagesOrder.indexOf(st.value)
                          const isDone = stIdx <= idx
                          const isCurrent = stIdx === idx

                          return (
                            <div key={st.value} className="flex flex-col items-center flex-1">
                              <div className={cn(
                                'h-2 w-full rounded-sm transition-all',
                                isCurrent ? 'bg-primary' : isDone ? 'bg-success' : 'bg-muted'
                              )} title={st.label} />
                            </div>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">{o.due}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'capitalize font-semibold',
                          o.stage === 'completed' && 'bg-success/10 text-success border-success/35',
                          o.stage === 'quality' && 'bg-accent/10 text-accent border-accent/35',
                          o.stage === 'production' && 'bg-primary/10 text-primary border-primary/35',
                          o.stage === 'material-ready' && 'bg-primary/10 text-primary border-primary/35',
                          o.stage === 'planned' && 'bg-muted text-muted-foreground border-border',
                        )}
                        variant="outline"
                      >
                        {o.stage === 'material-ready' ? 'Material Ready' : o.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {o.stage !== 'completed' ? (
                        <Button size="sm" variant="outline" className="text-xs font-semibold py-1.5 px-3" onClick={() => handlePromoteStage(o.id, o.stage)}>
                          Next Stage →
                        </Button>
                      ) : (
                        <div className="flex items-center justify-end text-success text-xs font-semibold gap-1 py-1.5">
                          <CheckCircle2 className="size-4" /> Ready
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {processedOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No production orders found matching filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === 'bom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products selector list */}
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <h3 className="text-base font-bold font-display mb-4">Choose Finished Product</h3>
            <div className="space-y-2">
              {Object.entries(boms).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setSelectedBomProduct(key)}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border transition-colors flex items-center justify-between',
                    selectedBomProduct === key
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40 hover:bg-muted/30'
                  )}
                >
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{item.sku}</p>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">
                    {item.materials.length} Materials
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* BOM Materials detail list */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-primary border-b border-border pb-3">
              <Workflow className="size-5" />
              <h3 className="font-bold font-display text-lg">BOM Requirements Matrix</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Standard assembly materials list needed to manufacture 1 unit of <span className="font-semibold text-foreground">{boms[selectedBomProduct as keyof typeof boms].name}</span>.
            </p>

            <div className="space-y-3 mt-6">
              {boms[selectedBomProduct as keyof typeof boms].materials.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-background/30">
                  <div>
                    <p className="font-semibold text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Ratio: {m.qty} / unit</p>
                  </div>
                  <div>
                    <Badge variant={m.avail ? 'success' : 'destructive'} className={cn(
                      'font-semibold',
                      m.avail ? 'bg-success/10 text-success border-success/35' : 'bg-destructive/10 text-destructive border-destructive/35'
                    )}>
                      {m.avail ? 'In Stock (Allocated)' : 'Material Shortage'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'capacity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { name: 'Plant A (Dallas Assembly)', workload: 85, output: '1,420 units/mo', scrap: '1.2%', status: 'active' },
            { name: 'Plant B (Reno Pumps)', workload: 54, output: '680 units/mo', scrap: '0.8%', status: 'active' }
          ].map((plant, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold font-display">{plant.name}</h3>
                  <Badge className="bg-success/10 text-success border-success/35">Running</Badge>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground font-medium">Machine Workload Capacity</span>
                      <span className="font-semibold">{plant.workload}% Active Load</span>
                    </div>
                    <Progress value={plant.workload} className="h-2" />
                  </div>

                  <div className="flex justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Scrap Rate</p>
                      <p className="text-sm font-semibold mt-0.5 text-warning">{plant.scrap}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Target Output</p>
                      <p className="text-sm font-semibold mt-0.5">{plant.output}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
