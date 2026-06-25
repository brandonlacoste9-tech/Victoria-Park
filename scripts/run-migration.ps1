param(
  [Parameter(Mandatory = $true)][string]$ProjectRef,
  [Parameter(Mandatory = $true)][string]$SqlFile,
  [string]$AccessToken = $env:SUPABASE_ACCESS_TOKEN
)

if (-not $AccessToken) {
  Write-Error "Set SUPABASE_ACCESS_TOKEN environment variable"
  exit 1
}

$sql = Get-Content $SqlFile -Raw
$payload = @{ query = $sql }
$json = $payload | ConvertTo-Json -Depth 5
$utf8 = New-Object System.Text.UTF8Encoding $false
$bytes = $utf8.GetBytes($json)

$headers = @{
  Authorization = "Bearer $AccessToken"
  "Content-Type" = "application/json; charset=utf-8"
}

try {
  $response = Invoke-RestMethod `
    -Uri "https://api.supabase.com/v1/projects/$ProjectRef/database/query" `
    -Method POST `
    -Headers $headers `
    -Body $bytes
  Write-Output "OK: $SqlFile"
  if ($response) { $response | ConvertTo-Json }
} catch {
  Write-Error $_.ErrorDetails.Message
  exit 1
}