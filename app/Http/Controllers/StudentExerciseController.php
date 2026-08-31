<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\User;
use App\Services\Exercises\StudentExerciseVisibilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentExerciseController extends Controller
{
    public function index(
        Request $request,
        StudentExerciseVisibilityService $exerciseVisibility,
    ): JsonResponse {
        $student = $this->ensureStudent($request);

        $exercises = $exerciseVisibility
            ->visibleExercisesFor($student)
            ->map(
                fn (Exercise $exercise): array => $this->exercisePayload($exercise),
            )
            ->values();

        return response()->json([
            'data' => $exercises,
        ]);
    }

    public function show(
        Request $request,
        Exercise $exercise,
        StudentExerciseVisibilityService $exerciseVisibility,
    ): JsonResponse {
        $student = $this->ensureStudent($request);

        $visibleExercise = $exerciseVisibility
            ->visibleExerciseFor($student, $exercise);

        abort_unless($visibleExercise, 404);

        return response()->json([
            'data' => $this->exercisePayload($visibleExercise),
        ]);
    }

    private function ensureStudent(Request $request): User
    {
        $student = $request->user();

        abort_unless(
            $student
            && $student->Roles()
                ->where('role', 'student')
                ->exists(),
            403,
        );

        return $student;
    }

    private function exercisePayload(Exercise $exercise): array
    {
        return [
            'id' => $exercise->id,
            'title' => $exercise->title,
            'description' => $exercise->description,
            'difficulty' => $exercise->difficulty,
            'xp_reward' => $exercise->xp_reward,
            'correction_engine' => $exercise->correction_engine,
            'exercise_type' => $exercise->exercise_type,
            'passing_score' => $exercise->passing_score,
            'visibility' => 'published_for_student',
            'assigned_to_student' => true,

            'topic' => [
                'id' => $exercise->topic->id,
                'title' => $exercise->topic->title,

                'concept' => [
                    'id' => $exercise->topic->concept->id,
                    'title' => $exercise->topic->concept->title,

                    'course' => [
                        'id' => $exercise->topic->concept->course->id,
                        'title' => $exercise->topic->concept->course->title,
                        'slug' => $exercise->topic->concept->course->slug,
                    ],
                ],
            ],
        ];
    }
}