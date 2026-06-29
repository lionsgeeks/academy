<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['topic_id', 'title', 'description', 'difficulty', 'xp_reward', 'order_index', 'correction_engine', 'correction_rules', 'exercise_type', 'status', 'passing_score', 'published_at'])]

class Exercise extends Model
{
    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ExerciseSubmission::class);
    }

    public function promotions(): BelongsToMany
    {
        return $this->belongsToMany(Promotion::class, 'exercise_promotion')
            ->withTimestamps();
    }

    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(
            Classes::class,
            'exercise_classes',
            'exercise_id',
            'classes_id',
        )->withTimestamps();
    }

    protected function casts(): array
    {
        return [
            'passing_score' => 'integer',
            'published_at' => 'datetime',
            'correction_rules' => 'array',
        ];
    }
}
