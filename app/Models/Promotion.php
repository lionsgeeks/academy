<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'description', 'status', 'starts_at', 'ends_at'])]
class Promotion extends Model
{
    public function coursePromotions(): HasMany
    {
        return $this->hasMany(CoursePromotion::class);
    }

    public function promotionStudents(): HasMany
    {
        return $this->hasMany(PromotionStudent::class);
    }

    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_promotions')
            ->withPivot(['status', 'starts_at', 'ends_at'])
            ->withTimestamps();
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'promotion_students')
            ->withPivot(['status', 'joined_at', 'left_at'])
            ->withTimestamps();
    }

    protected function casts(): array
    {
        return [
            'starts_at' => 'date',
            'ends_at' => 'date',
        ];
    }
}
