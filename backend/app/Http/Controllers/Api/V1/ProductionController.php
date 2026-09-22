<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\ProductionOrder;
use App\Models\BillOfMaterial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductionController extends BaseApiController
{
    public function getOrders(): JsonResponse
    {
        $orders = ProductionOrder::with('product')->get()->map(function ($po) {
            return [
                'id' => $po->id,
                'reference' => $po->reference,
                'product' => $po->product?->name ?? 'Assembly Unit',
                'qty' => $po->target_quantity,
                'plant' => $po->plant_location ?? 'Plant A',
                'stage' => $po->stage,
                'progress' => $po->progress_percentage,
                'due' => $po->due_date?->toDateString() ?? now()->addDays(7)->toDateString(),
            ];
        });

        return $this->success($orders);
    }

    public function promoteStage(string $id): JsonResponse
    {
        $stages = ['planned', 'material-ready', 'production', 'quality', 'completed'];
        $po = ProductionOrder::findOrFail($id);

        $currentIndex = array_search($po->stage, $stages);
        if ($currentIndex !== false && $currentIndex < count($stages) - 1) {
            $nextStage = $stages[$currentIndex + 1];
            $po->stage = $nextStage;
            $po->progress_percentage = $nextStage === 'completed' ? 100 : ($nextStage === 'quality' ? 90 : ($nextStage === 'production' ? 50 : 20));
            $po->save();
        }

        return $this->success($po, 'Production stage updated successfully');
    }
}
