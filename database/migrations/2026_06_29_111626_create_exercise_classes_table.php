<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercise_classes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('exercise_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('classes_id')
                ->constrained('classes')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique(['exercise_id', 'classes_id']);
            $table->index('classes_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercise_classes');
    }
};