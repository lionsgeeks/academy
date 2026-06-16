<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('classroom_attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classroom_session_id')->constrained('classroom_sessions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('joined_at');
            $table->timestamp('left_at')->nullable();
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->string('leave_reason')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['classroom_session_id', 'user_id']);
            $table->index(['classroom_session_id', 'joined_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classroom_attendance');
    }
};
