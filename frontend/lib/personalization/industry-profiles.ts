export type IndustryType =
  | 'manufacturing'
  | 'biotech'
  | 'saas'
  | 'fashion'
  | 'logistics'
  | 'fintech'

export interface IndustryTerminology {
  product: string
  products: string
  order: string
  orders: string
  inventory: string
  customer: string
  customers: string
  supplier: string
  suppliers: string
  facility: string
  facilities: string
  unit: string
  pipelineName: string
}

export interface IndustryKPI {
  id: string
  label: string
  value: string
  change: string
  status: 'up' | 'down' | 'neutral'
  tone?: 'default' | 'accent' | 'destructive'
  description: string
}

export interface IndustryProfile {
  id: IndustryType
  name: string
  tagline: string
  badge: string
  themeColor: string
  accentColor: string
  bgGlow: string
  fontAccent: string
  demoCompanyName: string
  terminology: IndustryTerminology
  kpis: IndustryKPI[]
  specializedMetrics: {
    label: string
    value: string
    sublabel: string
    trend: number
  }[]
  complianceBadges: string[]
  workflowTemplates: string[]
}

export const INDUSTRY_PROFILES: Record<IndustryType, IndustryProfile> = {
  manufacturing: {
    id: 'manufacturing',
    name: 'Discrete Manufacturing & Industrial Robotics',
    tagline: 'Precision assembly lines, OEE telemetry, and automated Bill of Materials.',
    badge: 'Heavy Industry & High-Precision',
    themeColor: '#3b82f6', // Sapphire Blue
    accentColor: '#06b6d4', // Cyan
    bgGlow: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.15), transparent 50%)',
    fontAccent: 'font-display',
    demoCompanyName: 'PrimeFlow Precision Robotics Ltd.',
    terminology: {
      product: 'Workpiece / Part',
      products: 'Manufactured Parts & SKUs',
      order: 'Production Work Order',
      orders: 'Manufacturing Orders (MO)',
      inventory: 'Raw Materials & Components',
      customer: 'Industrial Client',
      customers: 'OEM Clients',
      supplier: 'Tier-1 Raw Material Supplier',
      suppliers: 'Approved Vendor Directory',
      facility: 'Assembly Plant & Work Center',
      facilities: 'Manufacturing Plants',
      unit: 'pcs',
      pipelineName: 'Production Line Queue',
    },
    kpis: [
      { id: 'oee', label: 'Overall Equipment Effectiveness (OEE)', value: '88.4%', change: '+3.2% vs target', status: 'up', description: 'Plant A & B line efficiency index' },
      { id: 'scrap', label: 'Scrap & Rework Rate', value: '1.42%', change: '-0.38% improvement', status: 'up', description: 'Zero-defect precision tolerance' },
      { id: 'downtime', label: 'Unplanned Line Downtime', value: '14 mins', change: '85% below ceiling', status: 'up', description: 'Automated predictive maintenance active' },
      { id: 'backlog', label: 'Manufacturing Queue', value: '3,480 units', change: 'On schedule for Q3', status: 'neutral', description: '12 active assembly batches' },
    ],
    specializedMetrics: [
      { label: 'Cycle Time / Unit', value: '42.6s', sublabel: 'Line 4 Robotic Cell', trend: -4.5 },
      { label: 'BOM Utilization Rate', value: '99.1%', sublabel: 'Raw Copper & Alloys', trend: 1.2 },
      { label: 'Machine Health Telemetry', value: '99.8%', sublabel: '14 IoT Sensors Streaming', trend: 0.1 },
    ],
    complianceBadges: ['ISO 9001:2015', 'IATF 16949', 'OSHA 1910'],
    workflowTemplates: ['Emergency Line Scrap Freeze', 'Low Steel Stock Auto-PO', 'CNC Spindle Thermal Alert'],
  },

  biotech: {
    id: 'biotech',
    name: 'BioTech, Pharma & Life Sciences',
    tagline: 'FDA 21 CFR Part 11 lot traceability, cold-chain monitoring, and clinical batch control.',
    badge: 'Clinical Grade & Life Sciences',
    themeColor: '#10b981', // Emerald Green
    accentColor: '#14b8a6', // Teal
    bgGlow: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 50%)',
    fontAccent: 'font-display',
    demoCompanyName: 'Nexar BioTherapeutics Global',
    terminology: {
      product: 'Compound / Molecule',
      products: 'Biologic Formulations & Lots',
      order: 'Clinical Batch Order',
      orders: 'Clinical Trial Batches (CTB)',
      inventory: 'Active Pharmaceutical Reagents (API)',
      customer: 'Clinical Trial Site / Hospital',
      customers: 'Trial Networks & Research Centers',
      supplier: 'cGMP Certified Reagent Supplier',
      suppliers: 'Audited Bio-Vendors',
      facility: 'Cleanroom Lab Suite',
      facilities: 'Bioreactor Facilities',
      unit: 'vials',
      pipelineName: 'Clinical Trial Cohort Pipeline',
    },
    kpis: [
      { id: 'yield', label: 'Bioreactor Lot Yield', value: '94.8%', change: '+2.1% batch purity', status: 'up', description: 'Recombinant protein expression rate' },
      { id: 'cold_chain', label: 'Cold-Chain Integrity', value: '100.0%', change: '-80°C constant', status: 'up', description: '34 cryogenic freezers monitored live' },
      { id: 'lot_trace', label: 'Lot Quarantine Status', value: '0 Deviations', change: 'Audit ready', status: 'up', description: 'All CAPAs resolved within SLA' },
      { id: 'trial_burn', label: 'Phase III Trial Run-rate', value: '$1.42M/mo', change: 'Within grant budget', status: 'neutral', description: 'Cohort expansion on track' },
    ],
    specializedMetrics: [
      { label: 'Reagent Potency Score', value: '99.4%', sublabel: 'Bio-Assay Validation', trend: 0.8 },
      { label: 'Cleanroom ISO Class', value: 'ISO 5 (Class 100)', sublabel: '0.3µm particle check pass', trend: 0 },
      { label: 'FDA Batch Release SLA', value: '2.4 Days', sublabel: 'Digital e-Signature verified', trend: -18.2 },
    ],
    complianceBadges: ['FDA 21 CFR Part 11', 'cGMP Current', 'EMA Annex 1', 'HIPAA Certified'],
    workflowTemplates: ['Cold-Chain Temp Breach Quarantine', 'Sterility Assay Deviation Trigger', 'Automated CoA Signoff'],
  },

  saas: {
    id: 'saas',
    name: 'High-Growth Tech SaaS & Cloud Software',
    tagline: 'Subscription cohort telemetry, Net Dollar Retention, AWS infrastructure cost, and AI agent usage.',
    badge: 'Cloud Native & Subscription Scale',
    themeColor: '#8b5cf6', // Indigo Violet
    accentColor: '#ec4899', // Pink Neon
    bgGlow: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.18), transparent 50%)',
    fontAccent: 'font-display',
    demoCompanyName: 'Synthetix AI Cloud Infrastructure',
    terminology: {
      product: 'Subscription Tier / API Plan',
      products: 'SaaS Plans & Add-ons',
      order: 'Subscription Contract',
      orders: 'Enterprise Service Agreements',
      inventory: 'Cloud Server Clusters & Seats',
      customer: 'Enterprise Tenant',
      customers: 'Active Customer Accounts',
      supplier: 'Cloud Infrastructure Vendor (AWS/GCP)',
      suppliers: 'API & Infrastructure Providers',
      facility: 'Cloud Region Data Center',
      facilities: 'Multi-Region Compute Clusters',
      unit: 'seats',
      pipelineName: 'Enterprise Sales Funnel',
    },
    kpis: [
      { id: 'arr', label: 'Annual Recurring Revenue (ARR)', value: '$18.42M', change: '+34% YoY growth', status: 'up', description: 'Net new ARR +$420k this month' },
      { id: 'ndr', label: 'Net Dollar Retention (NDR)', value: '138.4%', change: 'Top-quartile SaaS benchmark', status: 'up', description: 'Expansion revenue exceeding gross churn' },
      { id: 'churn', label: 'Gross Logo Churn Rate', value: '0.42%', change: '-0.15% reduction', status: 'up', description: 'AI churn risk detector preventing losses' },
      { id: 'cac_payback', label: 'CAC Payback Velocity', value: '7.8 mos', change: 'Highly capital efficient', status: 'up', description: 'Blended acquisition cost' },
    ],
    specializedMetrics: [
      { label: 'Monthly Active API Calls', value: '1.84 Billion', sublabel: '99.995% Uptime SLA', trend: 28.4 },
      { label: 'Gross Margin on Compute', value: '82.6%', sublabel: 'AWS & GPU Optimization', trend: 3.1 },
      { label: 'Rule of 40 Index', value: '54.2%', sublabel: 'Growth Rate + Free Cashflow', trend: 4.8 },
    ],
    complianceBadges: ['SOC 2 Type II', 'ISO 27001', 'GDPR / CCPA Compliant'],
    workflowTemplates: ['High-Usage Tier Auto-Upgrade', 'Payment Failed Dunning Escalation', 'Churn Risk Health Score Trigger'],
  },

  fashion: {
    id: 'fashion',
    name: 'Haute Couture & Luxury Global Retail',
    tagline: 'Multi-variant size/color matrices, seasonal drop allocations, and boutique omnichannel inventory.',
    badge: 'Luxury Commerce & Omnichannel',
    themeColor: '#f59e0b', // Amber / Gold
    accentColor: '#d946ef', // Fuchsia
    bgGlow: 'radial-gradient(circle at top right, rgba(245, 158, 11, 0.15), transparent 50%)',
    fontAccent: 'font-display',
    demoCompanyName: 'Maison Aurum Luxury Fashion Group',
    terminology: {
      product: 'Collection Piece / Garment',
      products: 'Designer SKUs & Colorways',
      order: 'Boutique Purchase Order',
      orders: 'Clientele Orders & Consignments',
      inventory: 'Fabric Rolls & Boutique Stock',
      customer: 'VIP Clientele / Flagship Store',
      customers: 'Global Retail & Private VIPs',
      supplier: 'Italian Silk & Textile Atelier',
      suppliers: 'Artisanal Textile Mills',
      facility: 'Flagship Showroom & Atelier',
      facilities: 'Boutique Hubs & Fulfillment Centers',
      unit: 'pieces',
      pipelineName: 'Seasonal Drop Allocation Pipeline',
    },
    kpis: [
      { id: 'sell_through', label: 'Full-Price Sell-Through Rate', value: '78.6%', change: '+6.4% Autumn/Winter Drop', status: 'up', description: 'Minimal discounting needed' },
      { id: 'returns', label: 'Omnichannel Return Rate', value: '11.2%', change: '-3.1% via 3D fitting', status: 'up', description: 'Flagship exchanges prioritized' },
      { id: 'vip_gmv', label: 'VIP Clientele Share of GMV', value: '62.4%', change: 'Private salon sales +18%', status: 'up', description: 'Top 500 global clients' },
      { id: 'margin', label: 'Gross Product Margin', value: '84.2%', change: '+1.8% vs last collection', status: 'up', description: 'Premium sustainable silk & leather' },
    ],
    specializedMetrics: [
      { label: 'Boutique Stock Velocity', value: '4.8x / Year', sublabel: 'Paris & Milan Flagships', trend: 8.2 },
      { label: 'Pre-Order Conversion', value: '41.2%', sublabel: 'Exclusive Lookbook Invitations', trend: 14.5 },
      { label: 'Deadstock Minimization', value: '2.1%', sublabel: 'Demand Forecasting Matrix', trend: -6.4 },
    ],
    complianceBadges: ['OEKO-TEX Certified', 'GOTS Organic Cotton', 'Responsible Jewellery Council'],
    workflowTemplates: ['Low Boutique Stock Auto-Replenish', 'VIP Allocation Reservation Guard', 'Seasonal Markdown Freeze'],
  },

  logistics: {
    id: 'logistics',
    name: 'Global Supply Chain, Freight & Fleet Logistics',
    tagline: 'Live multi-modal container tracking, port demurrage prevention, and fleet route optimization.',
    badge: 'Global Freight & Intermodal Scale',
    themeColor: '#0ea5e9', // Sky Blue
    accentColor: '#22c55e', // Emerald
    bgGlow: 'radial-gradient(circle at top right, rgba(14, 165, 233, 0.15), transparent 50%)',
    fontAccent: 'font-display',
    demoCompanyName: 'TransGlobal Oceanic & Air Intermodal',
    terminology: {
      product: 'Cargo Unit / Container (TEU)',
      products: 'Freight Consignments & Manifests',
      order: 'Bill of Lading (BOL)',
      orders: 'Shipping Manifests & Waybills',
      inventory: 'Bonded Warehouse Pallets',
      customer: 'Shipper / Cargo Consignee',
      customers: 'Commercial Freight Clients',
      supplier: 'Ocean Carrier & Rail Operator',
      suppliers: 'Charter Vessels & 3PL Fleets',
      facility: 'Intermodal Port Terminal',
      facilities: 'Container Terminals & Cross-Docks',
      unit: 'TEU',
      pipelineName: 'Customs & Port Dispatch Pipeline',
    },
    kpis: [
      { id: 'on_time', label: 'On-Time Port In-Transit Rate', value: '96.2%', change: '+4.1% dynamic routing', status: 'up', description: 'Global ETA accuracy window' },
      { id: 'demurrage', label: 'Demurrage & Detention Fees', value: '$0.00', change: '100% saved with auto-clearance', status: 'up', description: 'Port customs pre-cleared' },
      { id: 'fuel', label: 'Fleet Fuel Efficiency Score', value: '8.4 km/L', change: '+6.2% telematics optimization', status: 'up', description: 'Electric & Hybrid transition on schedule' },
      { id: 'active_teu', label: 'Active TEU in Transit', value: '14,280 TEU', change: '8 ocean freighters underway', status: 'neutral', description: 'Pacific & Atlantic corridors' },
    ],
    specializedMetrics: [
      { label: 'Average Customs Dwell Time', value: '3.8 Hours', sublabel: 'Automated Port Manifest Sync', trend: -24.1 },
      { label: 'Fleet Telematics Uptime', value: '99.9%', sublabel: '640 Active GPS Trackers', trend: 0.2 },
      { label: 'Cross-Dock Turnaround', value: '45 mins', sublabel: 'Reno & Dallas Hubs', trend: -12.5 },
    ],
    complianceBadges: ['C-TPAT Tier 3', 'AEO Certified', 'IMO 2020 Low Sulfur Compliant'],
    workflowTemplates: ['Port Congestion Auto-Reroute', 'Customs Clearance Document Trigger', 'Temperature Excursion Alert'],
  },

  fintech: {
    id: 'fintech',
    name: 'FinTech, Capital Markets & Treasury',
    tagline: 'Multi-currency ledger reconciliation, automated fraud telemetry, and regulatory liquidity buffers.',
    badge: 'Banking Grade & Capital Markets',
    themeColor: '#059669', // Emerald Green / Currency
    accentColor: '#eab308', // Gold
    bgGlow: 'radial-gradient(circle at top right, rgba(5, 150, 105, 0.15), transparent 50%)',
    fontAccent: 'font-display',
    demoCompanyName: 'Apex Capital & Global Treasury Systems',
    terminology: {
      product: 'Financial Asset / Yield Note',
      products: 'Securities, Portfolios & Credit Lines',
      order: 'Trade Execution & Wire',
      orders: 'Disbursements & Trade Orders',
      inventory: 'Liquid Capital Reserves & Collateral',
      customer: 'Institutional Investor / Borrower',
      customers: 'Institutional Clients & Depositors',
      supplier: 'Liquidity Provider & Clearing House',
      suppliers: 'Correspondent Banks & Custodians',
      facility: 'Treasury Node / Vault',
      facilities: 'Custody Vaults & Clearing Nodes',
      unit: 'USD',
      pipelineName: 'Underwriting & Settlement Pipeline',
    },
    kpis: [
      { id: 'aum', label: 'Assets Under Management (AUM)', value: '$840.2M', change: '+14.2% QoQ inflows', status: 'up', description: 'Institutional treasury portfolios' },
      { id: 'lcr', label: 'Liquidity Coverage Ratio (LCR)', value: '184.2%', change: 'Exceeds Basel III requirements', status: 'up', description: 'High-quality liquid assets buffer' },
      { id: 'reconcile', label: 'Automated Ledger Matching', value: '99.98%', change: 'Zero unmapped suspense entries', status: 'up', description: 'AI multi-currency reconciliation' },
      { id: 'fraud', label: 'Fraud Detection Intercepts', value: '100%', change: '0 chargebacks or leaks', status: 'up', description: 'Autonomous ML risk rules active' },
    ],
    specializedMetrics: [
      { label: 'Settlement Velocity (T+0)', value: '1.2s Average', sublabel: 'Real-Time Gross Settlement (RTGS)', trend: -40.0 },
      { label: 'FX Slippage Mitigation', value: '0.002 bps', sublabel: 'Smart Order Router Execution', trend: -15.0 },
      { label: 'Regulatory Capital Buffer', value: '+$142.5M', sublabel: 'Tier 1 Capital Adequacy 18.5%', trend: 5.2 },
    ],
    complianceBadges: ['SEC / FINRA Compliant', 'Basel III Standard', 'PCI-DSS Level 1', 'AML / KYC Automated'],
    workflowTemplates: ['Suspicious Wire Intercept & Hold', 'Liquidity Buffer Replenish Trigger', 'Daily Regulatory Ledger Close'],
  },
}
