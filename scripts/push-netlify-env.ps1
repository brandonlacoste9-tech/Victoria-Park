# Push env vars from web/.env.local to Netlify (requires: netlify login + netlify link)
# Usage: .\scripts\push-netlify-env.ps1

$envFile = Join-Path $PSScriptRoot "..\web\.env.local"
if (-not (Test-Path $envFile)) {
  Write-Error "Missing web/.env.local"
  exit 1
}

$vars = @(
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_CALENDLY_URL"
)

Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    $name = $matches[1].Trim()
    $value = $matches[2].Trim()
    if ($vars -contains $name -and $value) {
      Write-Host "Setting $name..."
      npx netlify env:set $name $value --context production --force
      npx netlify env:set $name $value --context deploy-preview --force
    }
  }
}

Write-Host "Done. Trigger deploy: npx netlify deploy --prod"