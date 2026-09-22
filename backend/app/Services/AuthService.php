<?php

namespace App\Services;

use App\Models\Company;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Register a new company and owner user account.
     */
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            // 1. Create company
            $company = Company::create([
                'name' => $data['company_name'],
                'industry' => $data['industry'] ?? 'Manufacturing',
                'company_size' => $data['company_size'] ?? '51-200',
                'currency' => $data['currency'] ?? 'USD',
            ]);

            // 2. Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'current_company_id' => $company->id,
            ]);

            // 3. Attach user to company
            $company->users()->attach($user->id);

            // 4. Create Owner Role with all permissions
            $role = Role::create([
                'company_id' => $company->id,
                'name' => 'Owner',
                'display_name' => 'Company Owner',
                'description' => 'Superuser administrator with full access to company ERP modules.',
            ]);

            // Attach all available permissions
            $permissions = Permission::all();
            $role->permissions()->attach($permissions->pluck('id'));

            // Assign role to user
            DB::table('user_roles')->insert([
                'user_id' => $user->id,
                'role_id' => $role->id,
                'company_id' => $company->id,
            ]);

            // Generate token
            $token = $user->createToken('growlabs_auth_token')->plainTextToken;

            return [
                'user' => $user,
                'company' => $company,
                'token' => $token,
            ];
        });
    }

    /**
     * Authenticate an existing user and return a Sanctum access token.
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $company = $user->currentCompany ?? $user->companies()->first();
        if ($company && $user->current_company_id !== $company->id) {
            $user->current_company_id = $company->id;
            $user->save();
        }

        $token = $user->createToken('growlabs_auth_token')->plainTextToken;

        return [
            'user' => $user,
            'company' => $company,
            'token' => $token,
        ];
    }
}
