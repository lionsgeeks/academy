<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\Topic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ExerciseController extends Controller
{
    public function store(Request $request, Topic $topic): RedirectResponse
    {
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
            'difficulty' => ['required', 'string', Rule::in([
                'beginner',
                'intermediate',
                'advanced',
            ])],
            'xp_reward' => ['required', 'integer', 'min:0', 'max:1000000'],
            'order_index' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('exercises', 'order_index')
                    ->where(fn($query) => $query->where('topic_id', $topic->id)),
            ],
            'correction_engine' => ['required', 'string', Rule::in([
                'browser',
                'github_actions',
            ])],
            'exercise_type' => ['required', 'string', 'max:100'],
            'correction_rules' => ['nullable', 'array'],
            'status' => ['required', 'string', Rule::in([
                'draft',
                'published',
            ])],
            'promotion_ids' => ['nullable', 'array'],
            'promotion_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('promotions', 'id'),
            ],
        ]);

        $validator->after(function ($validator) use ($request, $course): void {
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

            $promotionIds = collect($request->input('promotion_ids', []))
                ->map(fn($promotionId) => (int) $promotionId)
                ->unique()
                ->values();

            if (
                $request->string('status')->toString() === 'published'
                && $promotionIds->isEmpty()
            ) {
                $validator->errors()->add(
                    'promotion_ids',
                    'A published exercise must target at least one eligible promotion.',
                );

                return;
            }

            if ($promotionIds->isEmpty()) {
                return;
            }

            $eligiblePromotionIds = $course
                ->publishablePromotions()
                ->whereKey($promotionIds)
                ->pluck('promotions.id')
                ->map(fn($promotionId) => (int) $promotionId)
                ->values();

            if (
                $eligiblePromotionIds->count() !== $promotionIds->count()
            ) {
                $validator->errors()->add(
                    'promotion_ids',
                    'Every selected promotion must be active and assigned to this course.',
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

        $exercise->promotions()->sync($data['promotion_ids'] ?? []);

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
