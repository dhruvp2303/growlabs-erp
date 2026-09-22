'use client'

import { useState } from 'react'
import {
  Workflow,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  Sliders,
  Trash2,
  Cpu,
  Globe,
  Share2,
  RefreshCw,
  Layers,
  ChevronRight,
  Radio,
} from 'lucide-react'
import { usePersonalization } from '@/lib/personalization/personalization-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface WorkflowNode {
  id: string
  stage: 'trigger' | 'condition' | 'ai' | 'action' | 'webhook'
  title: string
  subtitle: string
  config: Record<string, string>
  status: 'idle' | 'running' | 'success' | 'failed'
}

interface WorkflowRecipe {
  id: string
  name: string
  category: string
  active: boolean
  nodes: WorkflowNode[]
  runsCount: number
  lastRun: string
}

const DEFAULT_RECIPES: WorkflowRecipe[] = [
  {
    id: 'recipe-1',
    name: 'Safety Stock Low → Auto-Procure Requisition',
    category: 'Supply Chain',
    active: true,
    runsCount: 18,
    lastRun: '15 mins ago',
    nodes: [
      {
        id: 'n1',
        stage: 'trigger',
        title: 'Event Trigger: Stock Deficit',
        subtitle: 'Inventory on hand drops below reorder point',
        config: { threshold: 'Reorder Point', buffer: '15%' },
        status: 'idle',
      },
      {
        id: 'n2',
        stage: 'condition',
        title: 'Condition: Criticality Check',
        subtitle: 'Component tagged as High Criticality or Tier-1',
        config: { criticality: 'HIGH', leadTime: '> 7 Days' },
        status: 'idle',
      },
      {
        id: 'n3',
        stage: 'ai',
        title: 'AI Decision: EOQ Batch Optimization',
        subtitle: 'Antigravity AI calculates optimal volume discount batch',
        config: { algorithm: 'Dynamic EOQ', targetSafetyStock: '30 Days' },
        status: 'idle',
      },
      {
        id: 'n4',
        stage: 'action',
        title: 'Action: Draft Purchase Order',
        subtitle: 'Auto-generate PO and route for approval',
        config: { autoApproveUnder: '$10,000', notify: 'Procurement Lead' },
        status: 'idle',
      },
      {
        id: 'n5',
        stage: 'webhook',
        title: 'Webhook: Slack & SAP Sync',
        subtitle: 'Broadcast order payload to #supply-chain & SAP S/4HANA',
        config: { endpoint: 'https://api.sap.corp/v1/po', channel: '#ops' },
        status: 'idle',
      },
    ],
  },
  {
    id: 'recipe-2',
    name: 'Sales Quotation Margin Floor Guard',
    category: 'Sales & Finance',
    active: true,
    runsCount: 12,
    lastRun: '2 hours ago',
    nodes: [
      {
        id: 'r2-n1',
        stage: 'trigger',
        title: 'Event Trigger: Quote Discount Applied',
        subtitle: 'Sales rep applies discount > 10% on deal',
        config: { discountCeiling: '10%' },
        status: 'idle',
      },
      {
        id: 'r2-n2',
        stage: 'condition',
        title: 'Condition: Gross Margin Floor',
        subtitle: 'Blended order margin falls below 38%',
        config: { marginFloor: '38.0%' },
        status: 'idle',
      },
      {
        id: 'r2-n3',
        stage: 'ai',
        title: 'AI Decision: Deal Lifetime Value Evaluation',
        subtitle: 'AI evaluates customer LTV to determine override viability',
        config: { historicalLtvMin: '$500,000' },
        status: 'idle',
      },
      {
        id: 'r2-n4',
        stage: 'action',
        title: 'Action: Executive Hold & Route',
        subtitle: 'Hold quotation and send approval prompt to VP Sales',
        config: { approverRole: 'VP of Sales' },
        status: 'idle',
      },
    ],
  },
  {
    id: 'recipe-3',
    name: 'Assembly QC Scrap Threshold Auto-Freeze',
    category: 'Quality & Line Operations',
    active: true,
    runsCount: 4,
    lastRun: '1 day ago',
    nodes: [
      {
        id: 'r3-n1',
        stage: 'trigger',
        title: 'Event Trigger: Batch Defect Spike',
        subtitle: 'Inspection failure rate exceeds 4.0%',
        config: { defectRate: '> 4.0%' },
        status: 'idle',
      },
      {
        id: 'r3-n2',
        stage: 'ai',
        title: 'AI Decision: Defect Root Cause Diagnostic',
        subtitle: 'AI cross-checks raw material lot batch number against supplier logs',
        config: { diagnosticDepth: 'Lot Traceability' },
        status: 'idle',
      },
      {
        id: 'r3-n3',
        stage: 'action',
        title: 'Action: Work Center Line Halt',
        subtitle: 'Freeze work center line queue and log CAPA deviation ticket',
        config: { line: 'Plant A & B', ticketType: 'CAPA-URGENT' },
        status: 'idle',
      },
    ],
  },
]

