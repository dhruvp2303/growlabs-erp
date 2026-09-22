<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Warehouse;
use App\Models\StockItem;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class InventoryService
{
    /**
     * Ingest new stock into a warehouse and log an immutable stock movement.
     */
    public function receiveStock(string $productId, string $warehouseId, int $quantity, string $referenceType = null, string $referenceId = null, string $notes = null): StockItem
    {
        if ($quantity <= 0) {
            throw new InvalidArgumentException('Quantity must be greater than zero.');
        }

        return DB::transaction(function () use ($productId, $warehouseId, $quantity, $referenceType, $referenceId, $notes) {
            $stockItem = StockItem::firstOrCreate(
                ['product_id' => $productId, 'warehouse_id' => $warehouseId],
                ['physical_quantity' => 0, 'reserved_quantity' => 0, 'blocked_quantity' => 0]
            );

            $stockItem->increment('physical_quantity', $quantity);

            StockMovement::create([
                'product_id' => $productId,
                'warehouse_id' => $warehouseId,
                'movement_type' => 'inbound_po',
                'quantity_delta' => $quantity,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'performed_by' => auth()->id(),
                'notes' => $notes ?? 'Goods received into inventory warehouse.',
            ]);

            return $stockItem->fresh();
        });
    }

    /**
     * Reserve inventory for an outstanding sales order.
     */
    public function reserveStock(string $productId, string $warehouseId, int $quantity): StockItem
    {
        return DB::transaction(function () use ($productId, $warehouseId, $quantity) {
            $stockItem = StockItem::where('product_id', $productId)
                ->where('warehouse_id', $warehouseId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($stockItem->available_quantity < $quantity) {
                throw new InvalidArgumentException("Insufficient available stock to reserve {$quantity} units.");
            }

            $stockItem->increment('reserved_quantity', $quantity);

            return $stockItem->fresh();
        });
    }

    /**
     * Adjust physical stock level manually.
     */
    public function adjustStock(string $productId, string $warehouseId, int $newPhysicalQuantity, string $notes = null): StockItem
    {
        return DB::transaction(function () use ($productId, $warehouseId, $newPhysicalQuantity, $notes) {
            $stockItem = StockItem::firstOrCreate(
                ['product_id' => $productId, 'warehouse_id' => $warehouseId],
                ['physical_quantity' => 0, 'reserved_quantity' => 0, 'blocked_quantity' => 0]
            );

            $delta = $newPhysicalQuantity - $stockItem->physical_quantity;
            $stockItem->physical_quantity = $newPhysicalQuantity;
            $stockItem->save();

            StockMovement::create([
                'product_id' => $productId,
                'warehouse_id' => $warehouseId,
                'movement_type' => 'adjustment',
                'quantity_delta' => $delta,
                'performed_by' => auth()->id(),
                'notes' => $notes ?? 'Manual inventory physical audit adjustment.',
            ]);

            return $stockItem->fresh();
        });
    }
}
