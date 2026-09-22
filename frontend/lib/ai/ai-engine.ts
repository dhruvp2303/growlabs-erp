export type AiModelId = 'antigravity-quantum' | 'llama-3.3-70b' | 'deepseek-v3' | 'gpt-4o'

export interface AiModelConfig {
  id: AiModelId
  name: string
  provider: string
  latency: string
  contextWindow: string
  reasoningStrength: string
  description: string
  badge: string
}

export const AI_MODELS: AiModelConfig[] = [
  {
    id: 'antigravity-quantum',
    name: 'Antigravity Enterprise Quantum Brain',
    provider: 'Google Antigravity AI',
    latency: '320ms',
    contextWindow: '1,000,000 tokens',
    reasoningStrength: '100% Multi-Hop Enterprise Reasoning',
    description: 'Proprietary enterprise engine fine-tuned on supply chains, GAAP accounting, and real-time operations telemetry.',
    badge: 'DEFAULT RECOMMENDED',
  },
  {
    id: 'llama-3.3-70b',
    name: 'LLaMA 3.3 70B Instruct',
    provider: 'Meta AI Open Scale',
    latency: '480ms',
    contextWindow: '128,000 tokens',
    reasoningStrength: '94% Structured Reasoning',
    description: 'High-performance open weights model running on secure private enterprise compute with zero data retention.',
    badge: 'HIGH PRIVACY',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3 Turbo',
    provider: 'DeepSeek AI',
    latency: '410ms',
    contextWindow: '64,000 tokens',
    reasoningStrength: '96% Mathematical & Coding Depth',
    description: 'Optimized for complex BOM multi-tier calculations, SQL joins, and supply chain linear programming.',
    badge: 'ALGORITHMIC',
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o Enterprise',
    provider: 'OpenAI',
    latency: '520ms',
    contextWindow: '128,000 tokens',
    reasoningStrength: '95% General Executive Analysis',
    description: 'Flagship general-purpose multimodal LLM for unstructured documentation and executive memo drafting.',
    badge: 'MULTIMODAL',
  },
]

export interface AutonomousAgent {
  id: string
  name: string
  role: string
  status: 'active' | 'evaluating' | 'idle'
  accuracy: string
  actionsTakenToday: number
  lastAction: string
  description: string
  avatarColor: string
}

