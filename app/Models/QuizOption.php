<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['question_id', 'option_text', 'is_correct', 'order_index'])]
class QuizOption extends Model
{
    public function question(): BelongsTo
    {
        return $this->belongsTo(QuizQuestion::class, 'question_id');
    }
}
