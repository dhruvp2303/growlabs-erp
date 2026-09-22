<?php

namespace App\Services;

use App\Models\SalesOrder;
use App\Models\Product;
use App\Models\StockItem;
use App\Models\ProductionOrder;
use App\Models\Supplier;

class SmartOrderFulfillmentService
{
    /**
     * Run the 5-step Smart Order Fulfillment diagnosis on a sales order.
     */
    public function diagnose(SalesOrder $order): array
    {
        $firstItem = $order->items()->first();
        $product = $firstItem ? $firstItem->product : Product::first();
        $targetQty = $firstItem ? $firstItem->quantity : 100;

        // Step 1: Finished Stock check
        $physicalStock = (int) StockItem::where('product_id', $product->id)->sum('physical_quantity');
        $reservedStock = (int) StockItem::where('product_id', $product->id)->sum('reserved_quantity');
        $availableImmediate = max(0, $physicalStock - $reservedStock);

        $fulfilledImmediately = min($targetQty, $availableImmediate);
        $productionRequired = max(0, $targetQty - $fulfilledImmediately);

        // Step 2 & 3: BOM check & Raw Material Shortages
        $bom = $product->bom()->with('items.rawMaterial')->first();
        $materialShortages = [];
        $materialAvailabilityPercentage = 100;

        if ($bom && $productionRequired > 0) {
            $totalParts = count($bom->items);
            $availableParts = 0;

            foreach ($bom->items as $item) {
                $rawMat = $item->rawMaterial;
                $rawMatAvail = $rawMat ? $rawMat->total_available_stock : 0;
                $needed = $item->quantity_required * $productionRequired;

                if ($rawMatAvail >= $needed) {
                    $availableParts++;
                } else {
                    $materialShortages[] = [
                        'material_name' => $rawMat->name ?? 'Raw Material',
                        'sku' => $rawMat->sku ?? 'RAW-SKU',
                        'needed' => $needed,
                        'available' => $rawMatAvail,
                        'deficit' => $needed - $rawMatAvail,
                    ];
                }
            }

            $materialAvailabilityPercentage = $totalParts > 0 ? round(($availableParts / $totalParts) * 100) : 100;
        }

        // Step 4: Production Plant Queue Load
        $activePlantLoad = ProductionOrder::where('stage', 'production')->count();
        $plantQueueStatus = $activePlantLoad > 3 ? 'Heavy workload (85% capacity)' : 'Normal workload (55% capacity)';

        // Step 5: Supplier Procurement Lead Time
        $maxSupplierLeadDays = 0;
        if (!empty($materialShortages)) {
            $maxSupplierLeadDays = Supplier::max('lead_time_days') ?: 12;
        }

        // Estimated Completion
        $estimatedDays = 0;
        if ($productionRequired === 0) {
            $estimatedShipDate = now()->addDays(1)->toDateString();
            $verdict = 'Ready for Immediate Dispatch';
            $risk = 'Low';
        } elseif ($materialAvailabilityPercentage === 100) {
            $estimatedShipDate = now()->addDays(5)->toDateString();
            $verdict = 'Immediate Production Scheduled (BOM satisfied)';
            $risk = 'Low';
        } else {
            $estimatedDays = $maxSupplierLeadDays + 6;
            $estimatedShipDate = now()->addDays($estimatedDays)->toDateString();
            $verdict = "Material Shortage: Requires PO procurement ({$maxSupplierLeadDays} days supplier lead time)";
            $risk = 'Medium';
        }

        return [
            'order_reference' => $order->reference,
            'target_quantity' => $targetQty,
            'fulfilled_immediately' => $fulfilledImmediately,
            'production_required' => $productionRequired,
            'finished_stock_available' => $physicalStock,
            'reserved_stock' => $reservedStock,
            'material_availability_percentage' => $materialAvailabilityPercentage,
            'material_shortages' => $materialShortages,
            'plant_queue_status' => $plantQueueStatus,
            'estimated_ship_date' => $estimatedShipDate,
            'verdict' => $verdict,
            'risk_level' => $risk,
        ];
    }
}
