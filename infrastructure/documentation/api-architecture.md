# GrowLabs — REST API Architecture Specification (/api/v1)

All endpoints conform to standard JSON:API conventions, return predictable envelope structures, enforce Bearer Token authentication via Laravel Sanctum, and validate request payloads with dedicated FormRequests.

---

## 1. Global Response Envelope

### Standard Success Response (200 / 201)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "99b9cf9c-5353-4882-965a-0d234a9ef1c9",
    "reference": "SO-10482",
    "status": "pending"
  },
  "meta": {
    "timestamp": "2026-08-30T13:20:00Z",
    "version": "v1"
  }
}
```

### Paginated List Response (200)
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 48
  }
}
```

### Validation Error Response (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "sku": ["The SKU field has already been taken."],
    "quantity": ["The quantity must be greater than zero."]
  }
}
```

---

## 2. API Endpoint Matrix

### Authentication & Tenant Context
- `POST /api/v1/auth/register` — Creates user, company, default roles, assigns owner.
- `POST /api/v1/auth/login` — Returns Sanctum personal access token + user/company profile.
- `GET /api/v1/auth/me` — Current authenticated user, company, and permissions array.
- `POST /api/v1/auth/logout` — Revokes active token.
- `POST /api/v1/auth/switch-company` — Switches current tenant workspace context.

### Business Onboarding & Personalization
- `GET /api/v1/onboarding/questions` — Returns step-by-step discovery questions (industry-aware).
- `POST /api/v1/onboarding/answers` — Saves discovery questionnaire step answers.
- `POST /api/v1/onboarding/recommendations` — Runs deterministic recommendation engine on requirements.
- `POST /api/v1/onboarding/activate-modules` — Validates dependencies and activates selected ERP modules.

### Products & Inventory
- `GET /api/v1/products` — List catalog products with safety stock and category filters.
- `POST /api/v1/products` — Create new product SKU.
- `GET /api/v1/inventory/warehouses` — Multi-warehouse capacity and stock balances.
- `POST /api/v1/inventory/adjust` — Create stock adjustment movement ledger record.
- `POST /api/v1/inventory/transfer` — Transfer stock between warehouses.

### Sales & Smart Order Fulfillment
- `GET /api/v1/sales/orders` — Paginated list of sales orders with customer and status filtering.
- `POST /api/v1/sales/orders` — Create new sales order.
- `POST /api/v1/sales/orders/{id}/fulfill-check` — Runs 5-step Smart Order Fulfillment simulator:
  - Finished goods inventory check
  - Active reservation conflicts
  - BOM raw material availability
  - Plant scheduling queues
  - Supplier procurement lead times
  - Output: Verdict, missing materials, estimated ship date.

### Procurement & Suppliers
- `GET /api/v1/procurement/suppliers` — Supplier directory with lead times and quality ratings.
- `GET /api/v1/procurement/purchase-orders` — Purchase orders list.
- `POST /api/v1/procurement/purchase-orders/{id}/approve` — Authorize PO transmission.
- `POST /api/v1/procurement/purchase-orders/{id}/receive` — Ingest goods into warehouse and update stock movement ledger.

### Manufacturing & Quality
- `GET /api/v1/production/orders` — Production orders with timeline stage status.
- `POST /api/v1/production/orders/{id}/advance-stage` — Advance order through workflow stages.
- `GET /api/v1/production/bom/{productId}` — Returns active BOM breakdown and part requirements.
- `GET /api/v1/quality/inspections` — Quality inspection audits with pass/fail statistics.

### Finance, HR & Logistics
- `GET /api/v1/finance/invoices` — Invoices with payment reconciliation statuses.
- `GET /api/v1/finance/cash-flow` — Monthly revenue vs expenditure aggregates for Recharts.
- `GET /api/v1/hr/employees` — Staff directory with attendance logs.
- `GET /api/v1/logistics/shipments` — Cargo shipments with route milestone tracker.

### AI Copilot & Alerts
- `POST /api/v1/ai/chat` — Context-aware business queries returning structured cards (`INFORMATION`, `RECOMMENDATION`, `ACTION`, `APPROVAL REQUIRED`).
- `GET /api/v1/ai/alerts` — Operations anomaly alerts (stockouts, production delays, supplier lead risks).
- `GET /api/v1/ai/approvals` — Centralized approval inbox for POs, discounts, and leaves.
