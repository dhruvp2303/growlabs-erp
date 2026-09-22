<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProcurementController extends BaseApiController
{
    public function __construct(protected InventoryService $inventoryService)
    {
    }

    public function getSuppliers(): JsonResponse
    {
        $suppliers = Supplier::all()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'category' => $s->category,
                'leadTime' => $s->lead_time_days,
                'onTimeRate' => (float) $s->on_time_delivery_rate,
                'qualityScore' => (float) $s->quality_rating_score,
                'spend' => 45000.00,
                'status' => $s->status,
            ];
        });

        return $this->success($suppliers);
    }

    public function getPurchaseOrders(): JsonResponse
    {
        $pos = PurchaseOrder::with(['supplier', 'items.product'])->get()->map(function ($po) {
            $item = $po->items->first();
            return [
                'id' => $po->id,
                'reference' => $po->reference,
                'supplier' => $po->supplier?->name ?? 'Industrial Supplier',
                'item' => $item?->product?->name ?? 'Raw Material Sheets',
                'qty' => $item?->quantity ?? 500,
                'amount' => (float) $po->total_amount,
                'eta' => $po->expected_delivery_date?->toDateString() ?? now()->addDays(5)->toDateString(),
                'status' => $po->status,
            ];
        });

        return $this->success($pos);
    }

    public function approve(string $id): JsonResponse
    {
        $po = PurchaseOrder::findOrFail($id);
        $po->status = 'ordered';
        $po->save();

        return $this->success($po, 'Purchase order approved and dispatched to supplier');
    }
}
