<?php

namespace App\Http\Controllers;

use App\Models\Concept;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Exercises\ExerciseClassEligibilityService;

class ConceptBuilderController extends Controller
{
    public function create()
    {
        return Inertia::render('Concept', [
            'concept' => null,
            'topics' => [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'topics' => ['nullable', 'array'],
        ]);

        $concept = Concept::create([
            'course_id' => $validated['course_id'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'order_index' => Concept::where('course_id', $validated['course_id'])->max('order_index') + 1,
        ]);

        return redirect()->route('concept.edit', $concept);
    }

    public function edit(
        Request $request,
        Concept $concept,
        ExerciseClassEligibilityService $classEligibility,
    ) {
        $concept->load([
            'topics.lessons',
            'topics.exercises' => fn($query) => $query
                ->select([
                    'id',
                    'topic_id',
                    'title',
                    'difficulty',
                    'xp_reward',
                    'correction_engine',
                    'exercise_type',
                    'status',
                    'order_index',
                ])
                ->orderBy('order_index'),
        ]);

        $publishableClasses = $classEligibility
            ->currentClassesFor($request->user())
            ->map(fn($classItem) => [
                'id' => $classItem->id,
                'name' => $classItem->name,
                'promo' => $classItem->promo,
                'type' => $classItem->type,
                'class' => $classItem->class,
            ])
            ->values();

        return Inertia::render('Concept', [
            'concept' => $concept,
            'topics' => $concept->topics,
            'publishableClasses' => $publishableClasses,
        ]);
    }
}
