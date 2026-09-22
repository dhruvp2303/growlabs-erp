// Realistic fictional demo data for GrowLabs — company: PrimeFlow Manufacturing.
// This is the single source of truth consumed through the mock API service layer.
// When the Laravel backend is ready, replace the mockApi calls with real REST calls.

export const company = {
  name: 'PrimeFlow Manufacturing',
  industry: 'Manufacturing',
  segment: 'Industrial Pumps & Motors',
  size: '250-500 employees',
  country: 'United States',
  locations: 3,
  warehouses: 4,
  currency: 'USD',
  founded: 2009,
}

export type StockStatus = 'healthy' | 'low' | 'critical' | 'excess'

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  type: 'finished' | 'raw' | 'component'
  unitPrice: number
  cost: number
  onHand: number
  reserved: number
  reorderPoint: number
  warehouse: string
  status: StockStatus
  turnover: number
}

export const products: Product[] = [
  { id: 'p1', sku: 'WPM-4200', name: 'Water Pump Motor 4200', category: 'Motors', type: 'finished', unitPrice: 480, cost: 288, onHand: 340, reserved: 120, reorderPoint: 150, warehouse: 'Dallas DC', status: 'healthy', turnover: 6.2 },
  { id: 'p2', sku: 'MCT-880', name: 'Motor Controller 880', category: 'Electronics', type: 'finished', unitPrice: 320, cost: 176, onHand: 96, reserved: 60, reorderPoint: 120, warehouse: 'Dallas DC', status: 'low', turnover: 7.8 },
  { id: 'p3', sku: 'IPX-1500', name: 'Industrial Pump X1500', category: 'Pumps', type: 'finished', unitPrice: 1240, cost: 720, onHand: 54, reserved: 44, reorderPoint: 40, warehouse: 'Reno DC', status: 'healthy', turnover: 4.1 },
  { id: 'p4', sku: 'IPX-900', name: 'Industrial Pump X900', category: 'Pumps', type: 'finished', unitPrice: 860, cost: 512, onHand: 22, reserved: 30, reorderPoint: 45, warehouse: 'Reno DC', status: 'critical', turnover: 5.5 },
  { id: 'p5', sku: 'CUW-06', name: 'Copper Wire 6mm', category: 'Raw Material', type: 'raw', unitPrice: 12, cost: 8.4, onHand: 8200, reserved: 3100, reorderPoint: 4000, warehouse: 'Dallas RM', status: 'healthy', turnover: 9.4 },
  { id: 'p6', sku: 'STL-A36', name: 'Steel Sheet A36', category: 'Raw Material', type: 'raw', unitPrice: 46, cost: 33, onHand: 640, reserved: 520, reorderPoint: 700, warehouse: 'Dallas RM', status: 'low', turnover: 8.1 },
  { id: 'p7', sku: 'BRG-32', name: 'Precision Bearing 32', category: 'Component', type: 'component', unitPrice: 18, cost: 11, onHand: 210, reserved: 380, reorderPoint: 500, warehouse: 'Dallas RM', status: 'critical', turnover: 11.2 },
  { id: 'p8', sku: 'CTC-KIT', name: 'Controller Components Kit', category: 'Component', type: 'component', unitPrice: 64, cost: 41, onHand: 1450, reserved: 260, reorderPoint: 400, warehouse: 'Dallas RM', status: 'excess', turnover: 3.2 },
]

export interface Warehouse {
  id: string
  name: string
  location: string
  capacityUsed: number
  value: number
  items: number
}

export const warehouses: Warehouse[] = [
  { id: 'w1', name: 'Dallas DC', location: 'Dallas, TX', capacityUsed: 78, value: 1420000, items: 436 },
  { id: 'w2', name: 'Reno DC', location: 'Reno, NV', capacityUsed: 64, value: 980000, items: 288 },
  { id: 'w3', name: 'Dallas RM', location: 'Dallas, TX', capacityUsed: 71, value: 640000, items: 512 },
  { id: 'w4', name: 'Atlanta DC', location: 'Atlanta, GA', capacityUsed: 52, value: 720000, items: 194 },
]

export interface Customer {
  id: string
  name: string
  segment: string
  location: string
  lifetimeValue: number
  openOrders: number
  status: 'active' | 'at-risk' | 'new'
}

