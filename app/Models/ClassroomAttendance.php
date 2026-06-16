<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['classroom_session_id', 'user_id', 'joined_at', 'left_at', 'duration_seconds', 'leave_reason', 'metadata'])]
class ClassroomAttendance extends Model
{
    protected $table = 'classroom_attendance';

    public function session(): BelongsTo
    {
        return $this->belongsTo(ClassroomSession::class, 'classroom_session_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'joined_at' => 'datetime',
            'left_at' => 'datetime',
            'metadata' => 'array',
        ];
    }
}
