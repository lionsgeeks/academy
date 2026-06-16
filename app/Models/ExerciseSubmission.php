<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'exercise_id', 'code_text', 'submission_url', 'status', 'feedback', 'submitted_at', 'reviewed_at'])]
class ExerciseSubmission extends Model
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }
}
