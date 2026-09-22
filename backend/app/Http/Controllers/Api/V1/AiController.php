<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\AiAlert;
use App\Models\Approval;
use App\Services\AIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiController extends BaseApiController
{
    public function __construct(protected AIService $aiService)
    {
    }

    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'prompt' => 'required|string|max:1000',
        ]);

        $response = $this->aiService->query($validated['prompt']);

        return $this->success($response);
    }

    public function getAlerts(): JsonResponse
    {
        $alerts = AiAlert::where('is_resolved', false)->get()->map(function ($a) {
            return [
                'id' => $a->id,
                'title' => $a->title,
                'module' => $a->module,
                'severity' => $a->severity,
                'what' => $a->what,
                'why' => $a->why,
                'recommendation' => $a->recommendation,
                'action' => $a->action_label,
                'time' => $a->created_at?->diffForHumans() ?? 'Just now',
            ];
        });

        return $this->success($alerts);
    }

    public function getApprovals(): JsonResponse
    {
        $approvals = Approval::where('status', 'pending')->get()->map(function ($ap) {
            return [
                'id' => $ap->id,
                'type' => $ap->type,
                'requester' => $ap->requester_name,
                'reason' => $ap->reason,
                'amount' => (float) $ap->amount,
                'aiRecommendation' => $ap->ai_verdict,
            ];
        });

        return $this->success($approvals);
    }
}
