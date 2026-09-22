'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  MessageSquare,
  Sparkles,
  Send,
  AlertTriangle,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Info,
  DollarSign,
  ArrowRight,
  RefreshCw,
  Cpu,
  Bot,
  Activity,
  Sliders,
  TrendingUp,
  ShieldCheck,
  Flame,
  ChevronDown,
  Layers,
  BarChart2,
  FileSpreadsheet,
} from 'lucide-react'
import { mockApi } from '@/lib/services/api'
import { Alert, Approval } from '@/lib/mock/data'
import {
  AI_MODELS,
  AiModelId,
  AUTONOMOUS_AGENTS,
  AutonomousAgent,
  SHOCK_SCENARIOS,
  ShockScenario,
  processAiQuery,
  AiQueryResult,
} from '@/lib/ai/ai-engine'
import { usePersonalization } from '@/lib/personalization/personalization-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { toast } from 'sonner'

interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  modelUsed?: AiModelId
  reasoningSteps?: string[]
  chartData?: any
  tableData?: any
  recommendedAction?: any
  timestamp: string
}

export default function AiCopilotPage() {
  const { profile, t } = usePersonalization()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [agents, setAgents] = useState<AutonomousAgent[]>(AUTONOMOUS_AGENTS)
  const [loading, setLoading] = useState(true)

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'console' | 'agents' | 'scenarios' | 'alerts' | 'approvals'>('console')

  // Selected AI Model
  const [selectedModel, setSelectedModel] = useState<AiModelId>('antigravity-quantum')

  // Active Shock Scenario
  const [selectedScenario, setSelectedScenario] = useState<ShockScenario>(SHOCK_SCENARIOS[0])

  // Chat Console States
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [expandedReasoningId, setExpandedReasoningId] = useState<string | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello Jordan. I am your GrowLabs AI Enterprise Brain running on Antigravity Quantum Reasoning. I have audited all ${profile.name} databases. 5 autonomous agents are active, 6 alerts require attention, and all KPI streams are synchronized. How can I assist your executive operations today?`,
      timestamp: 'Just now',
    },
  ])

  useEffect(() => {
    async function loadAiData() {
      try {
        const alertData = await mockApi.getAlerts()
        const approvalData = await mockApi.getApprovals()
        setAlerts(alertData)
        setApprovals(approvalData)
      } catch (err) {
        toast.error('Failed to load AI brain data.')
      } finally {
        setLoading(false)
      }
    }
    loadAiData()
  }, [])

  const currentModelConfig = useMemo(() => {
    return AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0]
  }, [selectedModel])

  // Pre-defined quick queries
  const suggestions = [
    { text: 'Analyze profit margins and cost by product line', icon: BarChart2 },
    { text: 'What is our 6-month projected cashflow and runway?', icon: DollarSign },
    { text: 'Which suppliers are falling behind on delivery schedules?', icon: Activity },
    { text: 'Do we have enough raw material for today’s manufacturing orders?', icon: Zap },
    { text: 'Simulate financial impact of a 20% tariff shock', icon: Flame },
  ]

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMsgId = `user-${Date.now()}`
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      const result: AiQueryResult = await processAiQuery(text, selectedModel)

      const aiMsgId = `ai-${Date.now()}`
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: result.executiveSummary,
        modelUsed: result.modelUsed,
        reasoningSteps: result.reasoningSteps,
        chartData: result.chartData,
        tableData: result.tableData,
        recommendedAction: result.recommendedAction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMsg])
      setExpandedReasoningId(aiMsgId) // auto-expand chain of thought
    } catch (err) {
      toast.error('AI Query Failed')
    } finally {
      setSending(false)
    }
  }

  const handleApprove = (id: string, name: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id))
    toast.success(`Approved: ${name}`)
  }

  const handleReject = (id: string, name: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id))
    toast.error(`Rejected: ${name}`)
  }

  const handleExecuteAction = (actionText: string) => {
    toast.success(`Action Executed: ${actionText}`, {
      description: 'Transaction logged to cryptographic audit ledger with instant ledger dispatch.',
    })
    setMessages((prev) => [
      ...prev,
      {
        id: `action-${Date.now()}`,
        sender: 'ai',
        text: `✓ Successfully executed: "${actionText}". All affected databases and pipelines have been synchronized in real time.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Initializing Autonomous AI Brain…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-2">
            <Sparkles className="size-3.5" />
            GrowLabs Autonomous Multi-Model AI Brain
          </div>
          <h1 className="text-3xl font-bold font-display">AI Copilot & Autonomous Agents</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enterprise multi-hop reasoning, natural language SQL analytics, and autonomous background agent fleets.
          </p>
        </div>

        {/* Model Selector Pill */}
        <div className="flex items-center gap-2 bg-card/60 border border-border p-1.5 rounded-2xl">
          <span className="text-[10px] font-bold text-muted-foreground uppercase px-2">LLM Engine:</span>
          <select
            value={selectedModel}
            onChange={(e) => {
              const newModel = e.target.value as AiModelId
              setSelectedModel(newModel)
              toast.info(`Switched to ${AI_MODELS.find((m) => m.id === newModel)?.name}`)
            }}
            className="bg-background border border-border rounded-xl text-xs font-semibold px-3 py-1.5 text-foreground outline-none focus:border-primary font-mono cursor-pointer"
          >
            {AI_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.provider})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('console')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
            activeTab === 'console'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <MessageSquare className="size-4" /> AI Copilot & Query Engine
        </button>

        <button
          onClick={() => setActiveTab('agents')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
            activeTab === 'agents'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Bot className="size-4" /> Autonomous Agent Fleet ({agents.length})
        </button>

        <button
          onClick={() => setActiveTab('scenarios')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
            activeTab === 'scenarios'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Flame className="size-4" /> Scenario Shock Stress-Tester
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
            activeTab === 'alerts'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <AlertTriangle className="size-4" /> Live Anomaly Radar ({alerts.length})
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2',
            activeTab === 'approvals'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <ClipboardCheck className="size-4" /> AI Decision Approvals ({approvals.length})
        </button>
      </div>

      {/* TAB 1: AI COPILOT & QUERY CONSOLE */}
      {activeTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[640px] items-stretch">
          {/* Main Chat Conversation */}
          <div className="rounded-3xl border border-border bg-card/40 flex flex-col justify-between lg:col-span-3 overflow-hidden shadow-xl">
            {/* Active Model Subheader */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/50 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-success animate-pulse" />
                <span className="font-semibold text-foreground">{currentModelConfig.name}</span>
                <span className="font-mono text-[10px]">({currentModelConfig.latency} latency)</span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {currentModelConfig.reasoningStrength}
              </Badge>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 max-h-[560px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'flex gap-3.5 max-w-[92%]',
                    m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  )}
                >
                  <div
                    className={cn(
                      'size-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md',
                      m.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/20 text-primary border border-primary/30'
                    )}
                  >
                    {m.sender === 'user' ? 'ME' : <Sparkles className="size-4" />}
                  </div>

                  <div className="space-y-3 flex-1 min-w-0">
                    {/* Message Bubble */}
                    <div
                      className={cn(
                        'rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm',
                        m.sender === 'user'
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'bg-card border border-border text-foreground'
                      )}
                    >
                      {m.text}
                    </div>

                    {/* Chain of Thought Reasoning Drawer */}
                    {m.reasoningSteps && m.reasoningSteps.length > 0 && (
                      <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-4 space-y-2">
                        <button
                          onClick={() =>
                            setExpandedReasoningId(
                              expandedReasoningId === m.id ? null : m.id
                            )
                          }
                          className="flex items-center justify-between w-full text-xs font-bold text-primary"
                        >
                          <span className="flex items-center gap-1.5">
                            <Cpu className="size-3.5" /> Chain of Thought Multi-Hop Reasoning Trace (
                            {m.reasoningSteps.length} Steps)
                          </span>
                          <ChevronDown
                            className={cn(
                              'size-3.5 transition-transform duration-200',
                              expandedReasoningId === m.id && 'rotate-180'
                            )}
                          />
                        </button>

                        {expandedReasoningId === m.id && (
                          <div className="space-y-1.5 pt-2 border-t border-primary/10">
                            {m.reasoningSteps.map((step, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-muted-foreground flex items-start gap-2 font-mono"
                              >
                                <span className="text-primary font-bold">[{idx + 1}]</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Chart Data Rendering */}
                    {m.chartData && (
                      <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-3 shadow-md">
                        <h4 className="font-bold text-xs font-display text-foreground uppercase tracking-wider">
                          📊 {m.chartData.title}
                        </h4>
                        <div className="h-[240px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            {m.chartData.type === 'bar' ? (
                              <BarChart data={m.chartData.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis
                                  dataKey={m.chartData.xAxisKey}
                                  stroke="var(--color-muted-foreground)"
                                  style={{ fontSize: '10px' }}
                                />
                                <YAxis
                                  stroke="var(--color-muted-foreground)"
                                  style={{ fontSize: '10px' }}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'var(--color-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '12px',
                                  }}
                                />
                                <Bar
                                  dataKey={m.chartData.yAxisKey}
                                  fill="var(--color-primary)"
                                  radius={[6, 6, 0, 0]}
                                  name="Margin %"
                                />
                              </BarChart>
                            ) : (
                              <AreaChart data={m.chartData.data}>
                                <defs>
                                  <linearGradient id="aiArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey={m.chartData.xAxisKey} stroke="var(--color-muted-foreground)" style={{ fontSize: '10px' }} />
                                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '10px' }} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'var(--color-card)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '12px',
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey={m.chartData.yAxisKey}
                                  stroke="var(--color-primary)"
                                  fill="url(#aiArea)"
                                  strokeWidth={2}
                                />
                              </AreaChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Table Data Rendering */}
                    {m.tableData && (
                      <div className="rounded-2xl border border-border overflow-hidden bg-card/60 shadow-md">
                        <table className="w-full text-xs">
                          <thead className="bg-muted/50 border-b border-border">
                            <tr>
                              {m.tableData.columns.map((col: string, i: number) => (
                                <th key={i} className="text-left p-3 font-semibold text-muted-foreground">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {m.tableData.rows.map((row: any[], rIdx: number) => (
                              <tr key={rIdx} className="border-b border-border/50 hover:bg-muted/30">
                                {row.map((cell: any, cIdx: number) => (
                                  <td key={cIdx} className="p-3 font-medium">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Recommended Action Card */}
                    {m.recommendedAction && (
                      <div className="rounded-2xl border border-success/30 bg-success/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                        <div>
                          <Badge className="bg-success/20 text-success border-success/30 text-[10px] mb-1 font-bold">
                            AI RECOMMENDED ACTION
                          </Badge>
                          <h5 className="text-xs font-bold text-foreground">{m.recommendedAction.title}</h5>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{m.recommendedAction.impact}</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-success text-success-foreground font-semibold text-xs shrink-0"
                          onClick={() => handleExecuteAction(m.recommendedAction.buttonText)}
                        >
                          {m.recommendedAction.buttonText}
                        </Button>
                      </div>
                    )}

                    <span className="text-[10px] text-muted-foreground font-mono block pl-1">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex gap-3 items-center text-xs font-medium text-muted-foreground pl-2 animate-pulse">
                  <RefreshCw className="size-4 animate-spin text-primary" />
                  <span>{currentModelConfig.name} is running multi-hop query analysis…</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(input)
              }}
              className="border-t border-border p-4 bg-background/60 flex gap-2"
            >
              <input
                type="text"
                placeholder={`Ask ${profile.name} AI Brain, e.g., 'Analyze product gross margins' or 'Simulate tariff shock'…`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-background border border-border px-4 py-3 rounded-2xl text-sm outline-none focus:border-primary transition-colors font-medium shadow-inner"
                disabled={sending}
              />
              <Button type="submit" className="rounded-2xl px-5 h-12" disabled={sending}>
                <Send className="size-4" />
              </Button>
            </form>
          </div>

          {/* Quick Queries & Model Telemetry Sidebar */}
          <div className="space-y-5">
            {/* Quick Queries */}
            <div className="rounded-3xl border border-border bg-card/40 p-5 space-y-3 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Zap className="size-4 text-primary" /> Executive Prompts
              </h3>
              <div className="space-y-2">
                {suggestions.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(s.text)}
                      className="w-full text-left p-3 rounded-xl border border-border bg-background/50 hover:border-primary/40 hover:bg-muted/40 transition-all text-xs font-medium text-muted-foreground hover:text-foreground leading-relaxed flex items-start gap-2.5 group"
                      disabled={sending}
                    >
                      <Icon className="size-4 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span>{s.text}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Model Architecture Info */}
            <div className="rounded-3xl border border-border bg-card/40 p-5 space-y-3 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> Active Engine Spec
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-semibold text-foreground">{currentModelConfig.provider}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Context Limit</span>
                  <span className="font-mono font-semibold text-foreground">{currentModelConfig.contextWindow}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Reasoning Depth</span>
                  <span className="font-semibold text-success">{currentModelConfig.reasoningStrength}</span>
                </div>
                <div className="pt-2 text-[11px] text-muted-foreground leading-relaxed">
                  {currentModelConfig.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUTONOMOUS AGENT FLEET */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-card/40 border border-border p-5 rounded-3xl">
            <div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Autonomous 24/7 Background Agent Fleet
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Specialized micro-agents continuously monitoring supply chains, liquidity, invoice reconciliation, and factory lines.
              </p>
            </div>
            <Badge className="bg-success/15 text-success border-success/30 px-3 py-1 font-mono text-xs gap-1.5">
              <span className="size-2 rounded-full bg-success animate-ping" /> 5 AGENTS ONLINE
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((ag) => (
              <div
                key={ag.id}
                className="rounded-3xl border border-border bg-card/40 p-6 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn('size-10 rounded-2xl flex items-center justify-center border font-bold text-sm', ag.avatarColor)}>
                      <Bot className="size-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-mono uppercase font-bold',
                        ag.status === 'active'
                          ? 'bg-success/10 text-success border-success/30'
                          : 'bg-warning/10 text-warning border-warning/30'
                      )}
                    >
                      {ag.status}
                    </Badge>
                  </div>

                  <h4 className="font-bold font-display text-base text-foreground">{ag.name}</h4>
                  <p className="text-xs text-primary font-medium mt-0.5">{ag.role}</p>
                  <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">{ag.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-background/50 border border-border">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Model Accuracy</span>
                      <span className="font-bold text-success font-mono mt-0.5 block">{ag.accuracy}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-background/50 border border-border">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">Actions Today</span>
                      <span className="font-bold text-primary font-mono mt-0.5 block">{ag.actionsTakenToday}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/[0.04] border border-primary/15 text-[11px] text-muted-foreground">
                    <span className="font-bold text-primary block uppercase text-[9px] tracking-wider mb-0.5">Last Autonomous Run</span>
                    {ag.lastAction}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs font-semibold"
                    onClick={() => {
                      toast.success(`Triggered manual diagnostic sweep on ${ag.name}`);
                    }}
                  >
                    Run Agent Diagnostic Sweep
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SCENARIO SHOCK STRESS-TESTER */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scenario Selector List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Macroeconomic Shock Simulation
            </h3>
            {SHOCK_SCENARIOS.map((sc) => {
              const isSelected = selectedScenario.id === sc.id
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className={cn(
                    'w-full text-left p-4 rounded-2xl border transition-all space-y-2',
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary'
                      : 'border-border bg-card/40 hover:border-primary/40'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      className={cn(
                        'text-[10px] font-bold font-mono',
                        sc.financialImpact.riskLevel === 'HIGH'
                          ? 'bg-destructive/20 text-destructive border-destructive/30'
                          : 'bg-warning/20 text-warning border-warning/30'
                      )}
                    >
                      {sc.financialImpact.riskLevel} RISK
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{sc.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{sc.description}</p>
                </button>
              )
            })}
          </div>

          {/* Scenario Simulation Telemetry */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card/40 p-6 space-y-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <Badge variant="outline" className="mb-2 text-xs font-mono">
                  ACTIVE SIMULATION: {selectedScenario.id.toUpperCase()}
                </Badge>
                <h3 className="text-xl font-bold font-display text-foreground">{selectedScenario.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{selectedScenario.description}</p>
              </div>
            </div>

            {/* Parameter Delta Cards */}
            <div className="grid grid-cols-3 gap-3">
              {selectedScenario.parameters.map((p, i) => (
                <div key={i} className="p-4 rounded-2xl bg-background/50 border border-border space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">{p.label}</span>
                  <span className="text-lg font-bold text-destructive font-mono block">{p.value}</span>
                </div>
              ))}
            </div>

            {/* Financial Impact Breakdown */}
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-2">
                <AlertTriangle className="size-4" /> Forecasted Financial Shock Impact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
                <div>
                  <span className="text-muted-foreground block">Quarterly EBITDA Delta</span>
                  <span className="text-base font-bold text-destructive font-display mt-0.5 block">
                    {selectedScenario.financialImpact.ebitdaChange}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Gross Margin Erosion</span>
                  <span className="text-base font-bold text-destructive font-display mt-0.5 block">
                    {selectedScenario.financialImpact.grossMarginDelta}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Working Capital Requirement</span>
                  <span className="text-xs font-semibold text-foreground mt-0.5 block">
                    {selectedScenario.financialImpact.cashflowImpact}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Autonomous Remediation Plan */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary" /> Autonomous Remediation & Margin Protection Protocol
              </h4>
              <div className="space-y-2">
                {selectedScenario.remediationPlan.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border bg-background/40 flex items-start gap-3 text-xs leading-relaxed"
                  >
                    <div className="size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="w-full font-semibold"
                onClick={() => {
                  toast.success(`Remediation Plan Activated for ${selectedScenario.title}`, {
                    description: 'Automated procurement and supplier rerouting rules queued.',
                  })
                }}
              >
                Execute Shock Remediation Protocol
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ALERTS */}
      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((al) => (
            <div
              key={al.id}
              className={cn(
                'rounded-3xl border p-6 flex flex-col justify-between shadow-lg',
                al.severity === 'critical'
                  ? 'border-destructive/30 bg-destructive/5'
                  : al.severity === 'warning'
                  ? 'border-warning/30 bg-warning/5'
                  : 'border-border bg-card/40'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold font-display text-base text-foreground">{al.title}</h3>
                  <Badge className="font-mono text-[10px] uppercase font-bold" variant="outline">
                    {al.module}
                  </Badge>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Root Cause Diagnosis</p>
                    <p className="font-semibold text-foreground mt-0.5">{al.what}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Operational Risk Exposure</p>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">{al.why}</p>
                  </div>
                  <div className="border-t border-border/50 pt-3">
                    <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">GrowLabs AI Recommendation</p>
                    <p className="text-primary font-semibold mt-0.5 leading-relaxed">{al.recommendation}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4 mt-6 flex justify-between items-center text-xs">
                <span className="text-[10px] text-muted-foreground font-mono">{al.time}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-semibold"
                  onClick={() => toast.success(`Action queued: ${al.action}`)}
                >
                  {al.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {approvals.map((ap) => (
            <div
              key={ap.id}
              className="p-6 rounded-3xl border border-border bg-card/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-lg"
            >
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold text-[10px]">
                    {ap.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">Requested by {ap.requester}</span>
                </div>
                <div>
                  <h4 className="font-bold text-base font-display text-foreground">{ap.reason}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Amount: <span className="font-bold font-mono text-foreground">{formatCurrency(ap.amount)}</span>
                  </p>
                </div>
                <div className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground bg-primary/[0.04] p-3.5 rounded-2xl border border-primary/15">
                  <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-primary uppercase text-[9px] tracking-wider block">Autonomous AI Verdict</span>
                    {ap.aiRecommendation}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:flex-col lg:items-stretch lg:w-48 shrink-0">
                <Button
                  size="sm"
                  className="bg-success text-success-foreground font-semibold flex-1 lg:flex-none"
                  onClick={() => handleApprove(ap.id, ap.reason)}
                >
                  Approve Transaction
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive/20 hover:bg-destructive/10 font-semibold flex-1 lg:flex-none"
                  onClick={() => handleReject(ap.id, ap.reason)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}

          {approvals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 border border-border border-dashed rounded-3xl text-muted-foreground bg-card/10">
              <CheckCircle2 className="size-10 text-success mb-2" />
              <p className="text-sm font-semibold">Your executive decision queue is 100% cleared!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
