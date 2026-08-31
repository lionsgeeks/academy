<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ConfigureGithubCallback extends Command
{
    protected $signature = 'github:configure-callback {ngrokUrl}';

    protected $description = 'Configure GitHub Actions callback URL with your ngrok URL';

    public function handle(): int
    {
        $ngrokUrl = $this->argument('ngrokUrl');

        // Validate URL
        if (! filter_var($ngrokUrl, FILTER_VALIDATE_URL)) {
            $this->error('Invalid URL provided');
            return 1;
        }

        // Ensure URL has https
        if (! str_starts_with($ngrokUrl, 'https://')) {
            $ngrokUrl = 'https://' . ltrim($ngrokUrl, 'http://');
        }

        $workflowPath = base_path('.github/workflows/evaluate-laravel.yml');

        if (! File::exists($workflowPath)) {
            $this->error('Workflow file not found at ' . $workflowPath);
            return 1;
        }

        $content = File::get($workflowPath);

        // Replace the URL
        $updated = preg_replace(
            "/ACADEMY_URL: '.*?'/",
            "ACADEMY_URL: '$ngrokUrl'",
            $content,
        );

        if ($updated === $content) {
            $this->error('Could not find ACADEMY_URL in workflow file');
            return 1;
        }

        File::put($workflowPath, $updated);

        $this->info('✓ Workflow updated successfully!');
        $this->line('');
        $this->line('Academy URL: ' . $ngrokUrl);
        $this->line('Workflow file: ' . $workflowPath);
        $this->line('');
        $this->info('Next steps:');
        $this->line('1. Commit and push to GitHub:');
        $this->line('   git add .github/workflows/evaluate-laravel.yml');
        $this->line('   git commit -m "Update callback URL for testing"');
        $this->line('   git push origin main');
        $this->line('');
        $this->line('2. Run the dispatch command:');
        $this->line('   php artisan qjob:dispatch 13 --now');
        $this->line('');
        $this->info('GitHub Actions will now automatically send feedback!');

        return 0;
    }
}
