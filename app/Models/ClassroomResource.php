<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['classroom_session_id', 'uploaded_by', 'title', 'type', 'disk', 'file_path', 'external_url', 'mime_type', 'size_bytes', 'is_visible', 'metadata'])]
class ClassroomResource extends Model
{
    public function session(): BelongsTo
    {
        return $this->belongsTo(ClassroomSession::class, 'classroom_session_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'metadata' => 'array',
        ];
    }
}
