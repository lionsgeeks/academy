<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * All five tables were created with foreignId('student_id')->constrained(),
 * which Laravel infers as referencing `students`. No `students` table exists —
 * users are stored in `users`. This migration rebuilds each table in SQLite
 * (the only way to change FK constraints) to point at `users.id` instead.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('PRAGMA foreign_keys = OFF');

        // lesson_completions
        DB::statement('CREATE TABLE "lesson_completions_new" (
            "id" integer primary key autoincrement not null,
            "student_id" integer not null,
            "lesson_id" integer not null,
            "completed_at" datetime not null default CURRENT_TIMESTAMP,
            "created_at" datetime,
            "updated_at" datetime,
            foreign key("student_id") references "users"("id") on delete cascade,
            foreign key("lesson_id") references "lessons"("id") on delete cascade,
            unique("student_id","lesson_id")
        )');
        DB::statement('INSERT INTO "lesson_completions_new" SELECT * FROM "lesson_completions"');
        Schema::drop('lesson_completions');
        DB::statement('ALTER TABLE "lesson_completions_new" RENAME TO "lesson_completions"');

        // exercise_submissions
        DB::statement('CREATE TABLE "exercise_submissions_new" (
            "id" integer primary key autoincrement not null,
            "student_id" integer not null,
            "exercise_id" integer not null,
            "code_text" text,
            "submission_url" varchar,
            "status" varchar not null default \'pending\',
            "feedback" text,
            "submitted_at" datetime not null default CURRENT_TIMESTAMP,
            "reviewed_at" datetime,
            "created_at" datetime,
            "updated_at" datetime,
            foreign key("student_id") references "users"("id") on delete cascade,
            foreign key("exercise_id") references "exercises"("id") on delete cascade
        )');
        DB::statement('INSERT INTO "exercise_submissions_new" SELECT * FROM "exercise_submissions"');
        Schema::drop('exercise_submissions');
        DB::statement('ALTER TABLE "exercise_submissions_new" RENAME TO "exercise_submissions"');
        DB::statement('CREATE INDEX "exercise_submissions_student_id_exercise_id_index" ON "exercise_submissions"("student_id","exercise_id")');

        // quiz_attempts
        DB::statement('CREATE TABLE "quiz_attempts_new" (
            "id" integer primary key autoincrement not null,
            "student_id" integer not null,
            "quiz_id" integer not null,
            "score" integer not null,
            "passed" tinyint(1) not null default \'0\',
            "started_at" datetime,
            "completed_at" datetime,
            "created_at" datetime,
            "updated_at" datetime,
            foreign key("student_id") references "users"("id") on delete cascade,
            foreign key("quiz_id") references "quizzes"("id") on delete cascade
        )');
        DB::statement('INSERT INTO "quiz_attempts_new" SELECT * FROM "quiz_attempts"');
        Schema::drop('quiz_attempts');
        DB::statement('ALTER TABLE "quiz_attempts_new" RENAME TO "quiz_attempts"');
        DB::statement('CREATE INDEX "quiz_attempts_student_id_quiz_id_index" ON "quiz_attempts"("student_id","quiz_id")');

        // course_enrollments
        DB::statement('CREATE TABLE "course_enrollments_new" (
            "id" integer primary key autoincrement not null,
            "student_id" integer not null,
            "course_promotion_id" integer not null,
            "status" varchar not null default \'active\',
            "enrolled_at" datetime not null default CURRENT_TIMESTAMP,
            "last_accessed_at" datetime,
            "completed_at" datetime,
            "created_at" datetime,
            "updated_at" datetime,
            foreign key("student_id") references "users"("id") on delete cascade,
            foreign key("course_promotion_id") references "course_promotions"("id") on delete cascade,
            unique("student_id","course_promotion_id")
        )');
        DB::statement('INSERT INTO "course_enrollments_new" SELECT * FROM "course_enrollments"');
        Schema::drop('course_enrollments');
        DB::statement('ALTER TABLE "course_enrollments_new" RENAME TO "course_enrollments"');

        // promotion_students
        DB::statement('CREATE TABLE "promotion_students_new" (
            "id" integer primary key autoincrement not null,
            "promotion_id" integer not null,
            "student_id" integer not null,
            "status" varchar not null default \'active\',
            "joined_at" datetime not null default CURRENT_TIMESTAMP,
            "left_at" datetime,
            "created_at" datetime,
            "updated_at" datetime,
            foreign key("promotion_id") references "promotions"("id") on delete cascade,
            foreign key("student_id") references "users"("id") on delete cascade,
            unique("promotion_id","student_id")
        )');
        DB::statement('INSERT INTO "promotion_students_new" SELECT * FROM "promotion_students"');
        Schema::drop('promotion_students');
        DB::statement('ALTER TABLE "promotion_students_new" RENAME TO "promotion_students"');

        DB::statement('PRAGMA foreign_keys = ON');
    }

    public function down(): void
    {
        // Reverting back to the broken state is intentional: this migration
        // only corrects an invalid schema. There is no valid rollback target.
    }
};
