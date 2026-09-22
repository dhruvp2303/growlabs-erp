'use client'

import React, { useState } from 'react'
import {
  Warehouse as WarehouseIcon,
  Box,
  Layers,
  Thermometer,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ArrowRight,
  RefreshCw,
  Cpu,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BinRack {
  id: string
  code: string
  zone: 'A' | 'B' | 'C' | 'D'
  sku: string
  name: string
  qty: number
  capacity: number
  temperature: string
  status: 'healthy' | 'low' | 'critical' | 'excess'
  agvActive?: boolean
}

const INITIAL_BINS: BinRack[] = [
  { id: 'b1', code: 'A-01', zone: 'A', sku: 'CUW-06', name: 'Copper Wire 6mm', qty: 8200, capacity: 10000, temperature: '21.4°C', status: 'healthy', agvActive: true },
  { id: 'b2', code: 'A-02', zone: 'A', sku: 'STL-A36', name: 'Steel Sheet A36', qty: 640, capacity: 1200, temperature: '20.8°C', status: 'low' },
  { id: 'b3', code: 'A-03', zone: 'A', sku: 'BRG-32', name: 'Precision Bearing 32', qty: 210, capacity: 1000, temperature: '22.1°C', status: 'critical' },
  { id: 'b4', code: 'A-04', zone: 'A', sku: 'CTC-KIT', name: 'Controller Components Kit', qty: 1450, capacity: 1500, temperature: '21.0°C', status: 'excess' },
  { id: 'b5', code: 'B-01', zone: 'B', sku: 'WPM-4200', name: 'Water Pump Motor 4200', qty: 340, capacity: 500, temperature: '19.8°C', status: 'healthy', agvActive: true },
  { id: 'b6', code: 'B-02', zone: 'B', sku: 'MCT-880', name: 'Motor Controller 880', qty: 96, capacity: 300, temperature: '20.2°C', status: 'low' },
  { id: 'b7', code: 'C-01', zone: 'C', sku: 'IPX-1500', name: 'Industrial Pump X1500', qty: 54, capacity: 80, temperature: '4.2°C', status: 'healthy' },
  { id: 'b8', code: 'C-02', zone: 'C', sku: 'IPX-900', name: 'Industrial Pump X900', qty: 22, capacity: 60, temperature: '4.0°C', status: 'critical' },
]

export function WarehouseMap() {
  const [bins, setBins] = useState<BinRack[]>(INITIAL_BINS)
  const [selectedZone, setSelectedZone] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL')
  const [selectedBin, setSelectedBin] = useState<BinRack | null>(INITIAL_BINS[0])

  const filteredBins = selectedZone === 'ALL' ? bins : bins.filter((b) => b.zone === selectedZone)

  const handleRebalance = (binCode: string) => {
    toast.success(`AGV Automated Guided Vehicle dispatched to Rack ${binCode}!`, {
      description: 'Stock redistribution and bin replenishment scheduled.',
    })
  }

  return (
    <div className="rounded-3xl border border-border bg-card/40 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
              <WarehouseIcon className="size-5 text-primary" /> Multi-Zone Interactive Warehouse Floor Map
            </h3>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
              3D IOT RACKS
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time visual telemetry of bin utilization, temperature sensors, and robotic AGV pickers.
          </p>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-1.5 bg-background/60 p-1.5 rounded-2xl border border-border">
          {(['ALL', 'A', 'B', 'C'] as const).map((z) => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-xl transition-all',
                selectedZone === z
                  ? 'bg-primary text-primary-foreground font-bold shadow'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {z === 'ALL' ? 'All Zones' : `Zone ${z}`}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column: Interactive Grid + Bin Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Floor Rack Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredBins.map((bin) => {
              const isSelected = selectedBin?.id === bin.id
              const fillPercent = Math.round((bin.qty / bin.capacity) * 100)

              return (
                <button
                  key={bin.id}
                  onClick={() => setSelectedBin(bin)}
                  className={cn(
                    'relative p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 group',
                    isSelected
                      ? 'border-primary bg-primary/15 ring-2 ring-primary shadow-lg'
                      : 'border-border bg-card/60 hover:border-primary/40 hover:bg-muted/40'
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono font-bold text-xs text-foreground group-hover:text-primary">
                      Rack {bin.code}
                    </span>
                    <Badge
                      className={cn(
                        'text-[9px] font-mono uppercase font-bold py-0.2',
                        bin.status === 'healthy' && 'bg-success/15 text-success border-success/30',
                        bin.status === 'low' && 'bg-warning/15 text-warning border-warning/30',
                        bin.status === 'critical' && 'bg-destructive/15 text-destructive border-destructive/30',
                        bin.status === 'excess' && 'bg-primary/15 text-primary border-primary/30'
                      )}
                    >
                      {bin.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="font-semibold text-xs text-foreground truncate">{bin.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{bin.sku}</p>
                  </div>

                  {/* Fill progress bar */}
                  <div className="space-y-1 w-full">
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>{bin.qty} pcs</span>
                      <span>{fillPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-background overflow-hidden border border-border">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          bin.status === 'critical' ? 'bg-destructive' : bin.status === 'low' ? 'bg-warning' : 'bg-primary'
                        )}
                        style={{ width: `${Math.min(100, fillPercent)}%` }}
                      />
                    </div>
                  </div>

                  {bin.agvActive && (
                    <div className="flex items-center gap-1 text-[9px] font-mono text-primary animate-pulse">
                      <Radio className="size-3" /> AGV Picker Routing…
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Bin Inspector Card */}
        {selectedBin && (
          <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-4 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <Badge variant="outline" className="font-mono text-[10px] mb-1">
                    ZONE {selectedBin.zone} &bull; RACK {selectedBin.code}
                  </Badge>
                  <h4 className="font-bold text-base font-display text-foreground">{selectedBin.name}</h4>
                  <p className="text-xs font-mono text-muted-foreground">{selectedBin.sku}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-background/50 border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">On Hand</span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">{selectedBin.qty} units</span>
                </div>
                <div className="p-3 rounded-xl bg-background/50 border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Capacity</span>
                  <span className="text-base font-bold text-muted-foreground font-mono mt-0.5 block">{selectedBin.capacity} units</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/[0.04] border border-primary/15 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Thermometer className="size-4 text-primary" />
                  <span>Telemetry Temp:</span>
                </div>
                <span className="font-bold font-mono text-foreground">{selectedBin.temperature}</span>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full text-xs font-semibold gap-2"
              onClick={() => handleRebalance(selectedBin.code)}
            >
              <Zap className="size-3.5" /> Dispatch Autonomous AGV Picker
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
