'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Search,
  Plus,
  ArrowUpDown,
  Download,
  Truck,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  MapPin,
  Clock,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react'
import { mockApi } from '@/lib/services/api'
import { Shipment } from '@/lib/mock/data'
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

export default function LogisticsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'shipments' | 'tracker'>('shipments')

  // Selected shipment for tracker tab
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  useEffect(() => {
    async function loadLogisticsData() {
      try {
        const shipData = await mockApi.getShipments()
        setShipments(shipData)
      } catch (err) {
        toast.error('Failed to load logistics data.')
      } finally {
        setLoading(false)
      }
    }
    loadLogisticsData()
  }, [])

  // Filtered shipments
  const processedShipments = useMemo(() => {
    let result = [...shipments]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.reference.toLowerCase().includes(q) ||
          s.customer.toLowerCase().includes(q) ||
          s.carrier.toLowerCase().includes(q),
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter((s) => s.status === statusFilter.toLowerCase())
    }

    return result
  }, [shipments, search, statusFilter])

  const stats = useMemo(() => {
    const transitCount = shipments.filter((s) => s.status === 'in-transit').length
    const deliveredCount = shipments.filter((s) => s.status === 'delivered').length
    const criticalReturns = shipments.filter((s) => s.status === 'returned').length
    return { transitCount, deliveredCount, criticalReturns }
  }, [shipments])

  const openTracker = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setActiveTab('tracker')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Logistics Data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Logistics & Shipments</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Dispatch freight orders, choose carriers, and track shipment milestones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" /> Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" /> Dispatch Shipment
          </Button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Freight In Transit</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display">{stats.transitCount} Cargoes</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <Truck className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Delivered (Completed)</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display text-success">{stats.deliveredCount} Shipments</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-destructive/15 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-destructive font-semibold uppercase tracking-wider">Active Return Logistics</p>
            <h3 className="text-2xl font-bold mt-1.5 text-destructive font-display">{stats.criticalReturns} Returned</h3>
          </div>
          <div className="rounded-xl bg-destructive/10 text-destructive p-3">
            <AlertTriangle className="size-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('shipments')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'shipments'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Active Shipments
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'tracker'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Shipment Timeline Tracker {selectedShipment && `(${selectedShipment.reference})`}
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'shipments' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-card/10 p-4 rounded-xl border border-border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search shipments by reference, customer or carrier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border pl-10 pr-4 py-2 rounded-lg text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Transit Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-background border border-border rounded-lg text-xs px-2.5 py-1.5 focus:border-primary outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Preparing">Preparing</option>
                <option value="In-Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment Ref</TableHead>
                  <TableHead>Recipient Customer</TableHead>
                  <TableHead>Logistics Carrier</TableHead>
                  <TableHead>Origin Hub</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead className="text-center">Transit Progress</TableHead>
                  <TableHead className="text-center">ETA</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-20 text-right">Tracker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedShipments.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-bold">{s.reference}</TableCell>
                    <TableCell className="font-semibold">{s.customer}</TableCell>
                    <TableCell>{s.carrier}</TableCell>
                    <TableCell className="font-mono text-xs">{s.origin}</TableCell>
                    <TableCell>{s.destination}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2 max-w-[120px] mx-auto">
                        <Progress value={s.progress} className="h-1.5 flex-1" />
                        <span className="text-xs font-mono font-semibold">{s.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">{s.eta}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'capitalize font-semibold',
                          s.status === 'delivered' && 'bg-success/10 text-success border-success/35',
                          s.status === 'in-transit' && 'bg-primary/10 text-primary border-primary/35',
                          s.status === 'preparing' && 'bg-warning/10 text-warning border-warning/35',
                          s.status === 'returned' && 'bg-destructive/10 text-destructive border-destructive/35',
                        )}
                        variant="outline"
                      >
                        {s.status === 'in-transit' ? 'In Transit' : s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="text-xs font-semibold py-1 px-3" onClick={() => openTracker(s)}>
                        Track
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {processedShipments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No shipments found matching filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === 'tracker' && (
        <div>
          {selectedShipment ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tracker timeline progress list */}
              <div className="rounded-2xl border border-border bg-card/40 p-6 lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Carrier Route Tracking Logs</h4>
                  <Badge variant="outline" className="font-mono text-xs">
                    Carrier: {selectedShipment.carrier}
                  </Badge>
                </div>

                <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {[
                    { title: 'Delivered', desc: `Parcel received at destination: ${selectedShipment.destination}`, date: selectedShipment.eta, complete: selectedShipment.progress === 100 },
                    { title: 'Customs / Hub Sorting', desc: 'Arrived at regional delivery hub terminal sorting belt.', date: '2026-08-25', complete: selectedShipment.progress >= 70 },
                    { title: 'In Transit', desc: 'Freight cargo dispatched. Rolling on highway logistics lanes.', date: '2026-08-24', complete: selectedShipment.progress >= 50 },
                    { title: 'Order Dispatched (Dallas DC)', desc: `Cargo picked and verified at ${selectedShipment.origin}. Loaded to freight carrier container.`, date: '2026-08-22', complete: true }
                  ].map((milestone, idx) => (
                    <div key={idx} className="relative">
                      <div className={cn(
                        'absolute -left-6 mt-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold',
                        milestone.complete ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                      )}>
                        {milestone.complete ? '✓' : '○'}
                      </div>
                      <div>
                        <h5 className={cn('font-semibold text-sm', milestone.complete ? 'text-foreground' : 'text-muted-foreground')}>{milestone.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">{milestone.desc}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1">{milestone.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracker statistics card */}
              <div className="rounded-2xl border border-border bg-card/40 p-6 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Shipment Details</h4>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Customer</p>
                      <p className="text-sm font-semibold mt-0.5">{selectedShipment.customer}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Tracking ID</p>
                      <p className="text-sm font-mono mt-0.5 text-foreground">{selectedShipment.reference}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Origin</p>
                        <p className="text-xs font-semibold mt-0.5">{selectedShipment.origin}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Destination</p>
                        <p className="text-xs font-semibold mt-0.5">{selectedShipment.destination}</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Estimated Delivery</p>
                      <p className="text-sm font-semibold mt-0.5 flex items-center gap-1.5">
                        <Clock className="size-4 text-primary" /> {selectedShipment.eta}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-6">
                  <Button variant="outline" className="w-full" onClick={() => setSelectedShipment(null)}>
                    Clear Tracking View
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border border-border border-dashed rounded-xl text-muted-foreground bg-card/10">
              <HelpCircle className="size-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm">Select a shipment from the Active Shipments table above to track route transit status.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
