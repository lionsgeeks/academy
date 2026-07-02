<?php

namespace App\Http\Controllers;

use App\Models\Concept;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

    public function edit(Concept $concept)
    {
        $concept->load('topics.lessons');

        return Inertia::render('Concept', [
            'concept' => $concept,
            'topics' => $concept->topics,
        ]);
    }
}