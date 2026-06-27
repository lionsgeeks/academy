<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WakaTime extends Model
{
    //
    protected $fillable = [
        "user_id",
        "wakatime_key"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
