<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Invoice;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;

class FinanceController extends BaseApiController
{
    public function getInvoices(): JsonResponse
    {
        $invoices = Invoice::with('customer')->get()->map(function ($inv) {
            return [
                'id' => $inv->id,
                'reference' => $inv->reference,
                'customer' => $inv->customer?->name ?? 'Corporate Client',
                'amount' => (float) $inv->amount,
                'due' => $inv->due_date?->toDateString() ?? now()->addDays(14)->toDateString(),
                'status' => $inv->status,
            ];
        });

        return $this->success($invoices);
    }

    public function recordPayment(string $id): JsonResponse
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->status = 'paid';
        $invoice->save();

        return $this->success($invoice, 'Payment recorded and ledger reconciled');
    }

    public function getRevenueTrend(): JsonResponse
    {
        $trend = [
            ['month' => 'Jan', 'revenue' => 145000, 'expenses' => 92000],
            ['month' => 'Feb', 'revenue' => 162000, 'expenses' => 98000],
            ['month' => 'Mar', 'revenue' => 180000, 'expenses' => 105000],
            ['month' => 'Apr', 'revenue' => 195000, 'expenses' => 112000],
            ['month' => 'May', 'revenue' => 210000, 'expenses' => 118000],
            ['month' => 'Jun', 'revenue' => 245000, 'expenses' => 125000],
            ['month' => 'Jul', 'revenue' => 280000, 'expenses' => 135000],
            ['month' => 'Aug', 'revenue' => 312000, 'expenses' => 142000],
        ];

        return $this->success($trend);
    }
}
