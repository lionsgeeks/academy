<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->string('correction_engine')->nullable();
            $table->string('exercise_type')->nullable();
            $table->string('status')->default('draft');
            $table->unsignedTinyInteger('passing_score')->default(70);
            $table->timestamp('published_at')->nullable();

            $table->index('correction_engine', 'exercises_correction_engine_index');
            $table->index('exercise_type', 'exercises_exercise_type_index');
            $table->index('status', 'exercises_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->dropIndex('exercises_correction_engine_index');
            $table->dropIndex('exercises_exercise_type_index');
            $table->dropIndex('exercises_status_index');

            $table->dropColumn([
                'correction_engine',
                'exercise_type',
                'status',
                'passing_score',
                'published_at',
            ]);
        });
    }
};