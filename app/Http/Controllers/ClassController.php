<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\Role;
use App\Models\User;
use App\Models\User_role;
use App\Models\WakaTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    private function getLastCoach(Classes $class)
    {
        $coachRoleId = Role::where('role', 'coach')->value('id');
        return $class->User()
            ->wherePivot('role_id', $coachRoleId)
            ->orderByPivot('created_at', 'desc')
            ->get()->first();
    }

    private function getStudents(Classes $class)
    {
        $StudentRoleId = Role::where('role', 'student')->value('id');

        return $class->User()
            ->wherePivot("role_id", $StudentRoleId)
            ->get();
    }

    private function getGithub(User $user)
    {
        return $account = $user->Social()->where("title", "github")->first()?->url;
    }

    private function getWakatimeKey(User $user)
    {
        return $user->wakatime()->value("wakatime_key");
    }

    public function index()
    {
        $classes = Classes::orderBy("promo")->orderBy("class")->get()->all();
        $info = [];
        $coaches = [];
        foreach ($classes as $class) {
            $tmp = [];

            $lastCoach = $this->getLastCoach($class);
            if ($lastCoach) {
                $tmp["coach"] = $lastCoach["name"];
                // check if the coach is already in coaches list to avoid dupplicates 
                if (!in_array($lastCoach["name"], $coaches)) {
                    $coaches[] = $lastCoach["name"];
                }
            }
            $studentNum = $this->getStudents($class)->count();
            $tmp["id"] = $class->id;
            $tmp["student_num"] = $studentNum;
            $tmp["class"] = $class->class;
            $tmp["promo"] = $class->promo;
            $tmp["type"] = $class->type;
            $info[] = $tmp;
        }
        $user_id = Auth::user()->id;
        $role_id = Role::where("role", "super_admin")->value("id");
        $isSuAdmin = User_role::where("user_id", $user_id)
            ->where("role_id", $role_id)->first();
        if (!$isSuAdmin) {
            $val = false;
        } else {
            $val = true;
        }
        return Inertia::render('classes/index', [
            "items" => array_values($info),
            "coaches" => $coaches,
            "suAdmin" => $val
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        $class = Classes::where("id", $id)->get()->first();
        if (!$class) {
            return abort(404);
        }
        $students = $this->getStudents($class);
        $coach = $this->getLastCoach($class);
        // dd($coach);
        $data = [];
        $data["id"] = $class->id;
        $data["class"] = $class->class;
        $data["promo"] = $class->promo;
        $data["type"] = $class->type;
        if ($coach) {
            $data["coach"] = $coach->name;
        }
        if ($students) {
            foreach ($students as $key => $student) {
                $data["students"][$key]["id"] = $student->id;
                $data["students"][$key]["name"] = $student->name;
                $data["students"][$key]["avatar"] = $student->avatar;
                $data["students"][$key]["field"] = $student->field;
                $data["students"][$key]["status"] = $student->status;
                $data["students"][$key]["promo"] = $class->promo;
                $data["students"][$key]["type"] = $class->type;
                $data["students"][$key]["class"] = $class->class;
                $data["students"][$key]["avatar"] = $student->avatar ?
                    env("CENTRAL_HOST_URL") . "/storage/img/profile/" . $student->avatar :
                    null;
                $data["students"][$key]["email"] = $student->email;
                $data["students"][$key]["gh_url"] = $this->getGithub($student);
                $data["students"][$key]["wakaKey"] = $this->getWakatimeKey($student);
            }
        }

        return Inertia::render("classes/[id]", ["data" => $data]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Classes $classes)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Classes $classes)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classes $classes)
    {
        //
    }
}
