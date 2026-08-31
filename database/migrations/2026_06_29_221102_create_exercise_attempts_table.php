<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercise_attempts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('exercise_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedInteger('attempt_number');

            $table->string('status', 30)
                ->default('queued');

            $table->string('source_type', 50);

            $table->string('source_path')
                ->nullable();

            $table->text('repository_url')
                ->nullable();

            $table->string('branch')
                ->nullable();

            $table->string('commit_sha', 100)
                ->nullable();

            $table->unsignedTinyInteger('score')
                ->nullable();

            $table->boolean('passed')
                ->nullable();

            $table->json('feedback')
                ->nullable();

            $table->text('failure_reason')
                ->nullable();

            $table->timestamp('submitted_at')
                ->nullable();

            $table->timestamp('started_at')
                ->nullable();

            $table->timestamp('completed_at')
                ->nullable();

            $table->timestamps();

            $table->unique([
                'exercise_id',
                'user_id',
                'attempt_number',
            ]);

            $table->index(['status', 'created_at']);

            $table->index([
                'user_id',
                'exercise_id',
                'created_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercise_attempts');
    }
};