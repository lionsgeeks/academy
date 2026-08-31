<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exercise_attempts', function (Blueprint $table) {
            $table->uuid('github_dispatch_token')
                ->nullable()
                ->unique()
                ->after('commit_sha');

            $table->timestamp('github_dispatched_at')
                ->nullable()
                ->after('github_dispatch_token');
        });
    }

    public function down(): void
    {
        Schema::table('exercise_attempts', function (Blueprint $table) {
            $table->dropUnique([
                'github_dispatch_token',
            ]);

            $table->dropColumn([
                'github_dispatch_token',
                'github_dispatched_at',
            ]);
        });
    }
};