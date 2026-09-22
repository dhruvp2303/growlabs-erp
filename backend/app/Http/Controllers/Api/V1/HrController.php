<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Employee;
use App\Models\Department;
use Illuminate\Http\JsonResponse;

class HrController extends BaseApiController
{
    public function getEmployees(): JsonResponse
    {
        $employees = Employee::all()->map(function ($e) {
            return [
                'id' => $e->id,
                'name' => $e->name,
                'role' => $e->role,
                'department' => $e->department,
                'attendance' => (float) $e->attendance_percentage,
                'status' => $e->status,
            ];
        });

        return $this->success($employees);
    }

    public function getDepartments(): JsonResponse
    {
        $departments = Department::all()->map(function ($d) {
            return [
                'id' => $d->id,
                'name' => $d->name,
                'headcount' => $d->headcount,
                'openRoles' => $d->open_roles,
            ];
        });

        return $this->success($departments);
    }
}
