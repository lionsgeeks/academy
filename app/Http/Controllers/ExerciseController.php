<?php

namespace App\Http\Controllers;


use App\Models\Topic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Services\Exercises\ExerciseClassEligibilityService;

class ExerciseController extends Controller
{
    public function store(
        Request $request,
        Topic $topic,
        ExerciseClassEligibilityService $classEligibility,
    ): RedirectResponse {
        $coach = $this->ensureCanManageExercises($request);

        $topic->loadMissing('concept.course');

        $course = $topic->concept?->course;

        abort_unless(
            $course && (int) $course->created_by === (int) $coach->id,
            403,
        );

        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            'difficulty' => [
                'required',
                'string',
                Rule::in([
                    'beginner',
                    'intermediate',
                    'advanced',
                ]),
            ],

            'xp_reward' => ['required', 'integer', 'min:0', 'max:1000000'],

            'order_index' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('exercises', 'order_index')
                    ->where(fn($query) => $query->where(
                        'topic_id',
                        $topic->id,
                    )),
            ],

            'correction_engine' => [
                'required',
                'string',
                Rule::in([
                    'browser',
                    'github_actions',
                ]),
            ],

            'exercise_type' => ['required', 'string', 'max:100'],

            'correction_rules' => ['nullable', 'array'],

            'status' => [
                'required',
                'string',
                Rule::in([
                    'draft',
                    'published',
                ]),
            ],

            'class_ids' => ['nullable', 'array'],

            'class_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('classes', 'id'),
            ],
        ]);

        $validator->after(function ($validator) use ($request, $coach, $classEligibility,): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $allowedTypes = [
                'browser' => [
                    'html',
                    'css',
                    'javascript',
                    'html_css_javascript',
                ],
                'github_actions' => [
                    'laravel',
                    'react',
                ],
            ];

            $engine = $request->string('correction_engine')->toString();
            $exerciseType = $request->string('exercise_type')->toString();

            if (! in_array($exerciseType, $allowedTypes[$engine] ?? [], true)) {
                $validator->errors()->add(
                    'exercise_type',
                    'The selected exercise type is not supported by this correction engine.',
                );

                return;
            }

            if (
                $engine === 'browser'
                && ! is_array($request->input('correction_rules'))
            ) {
                $validator->errors()->add(
                    'correction_rules',
                    'Browser exercises require correction rules.',
                );

                return;
            }

            $classIds = collect($request->input('class_ids', []))
                ->map(fn($classId) => (int) $classId)
                ->unique()
                ->values();

            if (
                $request->string('status')->toString() === 'published'
                && $classIds->isEmpty()
            ) {
                $validator->errors()->add(
                    'class_ids',
                    'A published exercise must target at least one current class.',
                );

                return;
            }

            if ($classIds->isEmpty()) {
                return;
            }

            $eligibleClassIds = $classEligibility
                ->currentClassIdsFor($coach)
                ->intersect($classIds)
                ->values();

            if ($eligibleClassIds->count() !== $classIds->count()) {
                $validator->errors()->add(
                    'class_ids',
                    'Every selected class must be running, from the current promo, and assigned to you.',
                );
            }
        });

        $data = $validator->validate();

        $exercise = $topic->exercises()->create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'difficulty' => $data['difficulty'],
            'xp_reward' => $data['xp_reward'],
            'order_index' => $data['order_index'],
            'correction_engine' => $data['correction_engine'],
            'exercise_type' => $data['exercise_type'],
            'correction_rules' => $data['correction_rules'] ?? null,
            'status' => $data['status'],
            'passing_score' => 70,
            'published_at' => $data['status'] === 'published'
                ? now()
                : null,
        ]);

        $exercise->classes()->sync($data['class_ids'] ?? []);

        return back()->with('success', 'Exercise saved successfully.');
    }





    private function ensureCanManageExercises(Request $request)
    {
        $user = $request->user();

        abort_unless(
            $user
                && $user->Roles()
                ->whereIn('role', ['admin', 'coach', 'super_admin'])
                ->exists(),
            403,
        );

        return $user;
    }
}
