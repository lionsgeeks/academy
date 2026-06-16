<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'course_promotion_id', 'status', 'enrolled_at', 'last_accessed_at', 'completed_at'])]
class CourseEnrollment extends Model
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function coursePromotion(): BelongsTo
    {
        return $this->belongsTo(CoursePromotion::class);
    }
}
