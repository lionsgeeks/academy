<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['classroom_session_id', 'sender_id', 'receiver_type', 'message', 'read_at', 'metadata'])]
class ClassroomMessage extends Model
{
    public function session(): BelongsTo
    {
        return $this->belongsTo(ClassroomSession::class, 'classroom_session_id');
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'metadata' => 'array',
        ];
    }
}
