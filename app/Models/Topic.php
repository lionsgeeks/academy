<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['concept_id', 'title', 'description', 'order_index'])]
class Topic extends Model
{
    public function concept(): BelongsTo
    {
        return $this->belongsTo(Concept::class);
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(Exercise::class);
    }

    public function resources(): HasMany
    {
        return $this->hasMany(TopicResource::class)->orderBy('order_index');
    }
}
