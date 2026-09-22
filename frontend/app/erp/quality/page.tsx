'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Search,
  Plus,
  ArrowUpDown,
  Download,
  AlertTriangle,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { mockApi } from '@/lib/services/api'
import { QualityInspection } from '@/lib/mock/data'
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
import { toast } from 'sonner'

export default function QualityPage() {
  const [inspections, setInspections] = useState<QualityInspection[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & State
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeTab, setActiveTab] = useState<'inspections' | 'defects' | 'actions'>('inspections')

  useEffect(() => {
    async function loadQualityData() {
      try {
        const qcData = await mockApi.getInspections()
        setInspections(qcData)
      } catch (err) {
        toast.error('Failed to load quality data.')
      } finally {
        setLoading(false)
      }
    }
    loadQualityData()
  }, [])

  // Filtered Inspections
  const processedInspections = useMemo(() => {
    let result = [...inspections]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (i) =>
          i.reference.toLowerCase().includes(q) ||
          i.product.toLowerCase().includes(q),
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter((i) => i.status === statusFilter.toLowerCase())
    }

    return result
  }, [inspections, search, statusFilter])

  const stats = useMemo(() => {
    const totalCount = inspections.length
    const averagePassRate = inspections.reduce((sum, i) => sum + i.rate, 0) / (totalCount || 1)
    const reviewRequired = inspections.filter((i) => i.status === 'review').length
    return { totalCount, averagePassRate, reviewRequired }
  }, [inspections])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Quality Data…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Quality Control</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Log quality inspections, catalog component defects, and execute corrective actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="size-4" /> Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" /> New Inspection
          </Button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Average Pass Rate</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display text-success">{stats.averagePassRate.toFixed(1)}%</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Inspections Completed</p>
            <h3 className="text-2xl font-bold mt-1.5 font-display">{stats.totalCount} Batches</h3>
          </div>
          <div className="rounded-xl bg-primary/10 text-primary p-3">
            <ClipboardCheck className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-warning/15 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-warning font-semibold uppercase tracking-wider">Batches Under Review</p>
            <h3 className="text-2xl font-bold mt-1.5 text-warning font-display">{stats.reviewRequired} Batches</h3>
          </div>
          <div className="rounded-xl bg-warning/10 text-warning p-3">
            <AlertTriangle className="size-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab('inspections')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'inspections'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          QC Inspections Log
        </button>
        <button
          onClick={() => setActiveTab('defects')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'defects'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Defects & Non-Conformance
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'actions'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          Corrective Actions Log
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'inspections' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-card/10 p-4 rounded-xl border border-border">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search inspections by product or reference..."
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
                <option value="All">All Results</option>
                <option value="Pass">Pass</option>
                <option value="Review">Review</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inspection Ref</TableHead>
                  <TableHead>Product Inspected</TableHead>
                  <TableHead className="text-right">Passed Units</TableHead>
                  <TableHead className="text-right">Failed Units</TableHead>
                  <TableHead className="text-center">Pass Rate (%)</TableHead>
                  <TableHead className="text-center">Inspection Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedInspections.map((qc) => (
                  <TableRow key={qc.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs font-bold">{qc.reference}</TableCell>
                    <TableCell className="font-semibold">{qc.product}</TableCell>
                    <TableCell className="text-right font-mono text-success">{qc.passed.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-destructive">{qc.failed.toLocaleString()}</TableCell>
                    <TableCell className="text-center font-mono font-bold">{qc.rate.toFixed(1)}%</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'capitalize font-semibold',
                          qc.status === 'pass' && 'bg-success/10 text-success border-success/35',
                          qc.status === 'review' && 'bg-warning/10 text-warning border-warning/35',
                          qc.status === 'fail' && 'bg-destructive/10 text-destructive border-destructive/35',
                        )}
                        variant="outline"
                      >
                        {qc.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {processedInspections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No inspections found matching filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === 'defects' && (
        <div className="rounded-xl border border-border overflow-hidden bg-card/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Defect ID</TableHead>
                <TableHead>Item / Component</TableHead>
                <TableHead>Description of Defect</TableHead>
                <TableHead className="text-center">Quantity Affected</TableHead>
                <TableHead className="text-center">Severity</TableHead>
                <TableHead>Reported Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { id: 'DF-0221', name: 'Precision Bearing 32', desc: 'Slight micro-crack defects detected during stress testing.', qty: 15, severity: 'high', date: '2026-08-29' },
                { id: 'DF-0220', name: 'Copper Wire 6mm', desc: 'Minor sheath insulation peeling.', qty: 80, severity: 'low', date: '2026-08-27' },
                { id: 'DF-0219', name: 'Controller Components Kit', desc: 'Capacitor component failed resistance checks.', qty: 4, severity: 'critical', date: '2026-08-25' }
              ].map((def) => (
                <TableRow key={def.id}>
                  <TableCell className="font-mono text-xs font-bold">{def.id}</TableCell>
                  <TableCell className="font-semibold">{def.name}</TableCell>
                  <TableCell className="max-w-md truncate">{def.desc}</TableCell>
                  <TableCell className="text-center font-mono">{def.qty}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn(
                      'capitalize font-semibold',
                      def.severity === 'critical' && 'bg-destructive/15 text-destructive border-destructive/35',
                      def.severity === 'high' && 'bg-warning/15 text-warning border-warning/35',
                      def.severity === 'low' && 'bg-primary/10 text-primary border-primary/35'
                    )}>
                      {def.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{def.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="space-y-4">
          {[
            { id: 'CAPA-009', desc: 'Isolate batch BRG-32 from supplier Precision Bearings and launch audit.', target: 'Precision Bearing 32', action: 'Supplier Quality Review', date: '2026-08-29', status: 'In progress' },
            { id: 'CAPA-008', desc: 'Replace faulty batch capacitors in Volt Electronics shipment PO-3388.', target: 'Controller Components Kit', action: 'Component quarantine & RMA', date: '2026-08-25', status: 'Completed' }
          ].map((act, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border/50 bg-background/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold">{act.id}</span>
                  <span className="text-sm font-semibold text-foreground">{act.action}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{act.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Item: {act.target}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <Badge variant={act.status === 'Completed' ? 'success' : 'outline'} className={cn(
                  'font-semibold',
                  act.status === 'Completed' ? 'bg-success/15 text-success' : 'border-primary/30 text-primary'
                )}>
                  {act.status}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-mono">{act.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
