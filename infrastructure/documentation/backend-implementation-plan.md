# GrowLabs — Backend Implementation Plan & Engineering Architecture

## 1. System Overview & Core Tenets

GrowLabs is an AI-powered personalized ERP SaaS platform engineered with Laravel 11, PHP 8.2+, PostgreSQL 16, Redis 7, and Next.js 16. The backend provides a secure, versioned (`/api/v1`), multi-tenant REST API with clean separation of concerns:

- **Controller Layer**: Handles HTTP requests, calls form requests, invokes domain services, returns structured API resources.
- **Service Layer**: Encapsulates 100% of domain business logic, transactional stock movements, smart fulfillment algorithms, and rule evaluations.
- **Data Access Layer**: Eloquent models with global `TenantScope` for company-level isolation.
- **Event & Queue Architecture**: Asynchronous event listeners and Redis-backed queue jobs for forecasting, notifications, and AI computations.

---

## 2. Directory Hierarchy

```text
GrowLabs/
├── frontend/                     # Next.js 16 SPA Frontend
│   ├── app/                      # Route groups (onboarding, erp, dashboard)
│   ├── components/               # UI and ERP component libraries
│   ├── lib/
│   │   ├── services/             # Centralized TypeScript API Client
│   │   └── format.ts             # Formatting utilities
│   └── package.json
│
├── backend/                      # Laravel 11 REST API Application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/V1/
│   │   │   ├── Middleware/       # TenantContext, EnsureCompanyActive
│   │   │   ├── Requests/V1/      # Validation Form Requests
│   │   │   └── Resources/V1/     # JSON API Transformers
│   │   ├── Models/               # Scoped Eloquent Domain Models
│   │   ├── Services/             # Domain Services (Inventory, Sales, BOM, AI)
│   │   ├── Scopes/               # TenantScope
│   │   ├── Events/               # Domain Events
│   │   ├── Listeners/            # Asynchronous Event Listeners
│   │   └── Jobs/                 # Queueable Jobs
│   ├── database/
│   │   ├── migrations/           # 20+ Normalized Domain Migrations
│   │   └── seeders/              # Realistic PrimeFlow Manufacturing Seeders
│   └── routes/
│       └── api.php               # Versioned API routes (/api/v1)
│
└── infrastructure/               # Infrastructure & Architecture Documentation
    ├── docker/                   # Docker Compose & Dockerfiles
    ├── documentation/            # Architecture Specs & Schemas
    └── scripts/                  # Setup & Database Seeding Scripts
```

---

## 3. Multi-Tenancy & Security Strategy

1. **Company Isolation (`company_id`)**: Every tenant-owned table contains an indexed `company_id` foreign key referencing `companies.id`.
2. **Global Tenant Scope**:
   ```php
   class TenantScope implements Scope
   {
       public function apply(Builder $builder, Model $model): void
       {
           if (auth()->check() && auth()->user()->current_company_id) {
               $builder->where($model->getTable() . '.company_id', auth()->user()->current_company_id);
           }
       }
   }
   ```
3. **Database Integrity**: Cascade rules and strict foreign key integrity prevents orphaned data.

---

## 4. Prioritized Execution Sequence

- **P0 — Infrastructure**: Laravel setup, environment configs, base API resource controllers, Docker compose.
- **P1 — Authentication & RBAC**: Sanctum token authentication, users, roles, permissions, multi-tenant company switching.
- **P2 & P3 — Onboarding & Personalization**: Dynamic questionnaires, requirement analyzer, deterministic module recommendation rules engine, feature activation with dependency validation.
- **P4 — Products, Warehouses & Ledger-Based Inventory**: SKU management, multi-warehouse stock movements, reservations, adjustments, and safety reorder thresholds.
- **P5 — Sales & Smart Fulfillment**: Quotations, sales orders, and the multi-step diagnostic Smart Order Fulfillment engine.
- **P6 — Procurement**: Suppliers directory, lead time / quality rating scores, purchase orders, goods receiving ledger updates.
- **P7 — Manufacturing & BOM**: Bill of Materials hierarchy, manufacturing orders, work centers, material consumption transactions.
- **P8 — Quality & Logistics**: QC inspection audits, defect non-conformance logs, shipment route milestone tracking.
- **P9 & P10 — Finance & HR**: Invoices, payments, expense records, employee attendance, and leave management.
- **P11 & P12 — AI Copilot & Business Intelligence**: Structured AI response contracts (`INFORMATION`, `RECOMMENDATION`, `ACTION`, `APPROVAL REQUIRED`) with secure validation barriers.
- **P13 — Central Analytics & Frontend Client Integration**: Real API client connection replacing mock stores while preserving 100% of frontend UI/UX aesthetics.
