<?php

namespace App\Http\Middleware;

use App\Models\Role;
use App\Models\User_role;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class HandleSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $role_id = Role::where("role", "super_admin")->value('id');
        $user_id = Auth::user()->id;
        $super_admin = User_role::where("user_id", $user_id)
            ->where("role", $role_id)->first();
        if (!$super_admin) {
            return redirect("/dashboard");
        }
        return $next($request);
    }
}
