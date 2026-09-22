<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Product;
use App\Models\Warehouse;
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends BaseApiController
{
    public function __construct(protected InventoryService $inventoryService)
    {
    }

    public function getProducts(): JsonResponse
    {
        $products = Product::with('stockItems.warehouse')->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'sku' => $p->sku,
                'name' => $p->name,
                'category' => $p->category,
                'stock' => $p->total_physical_stock,
                'allocated' => (int) $p->stockItems()->sum('reserved_quantity'),
                'safetyStock' => $p->safety_stock_threshold,
                'unitPrice' => (float) $p->unit_price,
                'warehouse' => $p->stockItems()->first()?->warehouse?->name ?? 'Dallas DC',
                'status' => $p->total_physical_stock <= $p->safety_stock_threshold ? 'low-stock' : 'in-stock',
            ];
        });

        return $this->success($products);
    }

    public function getWarehouses(): JsonResponse
    {
        $warehouses = Warehouse::with('stockItems.product')->get()->map(function ($w) {
            return [
                'id' => $w->id,
                'code' => $w->code,
                'name' => $w->name,
                'location' => $w->location,
                'capacityLimit' => $w->capacity_limit,
                'currentStock' => (int) $w->stockItems()->sum('physical_quantity'),
                'utilization' => round(($w->stockItems()->sum('physical_quantity') / ($w->capacity_limit ?: 10000)) * 100),
            ];
        });

        return $this->success($warehouses);
    }

    public function adjustStock(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|uuid',
            'warehouse_id' => 'required|uuid',
            'quantity' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $item = $this->inventoryService->adjustStock(
            $validated['product_id'],
            $validated['warehouse_id'],
            $validated['quantity'],
            $validated['notes']
        );

        return $this->success($item, 'Stock level successfully adjusted and logged in movement ledger');
    }
}
