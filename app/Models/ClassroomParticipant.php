<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['classroom_session_id', 'user_id', 'role', 'is_online', 'is_muted', 'is_camera_on', 'is_screen_sharing', 'can_share_screen', 'hand_raised', 'joined_at', 'left_at', 'last_seen_at', 'metadata'])]
class ClassroomParticipant extends Model
{
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
            'is_online' => 'boolean',
            'is_muted' => 'boolean',
            'is_camera_on' => 'boolean',
            'is_screen_sharing' => 'boolean',
            'can_share_screen' => 'boolean',
            'hand_raised' => 'boolean',
            'joined_at' => 'datetime',
            'left_at' => 'datetime',
            'last_seen_at' => 'datetime',
            'metadata' => 'array',
        ];
    }
}
