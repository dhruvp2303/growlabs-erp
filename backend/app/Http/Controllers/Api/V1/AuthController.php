<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends BaseApiController
{
    public function __construct(protected AuthService $authService)
    {
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'company_name' => 'required|string|max:255',
            'industry' => 'nullable|string|max:100',
            'company_size' => 'nullable|string|max:50',
        ]);

        $result = $this->authService->register($validated);

        return $this->success($result, 'Account and workspace successfully initialized', 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $result = $this->authService->login($validated['email'], $validated['password']);

        return $this->success($result, 'Authentication successful');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('currentCompany');
        $companies = $user->companies;

        return $this->success([
            'user' => $user,
            'current_company' => $user->currentCompany,
            'companies' => $companies,
            'permissions' => ['*'], // Full tenant permissions
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Successfully logged out');
    }
}
