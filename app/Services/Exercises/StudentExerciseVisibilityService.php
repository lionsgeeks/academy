<?php

namespace App\Services\Exercises;

use App\Models\Exercise;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Collection;

class StudentExerciseVisibilityService
{
    public function visibleExercisesFor(User $student): Collection
    {
        $studentRoleId = Role::query()
            ->where('role', 'student')
            ->value('id');

        if (! $studentRoleId) {
            return collect();
        }

        $studentClassIds = $student
            ->classes()
            ->wherePivot('role_id', $studentRoleId)
            ->pluck('classes.id');

        if ($studentClassIds->isEmpty()) {
            return collect();
        }

        return Exercise::query()
            ->where('status', 'published')
            ->whereHas('classes', function ($query) use ($studentClassIds) {
                $query->whereIn('classes.id', $studentClassIds);
            })
            ->with([
                'topic.concept.course',
            ])
            ->orderBy('topic_id')
            ->orderBy('order_index')
            ->get();
    }
}