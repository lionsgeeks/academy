<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;


class WakaTimeController extends Controller
{
    public function show(User $user)
    {
        $key = $user->wakatime()->value("wakatime_key");

        if (!$key) {
            return response()->json([
                "error" => "No WakaTime key"
            ], 404);
        }

$start = Carbon::now()->subYear()->format('Y-m-d');
$end = Carbon::now()->format('Y-m-d');



$response = Http::withoutVerifying()
    ->withBasicAuth($key, '')
->get('https://wakatime.com/api/v1/users/current/summaries', [
        'start' => $start,
        'end' => $end,
    ]);
$data = collect($response->json()['data'])->map(function ($day) {
    return [
        'date' => $day['range']['date'],
        'seconds' => $day['grand_total']['total_seconds'] ?? 0,
    ];
});

return response()->json($data);

}
}