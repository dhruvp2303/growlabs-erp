'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Role = 'admin' | 'manager' | 'production' | 'finance' | 'hr'

export interface OrderDecision {
  option: 'use_stock_and_make_rest' | 'make_all_from_raw' | 'custom'
  useFromStock: number
  makeFromRaw: number
  customExplanation?: string
}

export interface SmartOrder {
  id: string
  reference: string
  customer: string
  date: string
  itemName: string
  orderedUnits: number
  unitPrice: number
  totalAmount: number
  
  // Stock checks at creation time
  stockAvailableAtOrder: number
  rawMaterialMaxCapacity: number

  // Flow State
  decision?: OrderDecision
  status: 
    | 'NEW_ORDER_AWAITING_DECISION' 
    | 'SENT_TO_PRODUCTION' 
    | 'IN_PRODUCTION' 
    | 'PRODUCTION_COMPLETED_AWAITING_APPROVAL' 
    | 'APPROVED_INVOICED'
    | 'REJECTED'
  
  // Timestamps & actors
  decidedBy?: string
  decidedAt?: string
  acceptedByProductionAt?: string
  completedByProductionAt?: string
  approvedByManagerAt?: string
  
  // Linked invoice
  invoiceId?: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  targetRoles: Role[]
  readBy: Role[]
  actionUrl?: string
  type: 'order' | 'production' | 'approval' | 'invoice' | 'system'
  priority?: 'normal' | 'high' | 'urgent'
}

export interface InvoiceRecord {
  id: string
  invoiceNumber: string
  orderId: string
  orderRef: string
  customer: string
  date: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  subtotal: number
  taxRate: number
  taxAmount: number
  grandTotal: number
  status: 'PAID' | 'PENDING' | 'ISSUED'
  generatedBy: string
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  finishedStock: number // e.g. 30 motors
  rawUnitsCapacity: number // enough raw material for 100 motors
  rawMaterials: {
    name: string
    unitsPerMotor: number
    currentStock: number
    unit: string
  }[]
}

interface ErpWorkflowContextType {
  activeRole: Role
  setActiveRole: (role: Role) => void
  orders: SmartOrder[]
  notifications: NotificationItem[]
  invoices: InvoiceRecord[]
  inventory: InventoryItem
  
  // Actions
  createOrder: (data: { customer: string; itemName: string; orderedUnits: number; unitPrice: number }) => SmartOrder
  submitOrderDecision: (orderId: string, decision: OrderDecision) => void
  acceptProductionJob: (orderId: string) => void
  completeProductionJob: (orderId: string) => void
  managerApproveAndInvoice: (orderId: string) => InvoiceRecord
  markNotificationRead: (id: string) => void
  resetWorkflowDemo: () => void
  
  // Security verification
  verifyRolePassword: (role: Role, passwordInput: string) => boolean
}

const STORAGE_KEY = 'growlabs_erp_workflow_v1'

const INITIAL_INVENTORY: InventoryItem = {
  id: 'prod-motor-4200',
  name: 'Water Pump Industrial Motor 4200',
  sku: 'WPM-4200',
  category: 'Industrial Motors',
  finishedStock: 30, // As requested: "i have stock of 30 motters"
  rawUnitsCapacity: 100, // "and raw metareal to make 100 more moters"
  rawMaterials: [
    { name: 'Copper Wire 6mm', unitsPerMotor: 6, currentStock: 600, unit: 'm' }, // 600m / 6 = 100 motors
    { name: 'Steel Sheet A36 Stamping', unitsPerMotor: 1, currentStock: 100, unit: 'units' },
    { name: 'Precision Bearing 32', unitsPerMotor: 2, currentStock: 200, unit: 'units' },
    { name: 'Motor Controller Core', unitsPerMotor: 1, currentStock: 100, unit: 'units' },
  ]
}

const DEFAULT_ORDERS: SmartOrder[] = [
  {
    id: 'ord-101',
    reference: 'SO-10501',
    customer: 'Delta Engineering Corp',
    date: new Date().toISOString().split('T')[0],
    itemName: 'Water Pump Industrial Motor 4200',
    orderedUnits: 50, // As requested: "i got order of 50 motters"
    unitPrice: 480,
    totalAmount: 24000,
    stockAvailableAtOrder: 30,
    rawMaterialMaxCapacity: 100,
    status: 'NEW_ORDER_AWAITING_DECISION',
  }
]

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Customer Order Received: 50 Motors',
    message: 'Customer Delta Engineering Corp ordered 50 motors. Current Stock: 30 motors. Raw material capacity: 100 motors. Action required: Select fulfillment strategy.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    targetRoles: ['admin', 'manager'],
    readBy: [],
    type: 'order',
    priority: 'urgent',
    actionUrl: '/erp/sales',
  }
]

