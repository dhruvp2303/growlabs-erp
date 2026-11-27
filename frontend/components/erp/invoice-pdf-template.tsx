'use client'

import React from 'react'
import { InvoiceRecord } from '@/lib/workflow/erp-workflow-provider'

interface PrintableInvoiceProps {
  invoice: InvoiceRecord
  companyInfo?: {
    name: string
    addressLine1: string
    addressLine2: string
    cityStateZip: string
    country: string
  }
  billTo?: {
    name: string
    addressLine1: string
    cityStateZip: string
  }
  shipTo?: {
    name?: string
    addressLine1: string
    cityStateZip: string
  }
}

export function generateInvoiceHtml(
  invoice: InvoiceRecord,
  companyInfo = {
    name: 'Zylker Electronics Hub',
    addressLine1: '14B, Northern Street',
    addressLine2: 'Greater South Avenue',
    cityStateZip: 'New York New York 10001',
    country: 'U.S.A'
  },
  billTo = {
    name: invoice.customer || 'Ms. Mary D. Dunton',
    addressLine1: '1324 Hinkle Lake Road',
    cityStateZip: '02192 Maine'
  },
  shipTo = {
    addressLine1: '1324 Hinkle Lake Road',
    cityStateZip: '02192 Maine'
  }
) {
  const terms = 'Due on Receipt'
  const taxPercent = (invoice.taxRate * 100).toFixed(2) + '%'
  const balanceDue = invoice.grandTotal

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${invoice.invoiceNumber}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      background: #f1f5f9;
      padding: 30px 15px;
      color: #0f172a;
      display: flex;
      justify-content: center;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice-card {
      width: 100%;
      max-width: 820px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 40px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      position: relative;
    }
    /* Top geometric color accent in upper right */
    .top-accent {
      position: absolute;
      top: 15px;
      right: 25px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .poly {
      width: 16px;
      height: 16px;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      opacity: 0.85;
    }
    .p-cyan { background: #06b6d4; }
    .p-blue { background: #0284c7; }
    .p-navy { background: #003366; }
    .p-light { background: #93c5fd; }
    .p-purple { background: #c084fc; }

    /* Header Section */
    .header-box {
      border: 1.5px solid #0f172a;
      border-bottom: none;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .company-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .company-details {
      font-size: 11.5px;
      color: #334155;
      line-height: 1.45;
    }
    .invoice-word {
      font-size: 38px;
      font-weight: 600;
      color: #1d4ed8;
      letter-spacing: 2px;
      margin-top: 18px;
    }

    /* Meta Table */
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #0f172a;
      border-bottom: none;
    }
    .meta-table td {
      border: 1.5px solid #0f172a;
      padding: 7px 12px;
      font-size: 11.5px;
      vertical-align: middle;
    }
    .meta-left {
      width: 52%;
    }
    .meta-right {
      width: 48%;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .meta-row:last-child {
      margin-bottom: 0;
    }
    .meta-label {
      font-weight: 600;
      color: #334155;
      width: 110px;
    }
    .meta-val {
      font-weight: 700;
      color: #0f172a;
      flex: 1;
    }

    /* Bill To / Ship To Header */
    .address-section {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #0f172a;
      border-bottom: none;
    }
    .address-section th {
      border: 1.5px solid #0f172a;
      background: #ffffff;
      text-align: left;
      padding: 6px 12px;
      font-size: 11.5px;
      font-weight: 800;
      color: #0f172a;
    }
    .address-section td {
      border: 1.5px solid #0f172a;
      padding: 10px 12px;
      font-size: 11.5px;
      vertical-align: top;
      line-height: 1.45;
      width: 50%;
    }
    .client-name {
      font-weight: 800;
      font-size: 12.5px;
      color: #0f172a;
      margin-bottom: 2px;
    }

    /* Line Items Table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #0f172a;
    }
    .items-table th {
      background: #003366;
      color: #ffffff;
      padding: 9px 12px;
      font-size: 12px;
      font-weight: 700;
      border-right: 1px solid #1e40af;
      text-align: left;
    }
    .items-table th:last-child {
      border-right: none;
    }
    .items-table td {
      border: 1px solid #cbd5e1;
      border-top: none;
      border-bottom: 1px solid #cbd5e1;
      padding: 10px 12px;
      font-size: 12px;
      vertical-align: top;
    }
    .col-hash { width: 35px; text-align: center; }
    .col-desc { }
    .col-qty { width: 75px; text-align: center; }
    .col-rate { width: 110px; text-align: right; }
    .col-amount { width: 130px; text-align: right; }

    .item-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .item-sub {
      font-size: 11px;
      color: #64748b;
    }

    /* Sub Total Bar */
    .subtotal-row {
      border: 1.5px solid #0f172a;
      border-top: none;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background: #ffffff;
    }
    .subtotal-label {
      padding: 8px 18px;
      font-weight: 800;
      font-size: 12.5px;
      color: #0f172a;
      border-left: 1.5px solid #0f172a;
      width: 110px;
      text-align: center;
    }
    .subtotal-amount {
      padding: 8px 16px;
      font-weight: 700;
      font-size: 12.5px;
      color: #0f172a;
      border-left: 1.5px solid #0f172a;
      width: 130px;
      text-align: right;
    }

    /* Footer Split: Notes on left, Totals box on right */
    .footer-split {
      display: flex;
      border: 1.5px solid #0f172a;
      border-top: none;
    }
    .footer-notes {
      flex: 1;
      padding: 18px 14px;
      display: flex;
      flex-col;
      justify-content: space-between;
      font-size: 11px;
      line-height: 1.45;
    }
    .thanks-msg {
      font-weight: 600;
      color: #334155;
      margin-bottom: 24px;
    }
    .terms-title {
      font-weight: 700;
      color: #334155;
      margin-bottom: 2px;
    }
    .terms-text {
      color: #64748b;
      font-size: 10px;
      max-width: 320px;
    }

    /* Blue shaded summary box */
    .totals-box {
      width: 240px;
      border-left: 1.5px solid #0f172a;
      background: #bfdbfe;
    }
    .tot-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 12px;
      font-size: 12px;
      border-bottom: 1px solid #93c5fd;
    }
    .tot-row:last-child {
      border-bottom: none;
    }
    .tot-label {
      font-weight: 700;
      color: #0f172a;
    }
    .tot-val {
      font-weight: 800;
      color: #0f172a;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .invoice-card {
        border: none;
        box-shadow: none;
        padding: 0;
        width: 100%;
        max-width: 100%;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-card" id="invoice-print-area">
    <!-- Top Geometric Accent -->
    <div class="top-accent">
      <div class="poly p-purple"></div>
      <div class="poly p-light"></div>
      <div class="poly p-cyan"></div>
      <div class="poly p-blue"></div>
      <div class="poly p-navy"></div>
    </div>

    <!-- Company Header -->
    <div class="header-box">
      <div>
        <h1 class="company-title">${companyInfo.name}</h1>
        <div class="company-details">
          ${companyInfo.addressLine1}<br/>
          ${companyInfo.addressLine2}<br/>
          ${companyInfo.cityStateZip}<br/>
          ${companyInfo.country}
        </div>
      </div>
      <div>
        <div class="invoice-word">INVOICE</div>
      </div>
    </div>

    <!-- Meta Details Grid -->
    <table class="meta-table">
      <tr>
        <td class="meta-left">
          <div class="meta-row">
            <span class="meta-label">Invoice#</span>
            <span class="meta-val">: ${invoice.invoiceNumber}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Invoice Date</span>
            <span class="meta-val">: ${invoice.date}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Terms</span>
            <span class="meta-val">: ${terms}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Due Date</span>
            <span class="meta-val">: ${invoice.date}</span>
          </div>
        </td>
        <td class="meta-right">
          <!-- Blank right meta cell as per reference image -->
        </td>
      </tr>
    </table>

    <!-- Bill To / Ship To -->
    <table class="address-section">
      <thead>
        <tr>
          <th>Bill To</th>
          <th>Ship To</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="client-name">${billTo.name}</div>
            <div>${billTo.addressLine1}</div>
            <div>${billTo.cityStateZip}</div>
          </td>
          <td>
            <div>${shipTo.addressLine1}</div>
            <div>Needham</div>
            <div>${shipTo.cityStateZip}</div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th class="col-hash">#</th>
          <th class="col-desc">Item &amp; Description</th>
          <th class="col-qty">Qty</th>
          <th class="col-rate">Rate</th>
          <th class="col-amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items.map((it, idx) => `
          <tr>
            <td class="col-hash">${idx + 1}</td>
            <td class="col-desc">
              <div class="item-title">${it.description}</div>
              <div class="item-sub">Industrial grade motor assembly with automated quality inspection</div>
            </td>
            <td class="col-qty">
              <div>${it.quantity.toFixed(2)}</div>
              <div class="item-sub">Piece</div>
            </td>
            <td class="col-rate">$${it.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td class="col-amount">$${it.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Sub Total Row -->
    <div class="subtotal-row">
      <div class="subtotal-label">Sub Total</div>
      <div class="subtotal-amount">$${invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>

    <!-- Footer Split -->
    <div class="footer-split">
      <div class="footer-notes">
        <div>
          <div class="thanks-msg">Thanks for your business.</div>
        </div>
        <div>
          <div class="terms-title">Terms &amp; Conditions</div>
          <div class="terms-text">
            Full payment is due upon receipt of this invoice. Late payments may incur additional charges or interest as per the applicable laws.
          </div>
        </div>
      </div>

      <div class="totals-box">
        <div class="tot-row">
          <span class="tot-label">Tax Rate</span>
          <span class="tot-val">${taxPercent}</span>
        </div>
        <div class="tot-row">
          <span class="tot-label">Total</span>
          <span class="tot-val">$${invoice.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="tot-row">
          <span class="tot-label">Balance Due</span>
          <span class="tot-val">$${balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
}

export function downloadInvoiceAsPdf(invoice: InvoiceRecord) {
  const htmlContent = generateInvoiceHtml(invoice)
  
  // Create a printable iframe/window for seamless Save-As-PDF or direct Print
  const printWindow = window.open('', '_blank', 'width=900,height=1000')
  if (printWindow) {
    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Automatically trigger Print/Save as PDF after styles load
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 450)
  }
}