export default function AutomationPage() {
  const { profile } = usePersonalization()
  const [recipes, setRecipes] = useState<WorkflowRecipe[]>(DEFAULT_RECIPES)
  const [selectedRecipe, setSelectedRecipe] = useState<WorkflowRecipe>(DEFAULT_RECIPES[0])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(DEFAULT_RECIPES[0].nodes[0])
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationLogs, setSimulationLogs] = useState<string[]>([])

  const handleToggleRecipe = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    )
    toast.success('Workflow Recipe status updated')
  }

  const handleSimulateDryRun = async () => {
    if (isSimulating) return
    setIsSimulating(true)
    setSimulationLogs(['Initializing visual execution canvas simulator…'])

    const nodes = [...selectedRecipe.nodes]

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      setSimulationLogs((prev) => [...prev, `[Step ${i + 1}] Executing: ${node.title}…`])

      // Set node to running
      node.status = 'running'
      setSelectedRecipe({ ...selectedRecipe, nodes: [...nodes] })

      await new Promise((r) => setTimeout(r, 600))

      node.status = 'success'
      setSelectedRecipe({ ...selectedRecipe, nodes: [...nodes] })
      setSimulationLogs((prev) => [
        ...prev,
        `✓ [Step ${i + 1}] Completed ${node.stage.toUpperCase()}: ${node.subtitle}`,
      ])
    }

    setSimulationLogs((prev) => [
      ...prev,
      `✨ Workflow execution finished successfully with 0 errors!`,
    ])
    setIsSimulating(false)
    toast.success(`Dry Run Simulated: All ${nodes.length} nodes verified!`)
  }

  const getStageBadge = (stage: WorkflowNode['stage']) => {
    switch (stage) {
      case 'trigger':
        return { label: 'TRIGGER', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' }
      case 'condition':
        return { label: 'FILTER', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' }
      case 'ai':
        return { label: 'AI DECISION', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' }
      case 'action':
        return { label: 'ACTION', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
      case 'webhook':
        return { label: 'WEBHOOK', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' }
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-2">
            <Workflow className="size-3.5" />
            GrowLabs Visual Automation Studio
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Visual Workflow Automation Engine
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build event triggers, AI-powered decision logic, automated actions, and enterprise webhooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSimulateDryRun}
            disabled={isSimulating}
            className="gap-2 bg-primary text-primary-foreground font-semibold"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="size-4 animate-spin" /> Simulating Dry Run…
              </>
            ) : (
              <>
                <Play className="size-4" /> Simulate Dry Run
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Recipe Selector Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipes.map((r) => {
          const isSelected = selectedRecipe.id === r.id
          return (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRecipe(r)
                setSelectedNode(r.nodes[0])
                setSimulationLogs([])
              }}
              className={cn(
                'text-left p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3',
                isSelected
                  ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-lg shadow-primary/5'
                  : 'border-border bg-card/40 hover:border-primary/40'
              )}
            >
              <div className="flex items-start justify-between w-full">
                <Badge variant="outline" className="text-[10px] font-mono uppercase font-bold">
                  {r.category}
                </Badge>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleRecipe(r.id)
                  }}
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors',
                    r.active ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {r.active ? 'ACTIVE' : 'PAUSED'}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground">{r.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {r.nodes.length} Connected Pipeline Nodes
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-border/40 pt-2 w-full">
                <span>{r.runsCount} Triggers</span>
                <span>Last: {r.lastRun}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Interactive Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Canvas Area */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card/30 p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

          {/* Canvas Header */}
          <div className="flex items-center justify-between relative z-10 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-foreground">{selectedRecipe.name}</h3>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                  VISUAL CANVAS
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click any pipeline node to inspect or configure properties.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">Canvas Live</span>
            </div>
          </div>

          {/* Pipeline Nodes Flow (Horizontal / Stacked) */}
          <div className="space-y-4 relative z-10 py-4">
            {selectedRecipe.nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id
              const badgeInfo = getStageBadge(node.stage)

              return (
                <div key={node.id} className="relative group">
                  {/* Visual connector line */}
                  {index < selectedRecipe.nodes.length - 1 && (
                    <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-border z-0 group-hover:bg-primary/50 transition-colors" />
                  )}

                  <div
                    onClick={() => setSelectedNode(node)}
                    className={cn(
                      'relative z-10 p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4',
                      isSelected
                        ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-md'
                        : 'border-border bg-card/80 hover:border-primary/40 hover:bg-muted/40',
                      node.status === 'running' && 'ring-2 ring-primary animate-pulse bg-primary/20',
                      node.status === 'success' && 'border-success/40 bg-success/5'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {/* Node Number Circle */}
                      <div
                        className={cn(
                          'size-8 rounded-xl flex items-center justify-center font-bold font-mono text-xs border shrink-0',
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-border'
                        )}
                      >
                        {index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn('text-[9px] font-mono font-bold', badgeInfo.color)}>
                            {badgeInfo.label}
                          </Badge>
                          <h4 className="font-bold text-sm text-foreground">{node.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{node.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {node.status === 'running' && (
                        <RefreshCw className="size-4 animate-spin text-primary" />
                      )}
                      {node.status === 'success' && (
                        <CheckCircle2 className="size-4 text-success" />
                      )}
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Simulation Live Logs Console */}
          {simulationLogs.length > 0 && (
            <div className="rounded-2xl border border-border bg-black/60 p-4 font-mono text-xs space-y-1.5 max-h-36 overflow-y-auto relative z-10">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold border-b border-border/40 pb-1 mb-2">
                <span>Execution Logs Stream</span>
                <span>{simulationLogs.length} Events</span>
              </div>
              {simulationLogs.map((log, i) => (
                <div key={i} className="text-muted-foreground flex items-center gap-2">
                  <span className="text-primary font-bold">&gt;</span>
                  <span className={log.includes('✓') ? 'text-success' : log.includes('✨') ? 'text-primary font-bold' : ''}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Node Properties & Config Drawer */}
        <div className="rounded-3xl border border-border bg-card/40 p-6 space-y-6 shadow-xl flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-5">
              <div className="border-b border-border pb-3">
                <Badge variant="outline" className={cn('text-[10px] font-mono font-bold mb-2', getStageBadge(selectedNode.stage).color)}>
                  {getStageBadge(selectedNode.stage).label} PROPERTIES
                </Badge>
                <h3 className="font-bold font-display text-base text-foreground">{selectedNode.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedNode.subtitle}</p>
              </div>

              {/* Node Parameters */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Node Configuration Parameters
                </h4>
                <div className="space-y-3">
                  {Object.entries(selectedNode.config).map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl bg-background/50 border border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        {k}
                      </span>
                      <span className="text-xs font-semibold text-primary font-mono mt-0.5 block">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Human Approval Guard */}
              <div className="p-4 rounded-2xl border border-border bg-background/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Human Approval Gate</span>
                  <Switch defaultChecked />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Requires executive authorization before triggering external financial or line stoppage actions.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-xs">
              Select a node to view properties.
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <Button
              className="w-full text-xs font-semibold"
              onClick={() => toast.success('Node configuration saved.')}
            >
              Save Node Parameters
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
