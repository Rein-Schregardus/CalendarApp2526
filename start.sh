#!/bin/bash

# ---------------------------------
# CalendarApp2526 Startup Script
# ---------------------------------

REACT_URL="http://localhost:5173/"
SWAGGER_URL="http://localhost:5005/swagger"

# Colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
CYAN="\033[0;36m"
NC="\033[0m"

# ---------------------------------
# Default values
# ---------------------------------
ARGS="$*"
RUN_REACT=false
RUN_SERVER=false
RUN_TEST=false
SILENT=true
OPEN_SWAGGER=false

# ---------------------------------
# Show menu if no args passed
# ---------------------------------
if [[ -z "$ARGS" ]]; then
    echo -e "${CYAN}"
    echo "==============================================="
    echo "        Welcome to CalendarApp2526!"
    echo "==============================================="
    echo -e "${NC}"

    echo "Choose what to start:"
    echo -e "${YELLOW}1) Frontend + Backend (silent, default)${NC}"
    echo -e "${YELLOW}2) Frontend + Backend (show logs)${NC}"
    echo -e "${YELLOW}3) Backend only (show logs)${NC}"
    echo -e "${YELLOW}4) Frontend only${NC}"
    echo -e "${YELLOW}5) Tests only${NC}"
    echo "-----------------------------------------------"
    echo -e "${CYAN}Advanced options:${NC}"
    echo -e "${YELLOW}6) Frontend + Backend + Tests (silent)${NC}"
    echo -e "${YELLOW}7) Frontend + Backend + Tests (non-silent)${NC}"
    echo -e "${YELLOW}8) Backend + Tests (silent)${NC}"
    echo -e "${YELLOW}9) Backend + Tests (non-silent)${NC}"
    echo "-----------------------------------------------"

    read -p "$(echo -e ${GREEN}Enter option [1-9]: ${NC})" choice

    case $choice in
        1) ARGS="fb s" ;;
        2) ARGS="fb ns" ;;
        3) ARGS="b ns" ;;
        4) ARGS="f" ;;
        5) ARGS="t" ;;
        6) ARGS="fbt s" ;;
        7) ARGS="fbt ns" ;;
        8) ARGS="bt s" ;;
        9) ARGS="bt ns" ;;
        *) echo "Invalid choice."; exit 1 ;;
    esac
fi

# ---------------------------------
# Interpret short arguments
# ---------------------------------
[[ "$ARGS" == *"f"* ]] && RUN_REACT=true
[[ "$ARGS" == *"b"* ]] && RUN_SERVER=true
[[ "$ARGS" == *"t"* ]] && RUN_TEST=true
[[ "$ARGS" == *"ns"* ]] && SILENT=false
[[ "$ARGS" == *"sw"* ]] && OPEN_SWAGGER=true

# ---------------------------------
# Run components
# ---------------------------------
echo -e "${CYAN}Starting CalendarApp2526...${NC}"
docker compose up -d

# React
if [[ "$RUN_REACT" == true ]]; then
    echo "Starting React app..."
    cd ./app || exit
    if [[ "$SILENT" == true ]]; then
        npm run dev > /dev/null 2>&1 &
    else
        npm run dev &
    fi
    cd - > /dev/null
    powershell.exe start $REACT_URL
fi

# Backend
if [[ "$RUN_SERVER" == true ]]; then
    echo "Starting Web API..."
    cd ./Server/Server || exit
    if [[ "$SILENT" == true ]]; then
        dotnet run > /dev/null 2>&1 &
    else
        dotnet run &
    fi
    cd - > /dev/null
    if [[ "$OPEN_SWAGGER" == true ]]; then
        powershell.exe start $SWAGGER_URL
    fi
fi

# Tests
if [[ "$RUN_TEST" == true ]]; then
    echo "Running tests..."
    cd ./ServerTest/ServerTest || exit
    if [[ "$SILENT" == true ]]; then
        dotnet test > /dev/null 2>&1 &
    else
        dotnet test &
    fi
    cd - > /dev/null
fi

echo -e "${GREEN}✅ All components started successfully!${NC}"
echo "Press Ctrl+C to stop when finished."
