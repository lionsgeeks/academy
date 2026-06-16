<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['host_id', 'external_course_id', 'external_group_id', 'title', 'description', 'jitsi_room_name', 'status', 'starts_at', 'ends_at', 'started_at', 'ended_at', 'metadata'])]
class ClassroomSession extends Model
{
    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(ClassroomParticipant::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ClassroomMessage::class);
    }

    public function resources(): HasMany
    {
        return $this->hasMany(ClassroomResource::class);
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(ClassroomAttendance::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
            'metadata' => 'array',
        ];
    }
}
