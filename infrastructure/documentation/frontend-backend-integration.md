# GrowLabs — Frontend-Backend Integration Guide & API Client Architecture

## 1. Zero UI Degradation Guarantee

The existing Next.js 16 frontend is visually complete with all layouts, components, charts, and animations. The integration strategy preserves 100% of the UI design by mapping the mock data structures directly to the Laravel API JSON resources.

---

## 2. Centralized TypeScript API Client

We replace ad-hoc mock files with a centralized, typed API client located at `frontend/lib/services/api-client.ts`:

```typescript
// frontend/lib/services/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export class ApiClient {
  private static token: string | null = null;

  public static setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('growlabs_token', token);
      else localStorage.removeItem('growlabs_token');
    }
  }

  public static getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('growlabs_token');
    }
    return this.token;
  }

  public static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || 'An error occurred while communicating with GrowLabs API');
    }

    return json.data as T;
  }
}
```

---

## 3. Frontend Service Modules

Each ERP domain has a clean service module that interfaces with `ApiClient`:
- `lib/services/auth.ts`: Handles login, registration, and user token management.
- `lib/services/onboarding.ts`: Submits questionnaire answers and fetches recommendations.
- `lib/services/inventory.ts`: Fetches stock catalogs and warehouse balances.
- `lib/services/sales.ts`: Fetches orders, triggers Smart Fulfillment checks.
- `lib/services/procurement.ts`: Approves POs and fetches supplier ratings.
- `lib/services/production.ts`: Triggers assembly stage advancement and BOM checks.
- `lib/services/finance.ts`: Reconciles invoices and fetches cash flow aggregates.
- `lib/services/ai.ts`: Sends natural language queries to AI Copilot and fetches alerts/approvals.

---

## 4. Seamless Mock Fallback for Development

To ensure the frontend remains 100% resilient when the backend is starting up or under test, `lib/services/api.ts` transparently delegates to the real `ApiClient` while retaining seamless fallback to seeded mock data if the backend server is offline.
