<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'exercise_id',
    'user_id',
    'attempt_number',
    'status',
    'source_type',
    'source_path',
    'source_code',
    'repository_url',
    'branch',
    'commit_sha',
    'score',
    'passed',
    'feedback',
    'failure_reason',
    'submitted_at',
    'started_at',
    'completed_at',
])]
class ExerciseAttempt extends Model
{
    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'source_code' => 'array',
            'passed' => 'boolean',
            'feedback' => 'array',
            'submitted_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }
}