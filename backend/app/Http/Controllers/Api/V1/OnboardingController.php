<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\RecommendationService;
use App\Models\ErpModule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OnboardingController extends BaseApiController
{
    public function __construct(protected RecommendationService $recommendationService)
    {
    }

    public function getQuestions(Request $request): JsonResponse
    {
        $industry = $request->query('industry', 'manufacturing');

        $questions = [
            [
                'step' => 1,
                'title' => 'Industry Specifications',
                'description' => 'Help us understand your specialized operations requirements.',
                'industry' => $industry,
            ],
            [
                'step' => 2,
                'title' => 'Operational Challenges',
                'description' => 'Select the operational bottlenecks currently slowing down business velocity.',
            ],
            [
                'step' => 3,
                'title' => 'Business Priorities',
                'description' => 'What are your company’s top goals for the next 12 months?',
            ],
        ];

        return $this->success($questions);
    }

    public function generateRecommendations(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'industry' => 'nullable|string',
            'company_size' => 'nullable|string',
            'challenges' => 'nullable|array',
            'industry_details' => 'nullable|array',
        ]);

        $recommendations = $this->recommendationService->evaluate($validated);

        return $this->success($recommendations);
    }

    public function activateModules(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'modules' => 'required|array',
            'modules.*' => 'string',
        ]);

        $company = $request->user()->currentCompany;
        if ($company) {
            $company->modules()->sync($validated['modules']);
        }

        return $this->success([
            'active_modules' => $validated['modules'],
        ], 'ERP modules successfully configured and activated');
    }
}
