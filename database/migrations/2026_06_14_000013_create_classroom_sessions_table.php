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
        Schema::create('classroom_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('external_course_id')->nullable()->index();
            $table->string('external_group_id')->nullable()->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('jitsi_room_name')->unique();
            $table->string('status')->default('scheduled')->index();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('starts_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classroom_sessions');
    }
};
