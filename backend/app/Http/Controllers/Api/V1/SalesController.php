<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\SalesOrder;
use App\Models\Customer;
use App\Services\SmartOrderFulfillmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalesController extends BaseApiController
{
    public function __construct(protected SmartOrderFulfillmentService $fulfillmentService)
    {
    }

    public function getOrders(): JsonResponse
    {
        $orders = SalesOrder::with(['customer', 'items.product'])->get()->map(function ($o) {
            $item = $o->items->first();
            return [
                'id' => $o->id,
                'reference' => $o->reference,
                'customer' => $o->customer?->name ?? 'Enterprise Client',
                'product' => $item?->product?->name ?? 'Water Pump Motor 4200',
                'units' => $item?->quantity ?? 100,
                'amount' => (float) $o->total_amount,
                'status' => $o->status,
                'fulfillment' => $o->fulfillment_percentage,
                'date' => $o->order_date->toDateString(),
            ];
        });

        return $this->success($orders);
    }

    public function getCustomers(): JsonResponse
    {
        $customers = Customer::withCount('salesOrders')->get()->map(function ($c) {
            return [
                'id' => $c->id,
                'name' => $c->name,
                'segment' => $c->segment,
                'location' => $c->location,
                'lifetimeValue' => (float) $c->credit_limit * 1.5,
                'openOrders' => $c->sales_orders_count,
                'status' => $c->status,
            ];
        });

        return $this->success($customers);
    }

    public function fulfillCheck(string $id): JsonResponse
    {
        $order = SalesOrder::with('items.product')->findOrFail($id);
        $diagnostic = $this->fulfillmentService->diagnose($order);

        return $this->success($diagnostic);
    }
}
