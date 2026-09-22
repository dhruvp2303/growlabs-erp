<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_create_company_workspace(): void
    {
        $payload = [
            'name' => 'Alex Morgan',
            'email' => 'alex@aeromfg.com',
            'password' => 'SecurePass123!',
            'company_name' => 'Aero Manufacturing Corp',
            'industry' => 'Aerospace',
            'company_size' => '51-200',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user' => ['id', 'name', 'email'],
                    'company' => ['id', 'name'],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('companies', ['name' => 'Aero Manufacturing Corp']);
        $this->assertDatabaseHas('users', ['email' => 'alex@aeromfg.com']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $company = Company::create(['name' => 'Test Company', 'slug' => 'test-co']);
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'john@test.com',
            'password' => bcrypt('password123'),
            'current_company_id' => $company->id,
        ]);
        $company->users()->attach($user->id);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'john@test.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['token', 'user', 'company'],
            ]);
    }
}
