<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Social extends Model
{
    //

    protected $fillable = [
        "user_id",
        "central_social_id",
        "central_user_id",
        "title",
        "url",
    ];

    public function User()
    {
        return $this->belongsTo(User::class);
    }
}
