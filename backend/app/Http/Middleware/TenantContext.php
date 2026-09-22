<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantContext
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->current_company_id) {
            // Default to user's first company if not explicitly selected
            $company = $user->companies()->first();
            if ($company) {
                $user->current_company_id = $company->id;
                $user->save();
            }
        }

        // Allow overriding tenant context via X-Company-ID header if user belongs to it
        if ($request->hasHeader('X-Company-ID') && $user) {
            $companyId = $request->header('X-Company-ID');
            if ($user->companies()->where('companies.id', $companyId)->exists()) {
                $user->current_company_id = $companyId;
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized company context requested',
                ], 403);
            }
        }

        return $next($request);
    }
}
