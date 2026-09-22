<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Shipment;
use Illuminate\Http\JsonResponse;

class LogisticsController extends BaseApiController
{
    public function getShipments(): JsonResponse
    {
        $shipments = Shipment::all()->map(function ($s) {
            return [
                'id' => $s->id,
                'reference' => $s->reference,
                'customer' => $s->customer_name,
                'carrier' => $s->carrier,
                'origin' => $s->origin,
                'destination' => $s->destination,
                'progress' => $s->progress_percentage,
                'eta' => $s->eta?->toDateString() ?? now()->addDays(3)->toDateString(),
                'status' => $s->status,
            ];
        });

        return $this->success($shipments);
    }
}
