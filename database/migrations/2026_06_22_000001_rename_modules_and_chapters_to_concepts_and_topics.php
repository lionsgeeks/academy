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
        if (! Schema::hasTable('modules') && ! Schema::hasTable('chapters')) {
            return;
        }

        Schema::disableForeignKeyConstraints();

        if (Schema::hasTable('modules') && ! Schema::hasTable('concepts')) {
            Schema::rename('modules', 'concepts');
        }

        if (Schema::hasTable('chapters') && ! Schema::hasTable('topics')) {
            Schema::rename('chapters', 'topics');
        }

        if (Schema::hasTable('topics') && Schema::hasColumn('topics', 'module_id')) {
            Schema::table('topics', function (Blueprint $table) {
                $table->renameColumn('module_id', 'concept_id');
            });
        }

        foreach (['lessons', 'exercises', 'quizzes'] as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'chapter_id')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->renameColumn('chapter_id', 'topic_id');
                });
            }
        }

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('concepts') && ! Schema::hasTable('topics')) {
            return;
        }

        Schema::disableForeignKeyConstraints();

        foreach (['lessons', 'exercises', 'quizzes'] as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'topic_id')) {
                Schema::table($tableName, function (Blueprint $table) {
                    $table->renameColumn('topic_id', 'chapter_id');
                });
            }
        }

        if (Schema::hasTable('topics') && Schema::hasColumn('topics', 'concept_id')) {
            Schema::table('topics', function (Blueprint $table) {
                $table->renameColumn('concept_id', 'module_id');
            });
        }

        if (Schema::hasTable('topics') && ! Schema::hasTable('chapters')) {
            Schema::rename('topics', 'chapters');
        }

        if (Schema::hasTable('concepts') && ! Schema::hasTable('modules')) {
            Schema::rename('concepts', 'modules');
        }

        Schema::enableForeignKeyConstraints();
    }
};
