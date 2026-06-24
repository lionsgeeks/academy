<?php

namespace Database\Seeders;

use App\Models\Classes;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create coach and student roles
        $coachRole = Role::where('role', 'coach')->first();
        $studentRole = Role::where('role', 'student')->first();

        if (!$coachRole || !$studentRole) {
            $this->command->warn('Coach or Student role not found. Please run RolesSeeder first.');
            return;
        }

        // Create coach users
        $coaches = [];
        for ($i = 0; $i < 3; $i++) {
            $coach = User::create([
                'name' => "Coach " . ($i + 1),
                'email' => "coach" . ($i + 1) . "@example.com",
            ]);
            $coach->roles()->attach($coachRole->id);
            $coaches[] = $coach;
        }

        // Create classes and attach coaches and students
        for ($i = 0; $i < 12; $i++) {
            $class = Classes::factory()->create();

            // Attach a random coach
            $coach = collect($coaches)->random();
            $class->User()->attach($coach->id, ['role_id' => $coachRole->id]);

            // Create and attach 5-15 random students
            $studentCount = rand(5, 15);
            for ($j = 0; $j < $studentCount; $j++) {
                $student = User::create([
                    'name' => "Student " . uniqid(),
                    'email' => "student" . uniqid() . "@example.com",
                ]);
                $student->roles()->attach($studentRole->id);
                $class->User()->attach($student->id, ['role_id' => $studentRole->id]);
            }
        }

        $this->command->info('Classes seeded successfully with coaches and students!');
    }
}
