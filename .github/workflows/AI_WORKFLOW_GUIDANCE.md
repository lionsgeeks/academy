# GitHub Actions Workflow Guidance

This file documents the required structure and behavior for any GitHub Actions workflow used to evaluate student repositories and send results back to this application.

## Purpose

Use this guidance when writing or updating workflows for evaluation runs. The workflow must:

- checkout the current runner repository
- checkout the student repository using the correct branch
- install PHP dependencies
- execute the evaluation logic
- build a signed JSON callback payload
- post the payload to the Academy callback endpoint
- capture both HTTP status and response body
- fail the workflow if callback delivery is not successful

## Required workflow behavior

1. Workflow trigger:
   - `workflow_dispatch` with inputs such as `attempt_token`, `submission_id`, `exercise_slug`, `test_suite`, `student_branch`, and `student_repository`.

2. Environment variables:
   - `ACADEMY_URL` from secrets
   - `ACADEMY_CALLBACK_SECRET` from secrets
   - `GITHUB_TOKEN` from secrets for repository checkout

3. Student repository checkout:
   - clone the student repository from `https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ steps.parse.outputs.repository }}.git`
   - checkout the `student_branch` input

4. PHP setup and dependency install:
   - use `shivammathur/setup-php@2`
   - run `composer install --no-interaction --no-progress --prefer-dist --optimize-autoloader`

5. Evaluation and payload generation:
   - write evaluation metadata and result JSON to `evaluation-results.json`
   - include `attempt_token`, `status`, `score`, `passed`, and `feedback` in the JSON payload

6. Callback request signing:
   - compute a SHA256 HMAC signature over the exact payload bytes
   - use `openssl dgst -sha256 -hmac "$ACADEMY_CALLBACK_SECRET" -binary | xxd -p -c 256`
   - send header: `X-Academy-Signature: sha256=$signature`

7. Callback delivery:
   - POST the JSON payload to `${ACADEMY_URL%/}/api/exercises/github-callback`
   - include `Content-Type: application/json`
   - preserve the exact JSON body with `--data-binary @evaluation-results.json`
   - capture the HTTP status code and response body separately
   - fail the workflow if the callback status is not `200` or `204`

8. Debugging guidance:
   - print the callback file contents before sending
   - print the computed signature
   - print the HTTP status code and partial response body

9. Common failure modes:
   - missing or empty `ACADEMY_URL` or `ACADEMY_CALLBACK_SECRET`
   - invalid callback URL or trailing slash handling
   - signature mismatch caused by payload formatting changes
   - non-JSON or invalid JSON payload
   - non-2xx response from the callback endpoint

## Example callback step

```yaml
- name: Send evaluation callback
  shell: bash
  env:
    ACADEMY_URL: ${{ secrets.ACADEMY_URL }}
    ACADEMY_CALLBACK_SECRET: ${{ secrets.ACADEMY_CALLBACK_SECRET }}
  run: |
    set -euo pipefail

    if [ -z "${ACADEMY_URL:-}" ] || [ -z "${ACADEMY_CALLBACK_SECRET:-}" ]; then
      echo "Missing ACADEMY_URL or ACADEMY_CALLBACK_SECRET"
      exit 1
    fi

    evaluation_file="evaluation-results.json"
    if [ ! -f "$evaluation_file" ]; then
      echo "Missing $evaluation_file"
      exit 1
    fi

    payload=$(<"$evaluation_file")
    signature="sha256=$(printf '%s' "$payload" | openssl dgst -sha256 -hmac "$ACADEMY_CALLBACK_SECRET" -binary | xxd -p -c 256)"

    response_file=$(mktemp)
    http_code=$(curl -sS -w '%{http_code}' -o "$response_file" \
      -H "Content-Type: application/json" \
      -H "X-Academy-Signature: $signature" \
      --data-binary @"$evaluation_file" \
      "${ACADEMY_URL%/}/api/exercises/github-callback")

    echo "HTTP status: $http_code"
    echo "Response body:"
    cat "$response_file"

    if [ "$http_code" != "200" ] && [ "$http_code" != "204" ]; then
      echo "Callback failed"
      exit 1
    fi
```
