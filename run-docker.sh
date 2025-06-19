#!/bin/bash

# Bash script to load .env variables and run Docker Compose

# Default values
ENV_FILE=".env"
COMPOSE_FILE="docker-compose.yml"
ACTION="up"
BUILD_FLAG=""
DETACHED_FLAG=""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to display usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env-file FILE       Environment file (default: .env)"
    echo "  -f, --compose-file FILE   Docker compose file (default: docker-compose.yml)"
    echo "  -a, --action ACTION       Docker compose action (default: up)"
    echo "  -b, --build              Force rebuild containers"
    echo "  -d, --detached           Run in detached mode"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                       # Basic usage"
    echo "  $0 --build --detached    # Build and run in background"
    echo "  $0 --action down         # Stop services"
    echo "  $0 --env-file .env.prod  # Use production env file"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env-file)
            ENV_FILE="$2"
            shift 2
            ;;
        -f|--compose-file)
            COMPOSE_FILE="$2"
            shift 2
            ;;
        -a|--action)
            ACTION="$2"
            shift 2
            ;;
        -b|--build)
            BUILD_FLAG="--build"
            shift
            ;;
        -d|--detached)
            DETACHED_FLAG="-d"
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Error: Unknown option $1${NC}"
            show_usage
            exit 1
            ;;
    esac
done

echo -e "${GREEN}Loading environment variables from $ENV_FILE...${NC}"

# Check if .env file exists
if [[ ! -f "$ENV_FILE" ]]; then
    echo -e "${RED}Error: Environment file '$ENV_FILE' not found!${NC}"
    echo -e "${YELLOW}Creating a sample .env file...${NC}"
    
    # Create a sample .env file
    cat > "$ENV_FILE" << 'EOF'
# Environment variables for Docker Compose
VITE_API_URL=http://localhost:3000/api
# Add more variables as needed
# VARIABLE_NAME=value
EOF
    
    echo -e "${YELLOW}Sample .env file created. Please edit it with your actual values and run the script again.${NC}"
    exit 1
fi

# Function to load .env file
load_env_file() {
    local file="$1"
    local count=0
    
    # Read the file line by line
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Remove leading/trailing whitespace
        line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        
        # Skip empty lines and comments
        if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]]; then
            # Check if line contains '='
            if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
                key="${BASH_REMATCH[1]}"
                value="${BASH_REMATCH[2]}"
                
                # Remove leading/trailing whitespace from key and value
                key=$(echo "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
                value=$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
                
                # Remove quotes if present
                if [[ "$value" =~ ^\"(.*)\"$ ]] || [[ "$value" =~ ^\'(.*)\'$ ]]; then
                    value="${BASH_REMATCH[1]}"
                fi
                
                # Export the variable
                export "$key=$value"
                echo -e "  ${CYAN}$key = $value${NC}"
                ((count++))
            fi
        fi
    done < "$file"
    
    return $count
}

# Load environment variables
if load_env_file "$ENV_FILE"; then
    env_count=$?
    echo -e "${GREEN}Successfully loaded $env_count environment variables${NC}"
else
    echo -e "${RED}Failed to load environment file${NC}"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: docker-compose is not installed or not in PATH${NC}"
    exit 1
fi

# Build Docker Compose command
DOCKER_COMPOSE_CMD="docker-compose"

# Add compose file if different from default
if [[ "$COMPOSE_FILE" != "docker-compose.yml" ]]; then
    DOCKER_COMPOSE_CMD="$DOCKER_COMPOSE_CMD -f $COMPOSE_FILE"
fi

# Add the action
DOCKER_COMPOSE_CMD="$DOCKER_COMPOSE_CMD $ACTION"

# Add build flag if specified
if [[ -n "$BUILD_FLAG" ]]; then
    DOCKER_COMPOSE_CMD="$DOCKER_COMPOSE_CMD $BUILD_FLAG"
fi

# Add detached flag if specified and action is 'up'
if [[ -n "$DETACHED_FLAG" && "$ACTION" == "up" ]]; then
    DOCKER_COMPOSE_CMD="$DOCKER_COMPOSE_CMD $DETACHED_FLAG"
fi

# Display the command that will be executed
echo -e "\n${YELLOW}Executing Docker Compose command:${NC}"
echo -e "  ${NC}$DOCKER_COMPOSE_CMD${NC}"

# Execute Docker Compose command
echo ""
if eval "$DOCKER_COMPOSE_CMD"; then
    echo -e "\n${GREEN}Docker Compose command completed successfully!${NC}"
else
    exit_code=$?
    echo -e "\n${RED}Docker Compose command failed with exit code: $exit_code${NC}"
    exit $exit_code
fi

echo -e "\n${GREEN}Script completed!${NC}" 