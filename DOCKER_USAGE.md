# Docker Compose with Environment Scripts

This document explains how to use the provided scripts to manage Docker Compose with environment variables.

## Available Scripts

- **`run-docker.ps1`** - PowerShell script for Windows
- **`run-docker.sh`** - Bash script for Linux/macOS

## Prerequisites

### Windows (PowerShell)
- Docker and Docker Compose installed
- PowerShell 5.1 or later (or PowerShell Core)
- A `.env` file in the same directory as the script

### Linux/macOS (Bash)
- Docker and Docker Compose installed
- Bash shell (usually pre-installed)
- A `.env` file in the same directory as the script

## Usage

### Windows (PowerShell)

#### Basic Usage

```powershell
# Run the application (will create a sample .env if it doesn't exist)
.\run-docker.ps1

# Run in detached mode
.\run-docker.ps1 -Detached

# Force rebuild the containers
.\run-docker.ps1 -Build

# Run with custom .env file
.\run-docker.ps1 -EnvFile "my-custom.env"
```

#### Advanced Usage

```powershell
# Stop the application
.\run-docker.ps1 -Action "down"

# Build only (no run)
.\run-docker.ps1 -Action "build"

# View logs
.\run-docker.ps1 -Action "logs"

# Use custom docker-compose file
.\run-docker.ps1 -ComposeFile "docker-compose.prod.yml"
```

### Linux/macOS (Bash)

#### Basic Usage

```bash
# Run the application (will create a sample .env if it doesn't exist)
./run-docker.sh

# Run in detached mode
./run-docker.sh --detached

# Force rebuild the containers
./run-docker.sh --build

# Run with custom .env file
./run-docker.sh --env-file "my-custom.env"
```

#### Advanced Usage

```bash
# Stop the application
./run-docker.sh --action "down"

# Build only (no run)
./run-docker.sh --action "build"

# View logs
./run-docker.sh --action "logs"

# Use custom docker-compose file
./run-docker.sh --compose-file "docker-compose.prod.yml"

# Show help
./run-docker.sh --help
```

## Environment File Format

Create a `.env` file in the same directory with the following format:

```bash
# Environment variables for Docker Compose
VITE_API_URL=http://localhost:3000/api

# Add more variables as needed
# VARIABLE_NAME=value
# ANOTHER_VAR="value with spaces"
```

### Supported Variable Formats

- `KEY=value` - Simple key-value pair
- `KEY="value with spaces"` - Quoted values
- `KEY='single quoted value'` - Single quoted values
- `# This is a comment` - Comments (ignored)

## Script Parameters

### PowerShell Script Parameters

| Parameter | Description | Default Value |
|-----------|-------------|---------------|
| `EnvFile` | Path to the environment file | `.env` |
| `ComposeFile` | Path to the docker-compose file | `docker-compose.yml` |
| `Action` | Docker Compose action (up, down, build, etc.) | `up` |
| `Build` | Force rebuild containers | `false` |
| `Detached` | Run in detached mode | `false` |

### Bash Script Parameters

| Parameter | Short | Description | Default Value |
|-----------|-------|-------------|---------------|
| `--env-file` | `-e` | Path to the environment file | `.env` |
| `--compose-file` | `-f` | Path to the docker-compose file | `docker-compose.yml` |
| `--action` | `-a` | Docker Compose action (up, down, build, etc.) | `up` |
| `--build` | `-b` | Force rebuild containers | `false` |
| `--detached` | `-d` | Run in detached mode | `false` |
| `--help` | `-h` | Show help message | - |

## Examples

### Windows Examples

#### Example 1: First Run
```powershell
.\run-docker.ps1
```
If no `.env` file exists, the script will create a sample one and exit. Edit the created `.env` file and run again.

#### Example 2: Production Deployment
```powershell
.\run-docker.ps1 -EnvFile ".env.production" -ComposeFile "docker-compose.prod.yml" -Build -Detached
```

#### Example 3: Development with Rebuild
```powershell
.\run-docker.ps1 -Build
```

#### Example 4: Stop All Services
```powershell
.\run-docker.ps1 -Action "down"
```

### Linux/macOS Examples

#### Example 1: First Run
```bash
./run-docker.sh
```
If no `.env` file exists, the script will create a sample one and exit. Edit the created `.env` file and run again.

#### Example 2: Production Deployment
```bash
./run-docker.sh --env-file .env.production --compose-file docker-compose.prod.yml --build --detached
```

#### Example 3: Development with Rebuild
```bash
./run-docker.sh --build
```

#### Example 4: Stop All Services
```bash
./run-docker.sh --action down
```

#### Example 5: Make Script Executable (First Time)
```bash
chmod +x run-docker.sh
./run-docker.sh
```

## Troubleshooting

### Windows (PowerShell) Issues

1. **Script execution disabled**: Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` in PowerShell
2. **Docker not found**: Ensure Docker is installed and in your PATH
3. **Permission denied**: Run PowerShell as Administrator
4. **Environment variables not loaded**: Check the `.env` file format and ensure no syntax errors

### Linux/macOS (Bash) Issues

1. **Permission denied**: Run `chmod +x run-docker.sh` to make the script executable
2. **Docker not found**: Ensure Docker is installed and in your PATH
3. **Script not found**: Make sure you're in the correct directory or use `./run-docker.sh`
4. **Environment variables not loaded**: Check the `.env` file format and ensure no syntax errors
5. **Bash not available**: Most Linux/macOS systems have bash pre-installed. Try `which bash` to verify

### Debug Mode

To see what environment variables are being loaded, the script will display them during execution:

```
Loading environment variables from .env...
  VITE_API_URL = http://localhost:3000/api
Successfully loaded 1 environment variables
```

## Notes

- The script automatically sets environment variables for the current PowerShell session
- Variables are available to Docker Compose through the environment
- Comments and empty lines in `.env` files are ignored
- The script handles quoted values correctly
- All Docker Compose commands and options are supported through the `Action` parameter 