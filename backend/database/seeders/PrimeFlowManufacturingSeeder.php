<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\ErpModule;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\StockItem;
use App\Models\StockMovement;
use App\Models\Customer;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\BillOfMaterial;
use App\Models\BomItem;
use App\Models\ProductionOrder;
use App\Models\QualityInspection;
use App\Models\Invoice;
use App\Models\Expense;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Shipment;
use App\Models\AiAlert;
use App\Models\Approval;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PrimeFlowManufacturingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Core Modules
        $modules = [
            ['id' => 'inventory', 'name' => 'Inventory Management', 'category' => 'Core', 'monthly_price' => 90.00],
            ['id' => 'sales', 'name' => 'Sales & CRM', 'category' => 'Core', 'monthly_price' => 70.00],
            ['id' => 'procurement', 'name' => 'Procurement', 'category' => 'Core', 'monthly_price' => 60.00],
            ['id' => 'production', 'name' => 'Production & Manufacturing', 'category' => 'Manufacturing', 'monthly_price' => 120.00],
            ['id' => 'quality', 'name' => 'Quality Control', 'category' => 'Manufacturing', 'monthly_price' => 70.00],
            ['id' => 'finance', 'name' => 'Finance & Accounting', 'category' => 'Core', 'monthly_price' => 80.00],
            ['id' => 'hr', 'name' => 'HR & Payroll', 'category' => 'Admin', 'monthly_price' => 60.00],
            ['id' => 'logistics', 'name' => 'Logistics & Shipping', 'category' => 'Operations', 'monthly_price' => 80.00],
            ['id' => 'analytics', 'name' => 'Analytics & Reporting', 'category' => 'Intelligence', 'monthly_price' => 50.00],
        ];

        foreach ($modules as $mod) {
            ErpModule::updateOrCreate(['id' => $mod['id']], $mod);
        }

        // 2. Create Company
        $company = Company::updateOrCreate(
            ['slug' => 'primeflow-mfg'],
            [
                'name' => 'PrimeFlow Manufacturing',
                'industry' => 'Manufacturing',
                'company_size' => '51-200',
                'business_model' => 'Discrete Assembly & Industrial Equipment',
                'currency' => 'USD',
            ]
        );

        // Attach all modules to company
        $company->modules()->sync(array_column($modules, 'id'));

        // 3. Create Demo User
        $user = User::updateOrCreate(
            ['email' => 'jordan@primeflow.io'],
            [
                'name' => 'Jordan Reyes',
                'password' => Hash::make('password123'),
                'current_company_id' => $company->id,
            ]
        );

        $company->users()->syncWithoutDetaching([$user->id]);

        // 4. Create Warehouses
        $dallas = Warehouse::create([
            'company_id' => $company->id,
            'code' => 'DAL-01',
            'name' => 'Dallas DC',
            'location' => 'Dallas, TX',
            'capacity_limit' => 12000,
        ]);

        $reno = Warehouse::create([
            'company_id' => $company->id,
            'code' => 'RNO-02',
            'name' => 'Reno DC',
            'location' => 'Reno, NV',
            'capacity_limit' => 8000,
        ]);

        // 5. Create Products & Raw Materials
        $motor = Product::create([
            'company_id' => $company->id,
            'sku' => 'WPM-4200',
            'name' => 'Water Pump Motor 4200',
            'type' => 'finished_goods',
            'category' => 'Finished Goods',
            'unit_price' => 640.00,
            'safety_stock_threshold' => 150,
        ]);

        $controller = Product::create([
            'company_id' => $company->id,
            'sku' => 'MCT-880',
            'name' => 'Motor Controller 880',
            'type' => 'finished_goods',
            'category' => 'Finished Goods',
            'unit_price' => 310.00,
            'safety_stock_threshold' => 80,
        ]);

        $copper = Product::create([
            'company_id' => $company->id,
            'sku' => 'CU-6MM',
            'name' => 'Copper Wire 6mm',
            'type' => 'raw_material',
            'category' => 'Raw Materials',
            'unit_cost' => 18.50,
            'safety_stock_threshold' => 2000,
        ]);

        $steel = Product::create([
            'company_id' => $company->id,
            'sku' => 'STL-A36',
            'name' => 'Steel Sheet A36',
            'type' => 'raw_material',
            'category' => 'Raw Materials',
            'unit_cost' => 110.00,
            'safety_stock_threshold' => 400,
        ]);

        $bearings = Product::create([
            'company_id' => $company->id,
            'sku' => 'BRG-32',
            'name' => 'Precision Bearing 32',
            'type' => 'raw_material',
            'category' => 'Raw Materials',
            'unit_cost' => 24.00,
            'safety_stock_threshold' => 500,
        ]);

        // 6. Stock Quantities
        StockItem::create(['company_id' => $company->id, 'warehouse_id' => $dallas->id, 'product_id' => $motor->id, 'physical_quantity' => 280, 'reserved_quantity' => 120]);
        StockItem::create(['company_id' => $company->id, 'warehouse_id' => $dallas->id, 'product_id' => $copper->id, 'physical_quantity' => 8200, 'reserved_quantity' => 0]);
        StockItem::create(['company_id' => $company->id, 'warehouse_id' => $dallas->id, 'product_id' => $steel->id, 'physical_quantity' => 640, 'reserved_quantity' => 0]);
        StockItem::create(['company_id' => $company->id, 'warehouse_id' => $reno->id, 'product_id' => $bearings->id, 'physical_quantity' => 210, 'reserved_quantity' => 0]);

        // 7. Bill of Materials
        $bom = BillOfMaterial::create(['company_id' => $company->id, 'product_id' => $motor->id, 'version' => 'v2.1']);
        BomItem::create(['bom_id' => $bom->id, 'raw_material_product_id' => $copper->id, 'quantity_required' => 40.0, 'unit_of_measure' => 'meters']);
        BomItem::create(['bom_id' => $bom->id, 'raw_material_product_id' => $steel->id, 'quantity_required' => 2.0, 'unit_of_measure' => 'sheets']);
        BomItem::create(['bom_id' => $bom->id, 'raw_material_product_id' => $bearings->id, 'quantity_required' => 2.0, 'unit_of_measure' => 'units']);

        // 8. Suppliers
        $apex = Supplier::create(['company_id' => $company->id, 'name' => 'Apex Copper & Alloys', 'category' => 'Raw Copper', 'lead_time_days' => 8, 'on_time_delivery_rate' => 96.0, 'quality_rating_score' => 98.0, 'status' => 'preferred']);
        $titan = Supplier::create(['company_id' => $company->id, 'name' => 'Titan Steel Supply', 'category' => 'Structural Steel', 'lead_time_days' => 12, 'on_time_delivery_rate' => 92.0, 'quality_rating_score' => 92.0, 'status' => 'approved']);

        // 9. Customers & Orders
        $meridian = Customer::create(['company_id' => $company->id, 'name' => 'Meridian Dynamics Inc.', 'segment' => 'Enterprise OEM', 'location' => 'Austin, TX', 'credit_limit' => 150000.00]);
        $so = SalesOrder::create(['company_id' => $company->id, 'reference' => 'SO-10482', 'customer_id' => $meridian->id, 'order_date' => now()->subDays(2), 'total_amount' => 64000.00, 'fulfillment_percentage' => 85, 'status' => 'processing']);
        SalesOrderItem::create(['sales_order_id' => $so->id, 'product_id' => $motor->id, 'quantity' => 100, 'unit_price' => 640.00, 'subtotal' => 64000.00]);

        // 10. Production Orders
        ProductionOrder::create(['company_id' => $company->id, 'reference' => 'MO-2201', 'product_id' => $motor->id, 'target_quantity' => 140, 'plant_location' => 'Plant A', 'stage' => 'production', 'progress_percentage' => 65, 'due_date' => now()->addDays(5)]);

        // 11. AI Alerts & Approvals
        AiAlert::create([
            'company_id' => $company->id,
            'title' => 'Critical Raw Material Shortage',
            'module' => 'Inventory',
            'severity' => 'critical',
            'what' => 'Precision Bearing 32 stock is down to 210 units (minimum buffer is 500).',
            'why' => 'Scheduled batch MO-2202 requires 240 units, risking a 4-day assembly delay.',
            'recommendation' => 'Approve pending purchase order PO-3390 with Precision Bearings Intl. immediately.',
            'action_label' => 'Approve PO-3390',
        ]);

        Approval::create([
            'company_id' => $company->id,
            'type' => 'Purchase Order',
            'requester_name' => 'Marcus Vance',
            'reason' => 'PO-3389: Titan Steel 800 sheets structural A36',
            'amount' => 26400.00,
            'ai_verdict' => 'AI Check: Clears raw material deficit for MO-2202 batch assembly.',
            'status' => 'pending',
        ]);
    }
}