export const customers: Customer[] = [
  { id: 'c1', name: 'Meridian Water Systems', segment: 'Utilities', location: 'Phoenix, AZ', lifetimeValue: 842000, openOrders: 3, status: 'active' },
  { id: 'c2', name: 'Coastal Agriculture Co.', segment: 'Agriculture', location: 'Fresno, CA', lifetimeValue: 512000, openOrders: 2, status: 'active' },
  { id: 'c3', name: 'Northwind HVAC', segment: 'HVAC', location: 'Seattle, WA', lifetimeValue: 388000, openOrders: 1, status: 'at-risk' },
  { id: 'c4', name: 'Delta Municipal Works', segment: 'Government', location: 'Sacramento, CA', lifetimeValue: 1240000, openOrders: 4, status: 'active' },
  { id: 'c5', name: 'BlueRock Mining', segment: 'Mining', location: 'Denver, CO', lifetimeValue: 296000, openOrders: 1, status: 'new' },
]

export interface Order {
  id: string
  reference: string
  customer: string
  date: string
  amount: number
  units: number
  product: string
  status: 'pending' | 'processing' | 'fulfilled' | 'delayed'
  fulfillment: number
}

export const orders: Order[] = [
  { id: 'o1', reference: 'SO-10482', customer: 'Meridian Water Systems', date: '2026-08-24', amount: 124000, units: 100, product: 'Water Pump Motor 4200', status: 'processing', fulfillment: 82 },
  { id: 'o2', reference: 'SO-10481', customer: 'Delta Municipal Works', date: '2026-08-23', amount: 248000, units: 200, product: 'Industrial Pump X1500', status: 'delayed', fulfillment: 46 },
  { id: 'o3', reference: 'SO-10480', customer: 'Coastal Agriculture Co.', date: '2026-08-22', amount: 68800, units: 80, product: 'Industrial Pump X900', status: 'pending', fulfillment: 0 },
  { id: 'o4', reference: 'SO-10479', customer: 'Northwind HVAC', date: '2026-08-21', amount: 32000, units: 100, product: 'Motor Controller 880', status: 'fulfilled', fulfillment: 100 },
  { id: 'o5', reference: 'SO-10478', customer: 'BlueRock Mining', date: '2026-08-20', amount: 96000, units: 200, product: 'Water Pump Motor 4200', status: 'fulfilled', fulfillment: 100 },
  { id: 'o6', reference: 'SO-10477', customer: 'Meridian Water Systems', date: '2026-08-19', amount: 148800, units: 120, product: 'Industrial Pump X1500', status: 'processing', fulfillment: 71 },
]

export interface Supplier {
  id: string
  name: string
  category: string
  onTimeRate: number
  leadTime: number
  qualityScore: number
  spend: number
  status: 'preferred' | 'approved' | 'review'
}

export const suppliers: Supplier[] = [
  { id: 's1', name: 'Apex Copper & Alloys', category: 'Raw Material', onTimeRate: 96, leadTime: 8, qualityScore: 98, spend: 420000, status: 'preferred' },
  { id: 's2', name: 'Titan Steel Supply', category: 'Raw Material', onTimeRate: 88, leadTime: 12, qualityScore: 92, spend: 310000, status: 'approved' },
  { id: 's3', name: 'Precision Bearings Intl.', category: 'Component', onTimeRate: 74, leadTime: 21, qualityScore: 85, spend: 186000, status: 'review' },
  { id: 's4', name: 'Volt Electronics Group', category: 'Electronics', onTimeRate: 91, leadTime: 15, qualityScore: 94, spend: 268000, status: 'approved' },
]

export interface PurchaseOrder {
  id: string
  reference: string
  supplier: string
  item: string
  qty: number
  amount: number
  eta: string
  status: 'draft' | 'pending-approval' | 'ordered' | 'received'
}

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'po1', reference: 'PO-3391', supplier: 'Apex Copper & Alloys', item: 'Copper Wire 6mm', qty: 5000, amount: 42000, eta: '2026-09-06', status: 'ordered' },
  { id: 'po2', reference: 'PO-3390', supplier: 'Precision Bearings Intl.', item: 'Precision Bearing 32', qty: 2000, amount: 22000, eta: '2026-09-18', status: 'pending-approval' },
  { id: 'po3', reference: 'PO-3389', supplier: 'Titan Steel Supply', item: 'Steel Sheet A36', qty: 800, amount: 26400, eta: '2026-09-09', status: 'pending-approval' },
  { id: 'po4', reference: 'PO-3388', supplier: 'Volt Electronics Group', item: 'Controller Components Kit', qty: 1000, amount: 41000, eta: '2026-08-30', status: 'received' },
]

