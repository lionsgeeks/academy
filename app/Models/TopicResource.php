<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['topic_id', 'type', 'name', 'url', 'meta', 'order_index'])]
class TopicResource extends Model
{
    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }
}