export const AUTONOMOUS_AGENTS: AutonomousAgent[] = [
  {
    id: 'agent-supply-chain',
    name: 'Supply Chain Autonomous Optimizer',
    role: 'Inventory & Procurement Auto-Pilot',
    status: 'active',
    accuracy: '99.4%',
    actionsTakenToday: 18,
    lastAction: 'Auto-drafted PO-3392 for Copper Wire before supplier price hike',
    description: 'Continuously balances warehouse bins against open customer orders and auto-replenishes safety buffers.',
    avatarColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  {
    id: 'agent-cashflow',
    name: 'Predictive Treasury & Runway Sentinel',
    role: 'Finance & Liquidity Forecaster',
    status: 'active',
    accuracy: '98.8%',
    actionsTakenToday: 6,
    lastAction: 'Simulated 90-day cash position under delayed utility receivables',
    description: 'Runs Monte Carlo revenue forecasts, flags overdue invoice risk, and optimizes supplier payment terms.',
    avatarColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'agent-ocr',
    name: '3-Way Invoice OCR & Matcher',
    role: 'Autonomous Accounts Payable',
    status: 'active',
    accuracy: '99.9%',
    actionsTakenToday: 34,
    lastAction: 'Matched PO-3388 against supplier BOL with 0 variance detected',
    description: 'Extracts line items from scanned PDF bills and reconciles purchase order, receiving slip, and invoice.',
    avatarColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    id: 'agent-retention',
    name: 'Customer Deal Velocity & Retention Agent',
    role: 'Autonomous CRM Intelligence',
    status: 'evaluating',
    accuracy: '96.2%',
    actionsTakenToday: 9,
    lastAction: 'Identified Northwind HVAC re-engagement opportunity with 8% discount prompt',
    description: 'Monitors customer purchasing intervals, NPS trends, and surfaces at-risk client accounts.',
    avatarColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  {
    id: 'agent-anomaly',
    name: 'Factory Floor Anomaly & QA Sentinel',
    role: 'Discrete Manufacturing Diagnostics',
    status: 'active',
    accuracy: '99.1%',
    actionsTakenToday: 12,
    lastAction: 'Flagged 0.4% vibration anomaly on Plant A Spindle #3',
    description: 'Connects to IoT line telemetry to prevent unplanned line shutdowns and scrap spikes.',
    avatarColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  },
]

export interface AiQueryResult {
  query: string
  modelUsed: AiModelId
  reasoningSteps: string[]
  executiveSummary: string
  chartData?: {
    type: 'bar' | 'line' | 'pie' | 'area'
    title: string
    xAxisKey: string
    yAxisKey: string
    data: any[]
  }
  tableData?: {
    columns: string[]
    rows: any[][]
  }
  recommendedAction?: {
    title: string
    impact: string
    actionId: string
    buttonText: string
  }
}

export interface ShockScenario {
  id: string
  title: string
  description: string
  parameters: {
    label: string
    value: string
  }[]
  financialImpact: {
    ebitdaChange: string
    grossMarginDelta: string
    cashflowImpact: string
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }
  remediationPlan: string[]
}

export const SHOCK_SCENARIOS: ShockScenario[] = [
  {
    id: 'tariff-shock',
    title: '20% Global Raw Material Tariff Surge',
    description: 'Simulates immediate introduction of 20% import tariffs across imported copper, steel, and semiconductor controllers.',
    parameters: [
      { label: 'Imported BOM Cost', value: '+20.0%' },
      { label: 'Supplier Lead Time', value: '+10 Days' },
      { label: 'Affected SKUs', value: '4 Finished Products' },
    ],
    financialImpact: {
      ebitdaChange: '-$342,000 / Quarter',
      grossMarginDelta: '-4.6%',
      cashflowImpact: 'Requires $180k working capital buffer',
      riskLevel: 'HIGH',
    },
    remediationPlan: [
      'Shift 45% volume to domestic approved vendor Titan Steel Supply.',
      'Execute forward price lock contracts for 6 months of copper wire supply.',
      'Apply 6.5% surcharge on high-spec industrial pumps (maintains 38%+ margin).',
    ],
  },
  {
    id: 'port-strike',
    title: '3-Week West Coast Port Congestion Strike',
    description: 'Simulates severe container demurrage and delays at Los Angeles & Long Beach intermodal terminals.',
    parameters: [
      { label: 'Vessel In-Transit Delay', value: '+21 Days' },
      { label: 'Demurrage Fee Surcharge', value: '$45,000 / Week' },
      { label: 'Delayed Customer Orders', value: 'SO-10481, SO-10482' },
    ],
    financialImpact: {
      ebitdaChange: '-$128,000 Total',
      grossMarginDelta: '-1.8%',
      cashflowImpact: 'Delayed collection of $372,000 receivables',
      riskLevel: 'MEDIUM',
    },
    remediationPlan: [
      'Reroute inbound shipments via Gulf of Mexico (Houston Terminal) cross-dock.',
      'Fulfill Meridian Water Systems SO-10482 from existing Dallas DC buffer stock.',
      'Notify affected clients with AI transparent tracking portal to protect NPS.',
    ],
  },
  {
    id: 'inflation-energy',
    title: '15% Industrial Power & Energy Spike',
    description: 'Simulates peak summer grid power rates affecting Plant A and Plant B assembly lines.',
    parameters: [
      { label: 'Utility Rate / kWh', value: '+$0.045 / kWh' },
      { label: 'Monthly Factory Overhead', value: '+$28,400 / mo' },
      { label: 'Affected Work Centers', value: 'Furnace & CNC Milling' },
    ],
    financialImpact: {
      ebitdaChange: '-$85,200 / Quarter',
      grossMarginDelta: '-1.1%',
      cashflowImpact: 'Minimal working capital disruption',
      riskLevel: 'LOW',
    },
    remediationPlan: [
      'Shift heavy thermal furnace cycles to off-peak night shift (11 PM - 6 AM).',
      'Deploy smart energy throttling on idle robotic conveyor arms.',
    ],
  },
]

export function processAiQuery(query: string, model: AiModelId = 'antigravity-quantum'): Promise<AiQueryResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.toLowerCase()

      if (q.includes('margin') || q.includes('profit') || q.includes('product line')) {
        resolve({
          query,
          modelUsed: model,
          reasoningSteps: [
            'Inspecting product catalog table `products` with joins on `orders` and `bom_components`...',
            'Calculating Gross Margin = (unitPrice - cost) / unitPrice for each product line...',
            'Evaluating historical demand trends from Q1 to Q3 across Dallas and Reno distribution centers...',
            'Identified highest margin SKU: Water Pump Motor 4200 (40.0% margin) generating $2.48M...',
            'Synthesized executive action recommendation to optimize lower-margin Industrial Pump X900...',
          ],
          executiveSummary:
            'Your product portfolio maintains an aggregate gross margin of 41.2%. Water Pump Motor 4200 is your most lucrative asset ($1.18M net contribution). Industrial Pump X900 has compressed margins (40.4% down to 36.8%) due to bearing price fluctuations.',
          chartData: {
            type: 'bar',
            title: 'Gross Margin & Profit Contribution by Product Line ($USD)',
            xAxisKey: 'name',
            yAxisKey: 'margin',
            data: [
              { name: 'Water Pump Motor 4200', margin: 40.0, revenue: 2480000, profit: 992000 },
              { name: 'Motor Controller 880', margin: 45.0, revenue: 920000, profit: 414000 },
              { name: 'Industrial Pump X1500', margin: 41.9, revenue: 3120000, profit: 1307280 },
              { name: 'Industrial Pump X900', margin: 40.4, revenue: 1640000, profit: 662560 },
            ],
          },
          recommendedAction: {
            title: 'Authorize Volume Re-negotiation for Pump X900 Bearings',
            impact: '+$48,000 annual margin expansion across 1,200 units',
            actionId: 'action_renegotiate_bearings',
            buttonText: 'Execute Supplier Re-negotiation Workflow',
          },
        })
      } else if (q.includes('cashflow') || q.includes('runway') || q.includes('burn') || q.includes('forecast')) {
        resolve({
          query,
          modelUsed: model,
          reasoningSteps: [
            'Querying General Ledger cash accounts, accounts receivable `invoices`, and approved payables...',
            'Running 6-month predictive regression on collections velocity (mean collection cycle: 14.2 days)...',
            'Factoring scheduled capital expenditures for Plant A automation and tax distributions...',
            'Calculated runway: 24.8 months at current net operating cashflow of +$480k/month...',
          ],
          executiveSummary:
            'Financial health index is STRONG (89/100). Forecasted cash balance increases from $3.84M to $5.20M by December 2026. Only 1 overdue invoice ($32k from Northwind HVAC) requires active dunning.',
          chartData: {
            type: 'area',
            title: '6-Month Projected Cash Balance vs Operating Expenses ($k)',
            xAxisKey: 'month',
            yAxisKey: 'cashBalance',
            data: [
              { month: 'Sep', cashBalance: 3840, burn: 1240, inflow: 1780 },
              { month: 'Oct', cashBalance: 4120, burn: 1280, inflow: 1960 },
              { month: 'Nov', cashBalance: 4490, burn: 1340, inflow: 2110 },
              { month: 'Dec', cashBalance: 4890, burn: 1410, inflow: 2350 },
              { month: 'Jan', cashBalance: 5120, burn: 1380, inflow: 2200 },
              { month: 'Feb', cashBalance: 5460, burn: 1420, inflow: 2420 },
            ],
          },
          recommendedAction: {
            title: 'Deploy $1.2M Idle Cash into High-Yield Treasury Sweep',
            impact: 'Generates +$62,400 risk-free annual yield (5.2% APY)',
            actionId: 'action_treasury_sweep',
            buttonText: 'Enable Automated Treasury Sweep',
          },
        })
      } else if (q.includes('supplier') || q.includes('vendor') || q.includes('lead time')) {
        resolve({
          query,
          modelUsed: model,
          reasoningSteps: [
            'Aggregating on-time delivery rates, quality reject logs, and lead times from `suppliers` table...',
            'Comparing Apex Copper, Titan Steel, Precision Bearings, and Volt Electronics...',
            'Identified supplier bottleneck: Precision Bearings Intl. on-time delivery dropped to 74%...',
            'Generating dual-sourcing recommendation to insulate production order MO-2202...',
          ],
          executiveSummary:
            'Apex Copper & Alloys is your top performer (96% on-time, 98% quality score). Precision Bearings Intl. is underperforming (74% on-time, 21 days lead time). We recommend shifting 40% of bearing allocations to a qualified secondary domestic supplier.',
          tableData: {
            columns: ['Supplier Name', 'Category', 'On-Time Rate', 'Lead Time', 'Quality Score', 'Status'],
            rows: [
              ['Apex Copper & Alloys', 'Raw Material', '96%', '8 Days', '98%', 'Preferred (Tier-1)'],
              ['Volt Electronics Group', 'Electronics', '91%', '15 Days', '94%', 'Approved'],
              ['Titan Steel Supply', 'Raw Material', '88%', '12 Days', '92%', 'Approved'],
              ['Precision Bearings Intl.', 'Components', '74%', '21 Days', '85%', 'Review Required'],
            ],
          },
          recommendedAction: {
            title: 'Qualify Secondary Bearing Supplier (Allied Bearings Corp)',
            impact: 'Reduces component stockout risk by 82% across all motor assemblies',
            actionId: 'action_dual_source_bearing',
            buttonText: 'Send RFP to Allied Bearings Corp',
          },
        })
      } else {
        // Universal fallback query response
        resolve({
          query,
          modelUsed: model,
          reasoningSteps: [
            'Scanning multi-tenant database across 12 operational modules...',
            'Cross-referencing live inventory, active sales orders, and assembly lines...',
            'Applying predictive heuristic model to generate executive summary...',
          ],
          executiveSummary: `Analysis completed for: "${query}". GrowLabs AI Enterprise Brain verified operations are running smoothly at 88.4% efficiency. Inventory levels, sales pipelines, and financial ledger items are synchronized with zero data discrepancies.`,
          recommendedAction: {
            title: 'Run Deep Diagnostic Sweep Across All Warehouses',
            impact: 'Verifies 100% physical vs ledger reconciliation',
            actionId: 'action_deep_sweep',
            buttonText: 'Execute System Diagnostic Sweep',
          },
        })
      }
    }, 700)
  })
}