export type ProductionStage = 'planned' | 'material-ready' | 'production' | 'quality' | 'completed'

export interface ProductionOrder {
  id: string
  reference: string
  product: string
  qty: number
  stage: ProductionStage
  progress: number
  due: string
  plant: string
}

export const productionOrders: ProductionOrder[] = [
  { id: 'mo1', reference: 'MO-2201', product: 'Water Pump Motor 4200', qty: 200, stage: 'production', progress: 64, due: '2026-09-02', plant: 'Plant A' },
  { id: 'mo2', reference: 'MO-2202', product: 'Industrial Pump X1500', qty: 120, stage: 'planned', progress: 0, due: '2026-09-10', plant: 'Plant B' },
  { id: 'mo3', reference: 'MO-2203', product: 'Motor Controller 880', qty: 300, stage: 'material-ready', progress: 15, due: '2026-09-05', plant: 'Plant A' },
  { id: 'mo4', reference: 'MO-2204', product: 'Industrial Pump X900', qty: 80, stage: 'quality', progress: 92, due: '2026-08-31', plant: 'Plant B' },
  { id: 'mo5', reference: 'MO-2205', product: 'Water Pump Motor 4200', qty: 150, stage: 'completed', progress: 100, due: '2026-08-28', plant: 'Plant A' },
]

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'recommendation'

export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  what: string
  why: string
  recommendation: string
  action: string
  module: string
  time: string
}

export const alerts: Alert[] = [
  {
    id: 'a1',
    severity: 'critical',
    title: 'Stockout risk: Precision Bearing 32',
    what: 'Available stock (210) is below reserved demand (380) and reorder point (500).',
    why: 'Supplier lead time increased to 21 days while 3 production orders consume bearings this week.',
    recommendation: 'Raise a rush PO of 2,000 units with Precision Bearings Intl. and expedite freight.',
    action: 'Review Procurement',
    module: 'Procurement',
    time: '12 min ago',
  },
  {
    id: 'a2',
    severity: 'warning',
    title: 'Production delay likely on MO-2202',
    what: 'Industrial Pump X1500 order risks missing its Sep 10 due date.',
    why: 'Steel Sheet A36 availability is short by 60 units against the BOM requirement.',
    recommendation: 'Transfer 80 units of Steel A36 from Atlanta DC or split the production batch.',
    action: 'Open Production',
    module: 'Production',
    time: '48 min ago',
  },
  {
    id: 'a3',
    severity: 'warning',
    title: 'Supplier delay: Precision Bearings Intl.',
    what: 'On-time delivery dropped to 74% over the last quarter.',
    why: 'Two consecutive shipments arrived 6+ days late, affecting bearing availability.',
    recommendation: 'Qualify a secondary bearing supplier to de-risk the component supply chain.',
    action: 'View Supplier',
    module: 'Suppliers',
    time: '2 hours ago',
  },
  {
    id: 'a4',
    severity: 'recommendation',
    title: 'Demand spike expected: Water Pump Motor 4200',
    what: 'Forecast shows +28% demand next month vs current run rate.',
    why: 'Two utility customers signaled expansion orders and seasonality is trending up.',
    recommendation: 'Increase production plan by 180 units and pre-order copper wire buffer stock.',
    action: 'View Forecast',
    module: 'Forecasting',
    time: '3 hours ago',
  },
  {
    id: 'a5',
    severity: 'info',
    title: 'Excess inventory: Controller Components Kit',
    what: 'On-hand (1,450) far exceeds the reorder point with 3.2 turnover.',
    why: 'A cancelled program left surplus kits tying up working capital.',
    recommendation: 'Pause replenishment and bundle kits into upcoming controller builds.',
    action: 'View Inventory',
    module: 'Inventory',
    time: '5 hours ago',
  },
  {
    id: 'a6',
    severity: 'warning',
    title: 'Invoice overdue: Northwind HVAC',
    what: 'Invoice INV-2098 for $32,000 is 14 days past due.',
    why: 'Customer flagged as at-risk with slowing payment cadence.',
    recommendation: 'Trigger a payment reminder and place new orders on credit hold review.',
    action: 'Open Finance',
    module: 'Finance',
    time: '1 day ago',
  },
]

