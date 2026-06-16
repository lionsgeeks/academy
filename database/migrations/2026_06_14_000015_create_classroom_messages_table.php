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
        Schema::create('classroom_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classroom_session_id')->constrained('classroom_sessions')->cascadeOnDelete();
            $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('receiver_type')->default('everyone');
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['classroom_session_id', 'receiver_type']);
            $table->index(['classroom_session_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classroom_messages');
    }
};
