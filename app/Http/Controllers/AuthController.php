<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

use function Illuminate\Log\log;

class AuthController extends Controller
{

    public function login()
    {
        if (Auth::check()) {
                return redirect("/dashboard");
        }
        return redirect(env("CENTRAL_HOST_URL") . env("CENTRAL_HOST_AUTH"));
    }


    public function loginCallback(string $code): ?RedirectResponse
    {

        try {
            $token = Http::post(env("CENTRAL_HOST_URL") . env("CENTRAL_HOST_TOKEN"), [
                "client_secret" => env("CLIENT_SECRET"),
                "code" => $code
            ]);
        } catch (\Throwable $th) {
            log($th->getCode() . " : " . $th->getMessage());
            return redirect()->intended();
        }
        if (!$token) {
            return redirect("/");
        }
        $central_id = $token["central_id"];
        $name = $token["username"];
        $role = $token["role"];
        $promo = $token["promo"];
        $email = $token["email"];


        $user = User::where("central_id", $central_id)->first();
        if (!$user) {
            $user = User::create([
                "central_id" => $central_id,
                "email" => $email ?? "",
                "name" => $name ?? "",
                "role" => json_encode($role) ?? "",
                "promo" => $promo ?? "",
            ]);
        } else {
            $user->update([
                "central_id" => $central_id,
                "email" => $email ?? "",
                "name" => $name ?? "",
                "role" => $role ?? "",
                "promo" => $promo ?? "",
            ]);
        }
        Auth::login($user);
        return redirect()->intended("dashboard");
    }
}
