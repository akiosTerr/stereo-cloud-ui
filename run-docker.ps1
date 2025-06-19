#!/usr/bin/env pwsh

# PowerShell script to load .env variables and run Docker Compose

param(
    [string]$EnvFile = ".env",
    [string]$ComposeFile = "docker-compose.yml",
    [string]$Action = "up",
    [switch]$Build,
    [switch]$Detached
)

Write-Host "Loading environment variables from $EnvFile..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path $EnvFile)) {
    Write-Error "Environment file '$EnvFile' not found!"
    Write-Host "Creating a sample .env file..." -ForegroundColor Yellow
    
    # Create a sample .env file
    @"
# Environment variables for Docker Compose
VITE_API_URL=http://localhost:3000/api
# Add more variables as needed
# VARIABLE_NAME=value
"@ | Out-File -FilePath $EnvFile -Encoding UTF8
    
    Write-Host "Sample .env file created. Please edit it with your actual values and run the script again." -ForegroundColor Yellow
    exit 1
}

# Function to load .env file
function Load-EnvFile {
    param([string]$FilePath)
    
    $envVars = @{}
    
    Get-Content $FilePath | ForEach-Object {
        $line = $_.Trim()
        
        # Skip empty lines and comments
        if ($line -and -not $line.StartsWith('#')) {
            if ($line -match '^([^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                
                # Remove quotes if present
                if (($value.StartsWith('"') -and $value.EndsWith('"')) -or 
                    ($value.StartsWith("'") -and $value.EndsWith("'"))) {
                    $value = $value.Substring(1, $value.Length - 2)
                }
                
                $envVars[$key] = $value
                
                # Set environment variable for current session
                [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
                
                Write-Host "  $key = $value" -ForegroundColor Cyan
            }
        }
    }
    
    return $envVars
}

# Load environment variables
try {
    $envVariables = Load-EnvFile -FilePath $EnvFile
    Write-Host "Successfully loaded $($envVariables.Count) environment variables" -ForegroundColor Green
}
catch {
    Write-Error "Failed to load environment file: $_"
    exit 1
}

# Build Docker Compose command
$dockerComposeArgs = @("docker-compose")

if ($ComposeFile -ne "docker-compose.yml") {
    $dockerComposeArgs += @("-f", $ComposeFile)
}

# Add the action (up, down, build, etc.)
$dockerComposeArgs += $Action

# Add additional flags based on parameters
if ($Build) {
    $dockerComposeArgs += "--build"
}

if ($Detached -and $Action -eq "up") {
    $dockerComposeArgs += "-d"
}

# Display the command that will be executed
Write-Host "`nExecuting Docker Compose command:" -ForegroundColor Yellow
Write-Host "  $($dockerComposeArgs -join ' ')" -ForegroundColor White

# Execute Docker Compose command
try {
    $process = Start-Process -FilePath "docker-compose" -ArgumentList ($dockerComposeArgs[1..($dockerComposeArgs.Length-1)]) -Wait -PassThru -NoNewWindow
    
    if ($process.ExitCode -eq 0) {
        Write-Host "`nDocker Compose command completed successfully!" -ForegroundColor Green
    } else {
        Write-Error "Docker Compose command failed with exit code: $($process.ExitCode)"
        exit $process.ExitCode
    }
}
catch {
    Write-Error "Failed to execute Docker Compose command: $_"
    exit 1
}

Write-Host "`nScript completed!" -ForegroundColor Green 