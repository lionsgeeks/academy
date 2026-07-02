<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

use function Illuminate\Log\log;

class GetAvatarsService
{
    public function get(?string $url): bool
    {

        if (!$url) {
            return false;
        }
        try {
            $avatar = Http::withHeaders([
                "x-api-key" => env("CLIENT_SECRET"),
            ])->connectTimeout(5)
                ->timeout(15)
                ->get(env("CENTRAL_HOST_URL") . "api/academy/avatars", [
                    "url" => $url
                ]);
            $avatar->throw();
        } catch (\Throwable $th) {
            log($th->getCode() . " : " . $th->getMessage());
            return false;
        }
        if ($avatar) {
            Storage::disk("public")->put("/img/avatars/" . $url, base64_decode($avatar));
            return true;
        }
        return false;
    }
}
