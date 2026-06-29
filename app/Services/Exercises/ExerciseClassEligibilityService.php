<?php

namespace App\Services\Exercises;

use App\Models\Classes;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Collection;

class ExerciseClassEligibilityService
{
    public function currentClassesFor(User $user): Collection
    {
        $runningClasses = Classes::query()
            ->whereNotNull('promo')
            ->whereNotNull('start_time')
            ->whereDate('start_time', '<=', today())
            ->whereNotNull('end_time')
            ->whereDate('end_time', '>=', today());

        $currentPromo = (clone $runningClasses)->max('promo');

        if ($currentPromo === null) {
            return collect();
        }

        $eligibleClasses = (clone $runningClasses)
            ->where('promo', $currentPromo);

        if (! $this->canTargetAnyCurrentClass($user)) {
            $coachRoleId = Role::query()
                ->where('role', 'coach')
                ->value('id');

            if (! $coachRoleId) {
                return collect();
            }

            $assignedClassIds = $user
                ->classes()
                ->wherePivot('role_id', $coachRoleId)
                ->pluck('classes.id');

            $eligibleClasses->whereIn('classes.id', $assignedClassIds);
        }

        return $eligibleClasses
            ->orderBy('type')
            ->orderBy('class')
            ->get([
                'classes.id',
                'classes.name',
                'classes.promo',
                'classes.type',
                'classes.class',
                'classes.start_time',
                'classes.end_time',
            ]);
    }

    public function currentClassIdsFor(User $user): Collection
    {
        return $this->currentClassesFor($user)
            ->pluck('id')
            ->map(fn ($classId) => (int) $classId)
            ->values();
    }

    private function canTargetAnyCurrentClass(User $user): bool
    {
        return $user
            ->Roles()
            ->whereIn('role', ['admin', 'super_admin'])
            ->exists();
    }
}