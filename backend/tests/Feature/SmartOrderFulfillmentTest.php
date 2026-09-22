<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Company;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Customer;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\BillOfMaterial;
use App\Models\BomItem;
use App\Models\StockItem;
use App\Services\SmartOrderFulfillmentService;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SmartOrderFulfillmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_smart_order_fulfillment_diagnoses_material_shortage(): void
    {
        $company = Company::create(['name' => 'Acme Corp', 'slug' => 'acme']);
        $user = User::create([
            'name' => 'Admin User',
            'email' => 'admin@acme.com',
            'password' => bcrypt('password'),
            'current_company_id' => $company->id,
        ]);
        $company->users()->attach($user->id);

        $warehouse = Warehouse::create(['company_id' => $company->id, 'code' => 'W1', 'name' => 'Central Hub']);

        // Finished Product
        $pump = Product::create(['company_id' => $company->id, 'sku' => 'PUMP-100', 'name' => 'Water Pump 100']);
        // Finished Stock: 20 units
        StockItem::create(['company_id' => $company->id, 'warehouse_id' => $warehouse->id, 'product_id' => $pump->id, 'physical_quantity' => 20]);

        // Raw Material Steel
        $steel = Product::create(['company_id' => $company->id, 'sku' => 'STEEL-01', 'name' => 'Steel Plate', 'type' => 'raw_material']);
        // Raw Stock: 10 units (deficit)
        StockItem::create(['company_id' => $company->id, 'warehouse_id' => $warehouse->id, 'product_id' => $steel->id, 'physical_quantity' => 10]);

        // BOM requires 2 steel per pump
        $bom = BillOfMaterial::create(['company_id' => $company->id, 'product_id' => $pump->id]);
        BomItem::create(['bom_id' => $bom->id, 'raw_material_product_id' => $steel->id, 'quantity_required' => 2.0, 'unit_of_measure' => 'plates']);

        // Customer Order for 50 pumps
        $customer = Customer::create(['company_id' => $company->id, 'name' => 'Client X']);
        $so = SalesOrder::create(['company_id' => $company->id, 'reference' => 'SO-TEST-1', 'customer_id' => $customer->id, 'order_date' => now(), 'total_amount' => 10000]);
        SalesOrderItem::create(['sales_order_id' => $so->id, 'product_id' => $pump->id, 'quantity' => 50, 'unit_price' => 200, 'subtotal' => 10000]);

        $service = new SmartOrderFulfillmentService();
        $result = $service->diagnose($so);

        $this->assertEquals(20, $result['fulfilled_immediately']);
        $this->assertEquals(30, $result['production_required']);
        $this->assertNotEmpty($result['material_shortages']);
        $this->assertEquals('Medium', $result['risk_level']);
    }
}
