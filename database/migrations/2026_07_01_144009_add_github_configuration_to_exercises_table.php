<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->text('github_repo_url')
                ->nullable()
                ->after('correction_rules');

            $table->string('github_workflow')
                ->nullable()
                ->after('github_repo_url');

            $table->string('github_test_suite')
                ->nullable()
                ->after('github_workflow');

            $table->string('github_branch_prefix')
                ->nullable()
                ->after('github_test_suite');
        });
    }

    public function down(): void
    {
        Schema::table('exercises', function (Blueprint $table) {
            $table->dropColumn([
                'github_repo_url',
                'github_workflow',
                'github_test_suite',
                'github_branch_prefix',
            ]);
        });
    }
};