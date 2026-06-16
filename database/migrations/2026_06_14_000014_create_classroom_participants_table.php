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
        Schema::create('classroom_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classroom_session_id')->constrained('classroom_sessions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('student');
            $table->boolean('is_online')->default(false);
            $table->boolean('is_muted')->default(true);
            $table->boolean('is_camera_on')->default(false);
            $table->boolean('is_screen_sharing')->default(false);
            $table->boolean('can_share_screen')->default(false);
            $table->boolean('hand_raised')->default(false);
            $table->timestamp('joined_at')->nullable();
            $table->timestamp('left_at')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['classroom_session_id', 'user_id']);
            $table->index(['classroom_session_id', 'is_online']);
            $table->index(['classroom_session_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classroom_participants');
    }
};
