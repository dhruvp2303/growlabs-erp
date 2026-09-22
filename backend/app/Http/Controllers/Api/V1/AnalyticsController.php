<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Product;
use App\Models\SalesOrder;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends BaseApiController
{
    public function getDashboardSummary(): JsonResponse
    {
        return $this->success([
            'totalRevenue' => 312000.00,
            'totalOrders' => SalesOrder::count(),
            'activeProduction' => 4,
            'warehouseCount' => 3,
            'aiAlertsCount' => 6,
        ]);
    }

    public function getStockValueTrend(): JsonResponse
    {
        return $this->success([
            ['month' => 'Jan', 'value' => 840000],
            ['month' => 'Feb', 'value' => 920000],
            ['month' => 'Mar', 'value' => 990000],
            ['month' => 'Apr', 'value' => 1050000],
            ['month' => 'May', 'value' => 1120000],
            ['month' => 'Jun', 'value' => 1240000],
            ['month' => 'Jul', 'value' => 1380000],
            ['month' => 'Aug', 'value' => 1420000],
        ]);
    }

    public function getSalesByProduct(): JsonResponse
    {
        return $this->success([
            ['name' => 'Water Pump Motor 4200', 'value' => 142000],
            ['name' => 'Motor Controller 880', 'value' => 98000],
            ['name' => 'Industrial Pump X1500', 'value' => 72000],
        ]);
    }
}
