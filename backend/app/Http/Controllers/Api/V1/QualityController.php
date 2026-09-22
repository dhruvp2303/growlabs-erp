<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\QualityInspection;
use Illuminate\Http\JsonResponse;

class QualityController extends BaseApiController
{
    public function getInspections(): JsonResponse
    {
        $inspections = QualityInspection::with('product')->get()->map(function ($q) {
            return [
                'id' => $q->id,
                'reference' => $q->reference,
                'product' => $q->product?->name ?? 'Assembly Line Inspection',
                'passed' => $q->passed_units,
                'failed' => $q->failed_units,
                'rate' => (float) $q->pass_rate,
                'status' => $q->status,
            ];
        });

        return $this->success($inspections);
    }
}
