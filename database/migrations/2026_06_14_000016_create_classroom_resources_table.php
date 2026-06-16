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
        Schema::create('classroom_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classroom_session_id')->constrained('classroom_sessions')->cascadeOnDelete();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('type')->default('file')->index();
            $table->string('disk')->default('local');
            $table->string('file_path')->nullable();
            $table->string('external_url')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->boolean('is_visible')->default(true)->index();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classroom_resources');
    }
};
