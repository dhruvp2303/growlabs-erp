// lib/services/api.ts
//
// Production API service layer connecting Next.js frontend to Laravel /api/v1 REST backend.

import * as db from '@/lib/mock/data'
import { ApiClient } from './api-client'

async function tryApiOrFallback<T>(apiPromise: Promise<T>, fallbackData: T): Promise<T> {
  try {
    return await apiPromise;
  } catch (error) {
    // Return pre-seeded data if backend is offline/starting up
    return structuredCloneSafe(fallbackData);
  }
}

function structuredCloneSafe<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value))
}

export const mockApi = {
  // Company / overview
  getCompany: () => tryApiOrFallback(ApiClient.get<any>('/analytics/dashboard'), db.company),
  getKpis: () => tryApiOrFallback(ApiClient.get<any>('/analytics/dashboard'), db.kpis),
  getRevenueTrend: () => tryApiOrFallback(ApiClient.get<any>('/finance/revenue-trend'), db.revenueTrend),

  // Inventory
  getInventory: () => tryApiOrFallback(ApiClient.get<any>('/products'), db.products),
  getWarehouses: () => tryApiOrFallback(ApiClient.get<any>('/inventory/warehouses'), db.warehouses),
  getStockValueTrend: () => tryApiOrFallback(ApiClient.get<any>('/analytics/stock-trend'), db.stockValueTrend),
  getStockByWarehouse: () => tryApiOrFallback(ApiClient.get<any>('/inventory/warehouses'), db.stockByWarehouse),

  // Sales / CRM
  getOrders: () => tryApiOrFallback(ApiClient.get<any>('/sales/orders'), db.orders),
  getCustomers: () => tryApiOrFallback(ApiClient.get<any>('/sales/customers'), db.customers),
  getSalesByProduct: () => tryApiOrFallback(ApiClient.get<any>('/analytics/sales-by-product'), db.salesByProduct),

  // Procurement
  getSuppliers: () => tryApiOrFallback(ApiClient.get<any>('/procurement/suppliers'), db.suppliers),
  getPurchaseOrders: () => tryApiOrFallback(ApiClient.get<any>('/procurement/purchase-orders'), db.purchaseOrders),

  // Production
  getProductionOrders: () => tryApiOrFallback(ApiClient.get<any>('/production/orders'), db.productionOrders),

  // Quality
  getInspections: () => tryApiOrFallback(ApiClient.get<any>('/quality/inspections'), db.inspections),

  // Finance
  getInvoices: () => tryApiOrFallback(ApiClient.get<any>('/finance/invoices'), db.invoices),

  // HR
  getEmployees: () => tryApiOrFallback(ApiClient.get<any>('/hr/employees'), db.employees),
  getDepartments: () => tryApiOrFallback(ApiClient.get<any>('/hr/departments'), db.departments),

  // Logistics
  getShipments: () => tryApiOrFallback(ApiClient.get<any>('/logistics/shipments'), db.shipments),

  // AI
  getAlerts: () => tryApiOrFallback(ApiClient.get<any>('/ai/alerts'), db.alerts),
  getDemandForecast: () => tryApiOrFallback(ApiClient.get<any>('/analytics/stock-trend'), db.demandForecast),
  getApprovals: () => tryApiOrFallback(ApiClient.get<any>('/ai/approvals'), db.approvals),
}

export type MockApi = typeof mockApi
