'use client'

import React, { useState } from 'react'
import {
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle,
  FileText,
  DollarSign,
  Download,
  Calendar,
  Building,
  Printer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useErpWorkflow, Role, ROLE_PASSWORDS } from '@/lib/workflow/erp-workflow-provider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { downloadInvoiceAsPdf } from '@/components/erp/invoice-pdf-template'
import { toast } from 'sonner'

interface SecureInvoiceModalProps {
  open: boolean
  onClose: () => void
}

export function SecureInvoiceModal({ open, onClose }: SecureInvoiceModalProps) {
  const { invoices, orders, activeRole, verifyRolePassword } = useErpWorkflow()
  
  // Security Gate State
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<Role>(
    ['admin', 'manager', 'finance', 'hr'].includes(activeRole) ? activeRole : 'manager'
  )
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'invoices' | 'orders'>('invoices')
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  if (!open) return null

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    // Only Admin, HR, Manager, and CA (Finance) are permitted
    const permittedRoles: Role[] = ['admin', 'manager', 'finance', 'hr']
    if (!permittedRoles.includes(selectedRoleForLogin)) {
      setAuthError(`Role "${selectedRoleForLogin}" is not authorized to access Bills and Invoices.`)
      return
    }

    const isValid = verifyRolePassword(selectedRoleForLogin, passwordInput)
    if (isValid) {
      setIsUnlocked(true)
      toast.success(`Access Granted for ${selectedRoleForLogin.toUpperCase()}`, {
        description: 'Viewing cryptographic invoices and financial orders ledger.'
      })
    } else {
      setAuthError('Incorrect security key / password for this role.')
      toast.error('Authentication Failed: Access Denied.')
    }
  }

  const handlePrint = (inv: any) => {
    downloadInvoiceAsPdf(inv)
    toast.success(`Generated Official PDF for Invoice ${inv.invoiceNumber}`, {
      description: 'Zylker Hub format rendered with auto-download dialog.'
    })
  }

  const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl border border-primary/30 bg-card/95 shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/40 shadow-sm">
              {isUnlocked ? <Unlock className="size-5 text-success" /> : <Lock className="size-5 text-primary" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-foreground">
                  Secure Invoices & Order Billing Vault
                </h2>
                <Badge
                  variant={isUnlocked ? 'default' : 'outline'}
                  className={isUnlocked ? 'bg-success text-success-foreground' : 'text-amber-400 border-amber-400/40'}
                >
                  {isUnlocked ? 'SECURE VAULT UNLOCKED' : 'PROTECTED ACCESS'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Restricted access: Only authorized Admin, HR, Manager, and Finance (CA) are permitted.
              </p>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
            Close
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!isUnlocked ? (
            /* Security Challenge Gate */
            <div className="max-w-md mx-auto my-8 p-6 sm:p-8 rounded-3xl border border-border bg-background/80 shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex size-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 items-center justify-center mb-2">
                  <ShieldAlert className="size-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Password Authentication Required</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter credentials for your role. Permitted roles: <strong>Admin, Manager, Finance (CA), HR</strong>.
                </p>
              </div>

              {/* Quick credential hints for easy evaluation */}
              <div className="p-3 rounded-2xl border border-border bg-muted/30 text-[11px] space-y-1">
                <span className="font-semibold text-primary block">Official Credentials:</span>
                <div className="grid grid-cols-2 gap-1 font-mono text-muted-foreground">
                  <span>Manager: <code className="text-foreground">manager123</code></span>
                  <span>Finance/CA: <code className="text-foreground">finance123</code></span>
                  <span>Admin: <code className="text-foreground">admin123</code></span>
                  <span>HR: <code className="text-foreground">hr123</code></span>
                </div>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Select Your Authorized Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['manager', 'finance', 'admin', 'hr'] as Role[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRoleForLogin(r)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                          selectedRoleForLogin === r
                            ? 'border-primary bg-primary/15 text-primary shadow-sm'
                            : 'border-border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {r === 'finance' ? 'Finance (CA)' : r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Security Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={`Enter ${selectedRoleForLogin} password`}
                      className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <Button type="submit" className="w-full h-10 font-bold text-xs">
                  <KeyRound className="size-4 mr-2" />
                  Authenticate & Unlock Ledger
                </Button>
              </form>
            </div>
          ) : (
            /* Unlocked Content */
            <div className="space-y-6">
              {/* Tab navigation */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setActiveTab('invoices'); setSelectedInvoiceId(null); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'invoices'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    Official Invoices ({invoices.length})
                  </button>
                  <button
                    onClick={() => { setActiveTab('orders'); setSelectedInvoiceId(null); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'orders'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    Orders & Billing Status ({orders.length})
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UserCheck className="size-4 text-success" />
                  <span>Authenticated as: <strong>{selectedRoleForLogin.toUpperCase()}</strong></span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setIsUnlocked(false); setPasswordInput(''); }}
                    className="text-[11px] text-destructive h-7 ml-2"
                  >
                    Lock Vault
                  </Button>
                </div>
              </div>

              {/* Invoices List / Detail View */}
              {activeTab === 'invoices' && (
                <div>
                  {selectedInvoice ? (
                    /* Detailed Invoice View */
                    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl font-bold font-display text-primary">GrowLabs ERP</span>
                            <Badge variant="outline" className="text-[10px] font-mono">OFFICIAL TAX INVOICE</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">PrimeFlow Manufacturing Inc. • Autonomous Invoicing System</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <h3 className="text-lg font-bold text-foreground font-mono">{selectedInvoice.invoiceNumber}</h3>
                          <p className="text-xs text-muted-foreground">Date: {selectedInvoice.date}</p>
                          <Badge className="bg-success/20 text-success border-success/30 text-[10px] mt-1 font-bold">
                            {selectedInvoice.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Customer & Order Reference */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-border text-xs">
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-bold">Billed To Customer:</span>
                          <span className="text-sm font-semibold text-foreground">{selectedInvoice.customer}</span>
                          <p className="text-muted-foreground mt-0.5">Enterprise Client Account</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] uppercase font-bold">Source Order Reference:</span>
                          <span className="text-sm font-mono font-semibold text-primary">{selectedInvoice.orderRef}</span>
                          <p className="text-muted-foreground mt-0.5">Verified via Production Sign-off</p>
                        </div>
                      </div>

                      {/* Items Table */}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item & Description</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Line Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedInvoice.items.map((it, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-semibold text-foreground">{it.description}</TableCell>
                              <TableCell className="text-center font-mono">{it.quantity}</TableCell>
                              <TableCell className="text-right font-mono">${it.unitPrice.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-mono font-bold">${it.total.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Totals */}
                      <div className="flex flex-col items-end gap-1.5 pt-4 border-t border-border text-xs">
                        <div className="flex justify-between w-64 text-muted-foreground">
                          <span>Subtotal:</span>
                          <span className="font-mono">${selectedInvoice.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between w-64 text-muted-foreground">
                          <span>Sales Tax (10%):</span>
                          <span className="font-mono">${selectedInvoice.taxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between w-64 text-sm font-bold text-foreground pt-2 border-t border-border">
                          <span>Grand Total Due:</span>
                          <span className="font-mono text-primary">${selectedInvoice.grandTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <Button variant="outline" size="sm" onClick={() => setSelectedInvoiceId(null)}>
                          &larr; Back to Invoices List
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handlePrint(selectedInvoice)}>
                            <Printer className="size-4 mr-1.5" /> Print Invoice
                          </Button>
                          <Button size="sm" onClick={() => handlePrint(selectedInvoice)} className="font-bold bg-primary text-primary-foreground">
                            <Download className="size-4 mr-1.5" /> Download Invoice PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Invoices Table */
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Order Ref</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Grand Total</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.map((inv) => (
                            <TableRow key={inv.id}>
                              <TableCell className="font-mono font-bold text-primary">{inv.invoiceNumber}</TableCell>
                              <TableCell className="font-mono text-xs">{inv.orderRef}</TableCell>
                              <TableCell className="font-medium text-foreground">{inv.customer}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                              <TableCell className="text-right font-mono font-bold">${inv.grandTotal.toLocaleString()}</TableCell>
                              <TableCell className="text-center">
                                <Badge className="bg-success/15 text-success border-success/30 text-[10px]">
                                  {inv.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => setSelectedInvoiceId(inv.id)}
                                  >
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="text-xs h-7 font-bold bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
                                    onClick={() => handlePrint(inv)}
                                    title="Download as PDF"
                                  >
                                    <Download className="size-3 mr-1" /> PDF
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Ref</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Item & Units</TableHead>
                        <TableHead className="text-right">Order Value</TableHead>
                        <TableHead>Current Status</TableHead>
                        <TableHead className="text-right">Invoice Linked</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((ord) => (
                        <TableRow key={ord.id}>
                          <TableCell className="font-mono font-bold text-primary">{ord.reference}</TableCell>
                          <TableCell className="font-medium">{ord.customer}</TableCell>
                          <TableCell className="text-xs">
                            {ord.orderedUnits}x {ord.itemName}
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold">${ord.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                ord.status === 'APPROVED_INVOICED'
                                  ? 'bg-success/15 text-success border-success/30'
                                  : ord.status === 'PRODUCTION_COMPLETED_AWAITING_APPROVAL'
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : ord.status === 'IN_PRODUCTION'
                                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                  : 'bg-primary/15 text-primary border-primary/30'
                              }
                            >
                              {ord.status.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {ord.invoiceId ? (
                              <button
                                onClick={() => { setActiveTab('invoices'); setSelectedInvoiceId(ord.invoiceId!); }}
                                className="text-primary hover:underline font-semibold"
                              >
                                View Invoice &rarr;
                              </button>
                            ) : (
                              <span className="text-muted-foreground italic">Not yet billed</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
