<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Company;
use App\Models\Product;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_company_a_cannot_view_company_b_products(): void
    {
        // 1. Company A & User A
        $companyA = Company::create(['name' => 'Company A', 'slug' => 'company-a']);
        $userA = User::create([
            'name' => 'User A',
            'email' => 'userA@test.com',
            'password' => bcrypt('password'),
            'current_company_id' => $companyA->id,
        ]);
        $companyA->users()->attach($userA->id);

        $productA = Product::create([
            'company_id' => $companyA->id,
            'sku' => 'PROD-A',
            'name' => 'Proprietary Rotor A',
        ]);

        // 2. Company B & User B
        $companyB = Company::create(['name' => 'Company B', 'slug' => 'company-b']);
        $userB = User::create([
            'name' => 'User B',
            'email' => 'userB@test.com',
            'password' => bcrypt('password'),
            'current_company_id' => $companyB->id,
        ]);
        $companyB->users()->attach($userB->id);

        $productB = Product::create([
            'company_id' => $companyB->id,
            'sku' => 'PROD-B',
            'name' => 'Confidential Turbine B',
        ]);

        // Act as User A
        Sanctum::actingAs($userA);

        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200);
        $skus = collect($response->json('data'))->pluck('sku')->toArray();

        $this->assertContains('PROD-A', $skus);
        $this->assertNotContains('PROD-B', $skus);
    }
}
