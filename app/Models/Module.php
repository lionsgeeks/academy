<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['course_id', 'title', 'description', 'order_index'])]
class Module extends Model
{
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class);
    }
}
