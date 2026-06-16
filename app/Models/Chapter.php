<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['module_id', 'title', 'description', 'order_index'])]
class Chapter extends Model
{
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
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
}
