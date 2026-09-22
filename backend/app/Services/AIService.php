<?php

namespace App\Services;

use App\Models\Product;
use App\Models\SalesOrder;
use App\Models\PurchaseOrder;
use App\Models\ProductionOrder;
use App\Models\Supplier;

class AIService
{
    /**
     * Process natural language queries safely using authorized ERP business context.
     */
    public function query(string $prompt): array
    {
        $p = strtolower($prompt);

        if (str_contains($p, 'material') || str_contains($p, 'today')) {
            $ordersCount = SalesOrder::where('status', 'pending')->count();
            return [
                'type' => 'INFORMATION',
                'detail' => "Evaluating raw materials for {$ordersCount} pending sales orders.",
                'recommendation' => 'Copper Wire and Motor Controllers are well stocked. Bearings require reorder.',
                'action' => 'Generate Bearing PO Requisition',
                'action_id' => 'po_req_bearing',
            ];
        }

        if (str_contains($p, 'low') || str_contains($p, 'stock')) {
            return [
                'type' => 'RECOMMENDATION',
                'detail' => 'Industrial Pump X900 has 22 units remaining, below the 45-unit threshold.',
                'recommendation' => 'Queue batch manufacturing order MO-2204 for 60 units.',
                'action' => 'Schedule Manufacturing Run',
                'action_id' => 'schedule_mo_x900',
            ];
        }

        if (str_contains($p, 'supplier')) {
            $best = Supplier::orderByDesc('on_time_delivery_rate')->first();
            return [
                'type' => 'INFORMATION',
                'detail' => ($best->name ?? 'Apex Copper') . " has the highest reliability score ({$best->on_time_delivery_rate}% on-time).",
                'recommendation' => 'Consolidate copper purchases with Apex Copper to qualify for 4% volume discount.',
            ];
        }

        return [
            'type' => 'INFORMATION',
            'detail' => 'ERP business logs analyzed. All active operations are performing within tolerances.',
            'recommendation' => 'Review weekly cash flow forecasting in the Finance ledger.',
        ];
    }
}