const DEFAULT_INVOICES: InvoiceRecord[] = [
  {
    id: 'inv-9001',
    invoiceNumber: 'INV-2026-9001',
    orderId: 'ord-hist-99',
    orderRef: 'SO-10480',
    customer: 'Meridian Water Systems',
    date: '2026-09-24',
    items: [
      { description: 'Water Pump Industrial Motor 4200', quantity: 20, unitPrice: 480, total: 9600 }
    ],
    subtotal: 9600,
    taxRate: 0.10,
    taxAmount: 960,
    grandTotal: 10560,
    status: 'PAID',
    generatedBy: 'System Auto-Audit',
  }
]

// Authorized passwords for role verification:
// Admin, Manager, HR, CA (Finance)
export const ROLE_PASSWORDS: Record<Role, string> = {
  admin: 'admin123',
  manager: 'manager123',
  finance: 'finance123', // CA
  hr: 'hr123',
  production: 'prod123',
}

const ErpWorkflowContext = createContext<ErpWorkflowContextType | null>(null)

export function ErpWorkflowProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<Role>('manager')
  const [orders, setOrders] = useState<SmartOrder[]>(DEFAULT_ORDERS)
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS)
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(DEFAULT_INVOICES)
  const [inventory, setInventory] = useState<InventoryItem>(INITIAL_INVENTORY)

  // Load from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.orders) setOrders(parsed.orders)
        if (parsed.notifications) setNotifications(parsed.notifications)
        if (parsed.invoices) setInvoices(parsed.invoices)
        if (parsed.inventory) setInventory(parsed.inventory)
        if (parsed.activeRole) setActiveRole(parsed.activeRole)
      }
    } catch (e) {
      console.warn('Could not restore ERP workflow state', e)
    }
  }, [])

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ orders, notifications, invoices, inventory, activeRole })
      )
    } catch (e) {
      console.warn('Could not save ERP workflow state', e)
    }
  }, [orders, notifications, invoices, inventory, activeRole])

  const verifyRolePassword = (role: Role, passwordInput: string): boolean => {
    const valid = ROLE_PASSWORDS[role]
    return valid !== undefined && valid === passwordInput.trim()
  }

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id && !n.readBy.includes(activeRole)) {
          return { ...n, readBy: [...n.readBy, activeRole] }
        }
        return n
      })
    )
  }

  const createOrder = (data: { customer: string; itemName: string; orderedUnits: number; unitPrice: number }): SmartOrder => {
    const id = `ord-${Date.now().toString().slice(-4)}`
    const ref = `SO-${Math.floor(10000 + Math.random() * 90000)}`
    const totalAmount = data.orderedUnits * data.unitPrice

    const newOrder: SmartOrder = {
      id,
      reference: ref,
      customer: data.customer,
      date: new Date().toISOString().split('T')[0],
      itemName: data.itemName,
      orderedUnits: data.orderedUnits,
      unitPrice: data.unitPrice,
      totalAmount,
      stockAvailableAtOrder: inventory.finishedStock,
      rawMaterialMaxCapacity: inventory.rawUnitsCapacity,
      status: 'NEW_ORDER_AWAITING_DECISION',
    }

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Order Received: ${data.orderedUnits} ${data.itemName}`,
      message: `Order ${ref} for ${data.customer}. Current Stock: ${inventory.finishedStock}. Raw material capacity: ${inventory.rawUnitsCapacity}. Awaiting strategy decision.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetRoles: ['admin', 'manager'],
      readBy: [],
      type: 'order',
      priority: 'urgent',
      actionUrl: '/erp/sales',
    }

    setOrders((prev) => [newOrder, ...prev])
    setNotifications((prev) => [newNotif, ...prev])
    return newOrder
  }

  // Step 1: Decision by user / manager
  const submitOrderDecision = (orderId: string, decision: OrderDecision) => {
    const targetOrder = orders.find((o) => o.id === orderId)
    if (!targetOrder) return

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            decision,
            status: 'SENT_TO_PRODUCTION',
            decidedBy: activeRole.toUpperCase(),
            decidedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        }
        return o
      })
    )

    // Send notification to production guy
    const prodNotif: NotificationItem = {
      id: `notif-prod-${Date.now()}`,
      title: `Production Order Assigned: ${decision.makeFromRaw} Units to Build`,
      message: `Order ${targetOrder.reference} approved! Production directive: Use ${decision.useFromStock} from stock, produce ${decision.makeFromRaw} fresh units from raw materials.${decision.customExplanation ? ` Note: "${decision.customExplanation}"` : ''}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetRoles: ['production', 'admin'],
      readBy: [],
      type: 'production',
      priority: 'urgent',
      actionUrl: '/erp/production',
    }

    setNotifications((prev) => [prodNotif, ...prev])
  }

  // Step 2: Production guy accepts order -> automatically minuses from raw material and stock
  const acceptProductionJob = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId)
    if (!targetOrder || !targetOrder.decision) return

    const { useFromStock, makeFromRaw } = targetOrder.decision

    // Deduct stock and raw materials
    setInventory((prev) => {
      const updatedFinishedStock = Math.max(0, prev.finishedStock - useFromStock)
      const updatedRawUnitsCapacity = Math.max(0, prev.rawUnitsCapacity - makeFromRaw)
      const updatedRawMaterials = prev.rawMaterials.map((rm) => ({
        ...rm,
        currentStock: Math.max(0, rm.currentStock - makeFromRaw * rm.unitsPerMotor),
      }))

      return {
        ...prev,
        finishedStock: updatedFinishedStock,
        rawUnitsCapacity: updatedRawUnitsCapacity,
        rawMaterials: updatedRawMaterials,
      }
    })

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'IN_PRODUCTION',
              acceptedByProductionAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : o
      )
    )

    const notif: NotificationItem = {
      id: `notif-accept-${Date.now()}`,
      title: `Production Commenced: Order ${targetOrder.reference}`,
      message: `Production floor accepted order. Automatically deducted ${useFromStock} finished units from warehouse and materials for ${makeFromRaw} units from raw inventory.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetRoles: ['admin', 'manager', 'production'],
      readBy: [],
      type: 'production',
      priority: 'normal',
    }

    setNotifications((prev) => [notif, ...prev])
  }

  // Step 3: Production guy completes order -> sends notification to HR, Manager, Admin, and Finance person (CA)
  const completeProductionJob = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId)
    if (!targetOrder) return

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'PRODUCTION_COMPLETED_AWAITING_APPROVAL',
              completedByProductionAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : o
      )
    )

    // Notification to HR, Manager, Admin, and Finance (CA)
    const completionNotif: NotificationItem = {
      id: `notif-complete-${Date.now()}`,
      title: `Production Completed for ${targetOrder.reference}`,
      message: `Production team has manufactured and assembled all units for Order ${targetOrder.reference} (${targetOrder.customer}). Awaiting Manager Approval to finalize and issue Invoice.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetRoles: ['hr', 'manager', 'admin', 'finance'],
      readBy: [],
      type: 'approval',
      priority: 'urgent',
      actionUrl: '/erp/sales',
    }

    setNotifications((prev) => [completionNotif, ...prev])
  }

  // Step 4: Manager approves -> automatically generates bill and invoice, saves invoice
  const managerApproveAndInvoice = (orderId: string): InvoiceRecord => {
    const targetOrder = orders.find((o) => o.id === orderId)
    if (!targetOrder) throw new Error('Order not found')

    const invoiceId = `inv-${Date.now().toString().slice(-4)}`
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    
    const subtotal = targetOrder.totalAmount
    const taxRate = 0.10
    const taxAmount = subtotal * taxRate
    const grandTotal = subtotal + taxAmount

    const newInvoice: InvoiceRecord = {
      id: invoiceId,
      invoiceNumber,
      orderId: targetOrder.id,
      orderRef: targetOrder.reference,
      customer: targetOrder.customer,
      date: new Date().toISOString().split('T')[0],
      items: [
        {
          description: targetOrder.itemName,
          quantity: targetOrder.orderedUnits,
          unitPrice: targetOrder.unitPrice,
          total: subtotal,
        }
      ],
      subtotal,
      taxRate,
      taxAmount,
      grandTotal,
      status: 'ISSUED',
      generatedBy: 'Manager Approval Engine',
    }

    setInvoices((prev) => [newInvoice, ...prev])

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'APPROVED_INVOICED',
              invoiceId,
              approvedByManagerAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : o
      )
    )

    // Notification to Finance (CA), Admin, HR and Customer
    const invoiceNotif: NotificationItem = {
      id: `notif-inv-${Date.now()}`,
      title: `Invoice Generated: ${invoiceNumber} ($${grandTotal.toLocaleString()})`,
      message: `Manager approved Order ${targetOrder.reference}. Official tax invoice generated and secured in the Vault. CA/Finance ledger updated.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetRoles: ['finance', 'admin', 'hr', 'manager'],
      readBy: [],
      type: 'invoice',
      priority: 'high',
      actionUrl: '/erp/finance',
    }

    setNotifications((prev) => [invoiceNotif, ...prev])

    return newInvoice
  }

  const resetWorkflowDemo = () => {
    setInventory(INITIAL_INVENTORY)
    setOrders(DEFAULT_ORDERS)
    setNotifications(DEFAULT_NOTIFICATIONS)
    setInvoices(DEFAULT_INVOICES)
    setActiveRole('manager')
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <ErpWorkflowContext.Provider
      value={{
        activeRole,
        setActiveRole,
        orders,
        notifications,
        invoices,
        inventory,
        createOrder,
        submitOrderDecision,
        acceptProductionJob,
        completeProductionJob,
        managerApproveAndInvoice,
        markNotificationRead,
        resetWorkflowDemo,
        verifyRolePassword,
      }}
    >
      {children}
    </ErpWorkflowContext.Provider>
  )
}

export function useErpWorkflow() {
  const context = useContext(ErpWorkflowContext)
  if (!context) {
    throw new Error('useErpWorkflow must be used within an ErpWorkflowProvider')
  }
  return context
}
