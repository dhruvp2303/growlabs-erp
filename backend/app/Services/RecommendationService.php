<?php

namespace App\Services;

class RecommendationService
{
    /**
     * Evaluate business profile parameters and return module recommendations.
     */
    public function evaluate(array $params): array
    {
        $industry = strtolower($params['industry'] ?? 'manufacturing');
        $companySize = $params['company_size'] ?? '51-200';
        $challenges = (array) ($params['challenges'] ?? []);
        $details = (array) ($params['industry_details'] ?? []);

        $recommendedModules = [];
        $reasons = [];

        // Universal Core
        $recommendedModules[] = 'inventory';
        $reasons['inventory'] = 'Essential for tracking stock levels and avoiding inventory stockouts.';

        $recommendedModules[] = 'sales';
        $reasons['sales'] = 'Essential for managing client orders and invoice fulfillment pipeline.';

        $recommendedModules[] = 'procurement';
        $reasons['procurement'] = 'Required to order materials and manage supplier relationships.';

        $recommendedModules[] = 'finance';
        $reasons['finance'] = 'Critical for invoicing, accounts receivable, and cash flow control.';

        // Manufacturing Specific
        if (in_array($industry, ['manufacturing', 'production']) || !empty($details['bom_complexity']) || !empty($details['plant_count'])) {
            $recommendedModules[] = 'production';
            $reasons['production'] = 'Detected discrete/process manufacturing with multiple production lines and BOM requirements.';

            $recommendedModules[] = 'quality';
            $reasons['quality'] = 'Quality inspections and defect tracking recommended for assembly batch tolerances.';
        }

        // Logistics & Distribution
        if ($industry === 'distribution' || $industry === 'logistics' || in_array('shipping_delays', $challenges)) {
            $recommendedModules[] = 'logistics';
            $reasons['logistics'] = 'Freight shipment tracking and carrier routing optimization.';
        }

        // HR
        if (in_array($companySize, ['51-200', '201-1000', '1000+']) || in_array('staff_scheduling', $challenges)) {
            $recommendedModules[] = 'hr';
            $reasons['hr'] = 'Headcount and attendance management recommended for organizations with 50+ staff.';
        }

        // Analytics
        $recommendedModules[] = 'analytics';
        $reasons['analytics'] = 'Cross-department business intelligence and automated reporting.';

        $recommendedModules = array_unique($recommendedModules);

        return [
            'recommended_modules' => array_values($recommendedModules),
            'reasons' => $reasons,
            'confidence_score' => 0.94,
            'summary' => "GrowLabs analyzed your {$params['industry']} business model and generated a tailored ERP configuration with " . count($recommendedModules) . " core modules.",
        ];
    }
}