// Time-series helpers
export const revenueTrend = [
  { month: 'Feb', revenue: 1820000, expenses: 1240000, forecast: 1780000 },
  { month: 'Mar', revenue: 2040000, expenses: 1320000, forecast: 1990000 },
  { month: 'Apr', revenue: 1960000, expenses: 1380000, forecast: 2010000 },
  { month: 'May', revenue: 2280000, expenses: 1420000, forecast: 2180000 },
  { month: 'Jun', revenue: 2460000, expenses: 1510000, forecast: 2340000 },
  { month: 'Jul', revenue: 2610000, expenses: 1560000, forecast: 2520000 },
  { month: 'Aug', revenue: 2840000, expenses: 1640000, forecast: 2700000 },
]

export const stockValueTrend = [
  { month: 'Feb', value: 3120000 },
  { month: 'Mar', value: 3260000 },
  { month: 'Apr', value: 3180000 },
  { month: 'May', value: 3420000 },
  { month: 'Jun', value: 3510000 },
  { month: 'Jul', value: 3600000 },
  { month: 'Aug', value: 3760000 },
]

export const demandForecast = [
  { month: 'Sep', actual: 1240, forecast: 1240, low: 1240, high: 1240 },
  { month: 'Oct', actual: null as number | null, forecast: 1360, low: 1240, high: 1480 },
  { month: 'Nov', actual: null as number | null, forecast: 1520, low: 1360, high: 1690 },
  { month: 'Dec', actual: null as number | null, forecast: 1680, low: 1460, high: 1900 },
  { month: 'Jan', actual: null as number | null, forecast: 1440, low: 1220, high: 1660 },
]

export const stockByWarehouse = warehouses.map((w) => ({ name: w.name, value: w.value }))

export const salesByProduct = [
  { name: 'Industrial Pump X1500', value: 3120000 },
  { name: 'Water Pump Motor 4200', value: 2480000 },
  { name: 'Industrial Pump X900', value: 1640000 },
  { name: 'Motor Controller 880', value: 920000 },
]

export interface Employee {
  id: string
  name: string
  role: string
  department: string
  status: 'active' | 'on-leave' | 'remote'
  attendance: number
}

export const employees: Employee[] = [
  { id: 'e1', name: 'Dana Whitfield', role: 'Plant Head', department: 'Production', status: 'active', attendance: 98 },
  { id: 'e2', name: 'Marcus Lee', role: 'Inventory Manager', department: 'Warehouse', status: 'active', attendance: 96 },
  { id: 'e3', name: 'Priya Nair', role: 'Procurement Lead', department: 'Procurement', status: 'remote', attendance: 94 },
  { id: 'e4', name: 'Tom Alvarez', role: 'QA Supervisor', department: 'Quality', status: 'active', attendance: 92 },
  { id: 'e5', name: 'Rachel Kim', role: 'Finance Manager', department: 'Finance', status: 'on-leave', attendance: 88 },
  { id: 'e6', name: 'Owen Barnes', role: 'Logistics Coordinator', department: 'Logistics', status: 'active', attendance: 95 },
]

export interface Department {
  name: string
  headcount: number
  openRoles: number
}

export const departments: Department[] = [
  { name: 'Production', headcount: 128, openRoles: 4 },
  { name: 'Warehouse', headcount: 64, openRoles: 2 },
  { name: 'Procurement', headcount: 18, openRoles: 1 },
  { name: 'Quality', headcount: 22, openRoles: 0 },
  { name: 'Finance', headcount: 14, openRoles: 1 },
  { name: 'Logistics', headcount: 31, openRoles: 2 },
]

export interface Invoice {
  id: string
  reference: string
  customer: string
  amount: number
  due: string
  status: 'paid' | 'pending' | 'overdue'
}

