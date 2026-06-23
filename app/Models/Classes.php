<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    use HasFactory;
    
    //
    protected $fillable = [
        "name",
        "start_time",
        "end_time",
        "central_id",
        "thought_by_id",
        "type",
        "promo",
        "class"
    ];

    public function User()
    {
        return $this->belongsToMany(User::class,"user_classes")->withPivot("role_id");
    }
    
}
