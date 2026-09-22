<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\OnboardingController;
use App\Http\Controllers\Api\V1\InventoryController;
use App\Http\Controllers\Api\V1\SalesController;
use App\Http\Controllers\Api\V1\ProcurementController;
use App\Http\Controllers\Api\V1\ProductionController;
use App\Http\Controllers\Api\V1\QualityController;
use App\Http\Controllers\Api\V1\FinanceController;
use App\Http\Controllers\Api\V1\HrController;
use App\Http\Controllers\Api\V1\LogisticsController;
use App\Http\Controllers\Api\V1\AiController;
use App\Http\Controllers\Api\V1\AnalyticsController;

Route::prefix('v1')->group(function () {

    // Public Authentication & Discovery
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::get('/onboarding/questions', [OnboardingController::class, 'getQuestions']);
    Route::post('/onboarding/recommendations', [OnboardingController::class, 'generateRecommendations']);

    // Protected Tenant API routes
    Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // ERP Personalization
        Route::post('/onboarding/activate-modules', [OnboardingController::class, 'activateModules']);

        // Inventory & Products
        Route::get('/products', [InventoryController::class, 'getProducts']);
        Route::get('/inventory/warehouses', [InventoryController::class, 'getWarehouses']);
        Route::post('/inventory/adjust', [InventoryController::class, 'adjustStock']);

        // Sales & Smart Order Fulfillment
        Route::get('/sales/orders', [SalesController::class, 'getOrders']);
        Route::get('/sales/customers', [SalesController::class, 'getCustomers']);
        Route::post('/sales/orders/{id}/fulfill-check', [SalesController::class, 'fulfillCheck']);

        // Procurement & Suppliers
        Route::get('/procurement/suppliers', [ProcurementController::class, 'getSuppliers']);
        Route::get('/procurement/purchase-orders', [ProcurementController::class, 'getPurchaseOrders']);
        Route::post('/procurement/purchase-orders/{id}/approve', [ProcurementController::class, 'approve']);

        // Manufacturing & BOM
        Route::get('/production/orders', [ProductionController::class, 'getOrders']);
        Route::post('/production/orders/{id}/advance-stage', [ProductionController::class, 'promoteStage']);

        // Quality Control
        Route::get('/quality/inspections', [QualityController::class, 'getInspections']);

        // Finance & Cash Flow
        Route::get('/finance/invoices', [FinanceController::class, 'getInvoices']);
        Route::post('/finance/invoices/{id}/pay', [FinanceController::class, 'recordPayment']);
        Route::get('/finance/revenue-trend', [FinanceController::class, 'getRevenueTrend']);

        // HR & Workforce
        Route::get('/hr/employees', [HrController::class, 'getEmployees']);
        Route::get('/hr/departments', [HrController::class, 'getDepartments']);

        // Logistics & Shipments
        Route::get('/logistics/shipments', [LogisticsController::class, 'getShipments']);

        // AI Copilot, Alerts & Approvals
        Route::post('/ai/chat', [AiController::class, 'chat']);
        Route::get('/ai/alerts', [AiController::class, 'getAlerts']);
        Route::get('/ai/approvals', [AiController::class, 'getApprovals']);

        // Analytics
        Route::get('/analytics/dashboard', [AnalyticsController::class, 'getDashboardSummary']);
        Route::get('/analytics/stock-trend', [AnalyticsController::class, 'getStockValueTrend']);
        Route::get('/analytics/sales-by-product', [AnalyticsController::class, 'getSalesByProduct']);
    });
});