export const invoices: Invoice[] = [
  { id: 'i1', reference: 'INV-2101', customer: 'Meridian Water Systems', amount: 124000, due: '2026-09-12', status: 'pending' },
  { id: 'i2', reference: 'INV-2100', customer: 'Delta Municipal Works', amount: 248000, due: '2026-09-05', status: 'pending' },
  { id: 'i3', reference: 'INV-2099', customer: 'Coastal Agriculture Co.', amount: 68800, due: '2026-08-28', status: 'paid' },
  { id: 'i4', reference: 'INV-2098', customer: 'Northwind HVAC', amount: 32000, due: '2026-08-16', status: 'overdue' },
  { id: 'i5', reference: 'INV-2097', customer: 'BlueRock Mining', amount: 96000, due: '2026-08-20', status: 'paid' },
]

export interface QualityInspection {
  id: string
  reference: string
  product: string
  passed: number
  failed: number
  rate: number
  status: 'pass' | 'review' | 'fail'
}

export const inspections: QualityInspection[] = [
  { id: 'q1', reference: 'QC-556', product: 'Water Pump Motor 4200', passed: 196, failed: 4, rate: 98, status: 'pass' },
  { id: 'q2', reference: 'QC-555', product: 'Industrial Pump X900', passed: 74, failed: 6, rate: 92.5, status: 'review' },
  { id: 'q3', reference: 'QC-554', product: 'Motor Controller 880', passed: 288, failed: 12, rate: 96, status: 'pass' },
  { id: 'q4', reference: 'QC-553', product: 'Industrial Pump X1500', passed: 110, failed: 10, rate: 91.7, status: 'review' },
]

export interface Shipment {
  id: string
  reference: string
  customer: string
  carrier: string
  origin: string
  destination: string
  status: 'preparing' | 'in-transit' | 'delivered' | 'returned'
  eta: string
  progress: number
}

export const shipments: Shipment[] = [
  { id: 'sh1', reference: 'SHP-8801', customer: 'Delta Municipal Works', carrier: 'FreightLine', origin: 'Reno DC', destination: 'Sacramento, CA', status: 'in-transit', eta: '2026-08-31', progress: 62 },
  { id: 'sh2', reference: 'SHP-8800', customer: 'Meridian Water Systems', carrier: 'RapidCargo', origin: 'Dallas DC', destination: 'Phoenix, AZ', status: 'preparing', eta: '2026-09-02', progress: 12 },
  { id: 'sh3', reference: 'SHP-8799', customer: 'Coastal Agriculture Co.', carrier: 'FreightLine', origin: 'Reno DC', destination: 'Fresno, CA', status: 'delivered', eta: '2026-08-26', progress: 100 },
  { id: 'sh4', reference: 'SHP-8798', customer: 'Northwind HVAC', carrier: 'RapidCargo', origin: 'Atlanta DC', destination: 'Seattle, WA', status: 'returned', eta: '2026-08-24', progress: 100 },
]

export interface Approval {
  id: string
  type: string
  requester: string
  amount: number
  reason: string
  aiRecommendation: string
  aiVerdict: 'approve' | 'review' | 'reject'
}

export const approvals: Approval[] = [
  { id: 'ap1', type: 'Purchase Order', requester: 'Priya Nair', amount: 42000, reason: 'Rush order of Copper Wire 6mm to prevent line stoppage.', aiRecommendation: 'Within budget and supplier is preferred with 96% on-time. Safe to approve.', aiVerdict: 'approve' },
  { id: 'ap2', type: 'Purchase Order', requester: 'Priya Nair', amount: 22000, reason: 'Precision Bearing 32 replenishment from supplier under review.', aiRecommendation: 'Supplier on-time dropped to 74%. Approve but add secondary source.', aiVerdict: 'review' },
  { id: 'ap3', type: 'Expense', requester: 'Dana Whitfield', amount: 8600, reason: 'Emergency maintenance for Plant A conveyor.', aiRecommendation: 'Unplanned but critical to avoid production downtime. Recommend approve.', aiVerdict: 'approve' },
  { id: 'ap4', type: 'Discount', requester: 'Sales — Meridian', amount: 14000, reason: '12% discount to close a $124k expansion order.', aiRecommendation: 'Margin remains above 38% threshold. Approve.', aiVerdict: 'approve' },
]

// KPI snapshot for the overview dashboard
export const kpis = {
  revenue: 2840000,
  revenueChange: 8.8,
  orders: 142,
  ordersChange: 4.1,
  inventoryValue: 3760000,
  inventoryChange: 2.9,
  lowStock: 3,
  productionActive: 4,
  pendingProcurement: 2,
  receivables: 372000,
  aiAlerts: 6,
  businessHealth: 87,
}
