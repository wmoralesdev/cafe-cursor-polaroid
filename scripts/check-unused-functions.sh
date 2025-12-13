#!/bin/bash

# Check for unused Supabase Edge Functions
# A function is considered unused if it's not called via supabase.functions.invoke or fetch in the frontend

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Checking for unused Supabase Edge Functions...${NC}\n"

# All functions
FUNCTIONS=(
    "create-polaroid"
    "delete-polaroid"
    "get-admin-polaroids"
    "get-like-notifications"
    "get-networking-history"
    "get-networking-polaroids"
    "get-polaroid-by-id"
    "get-polaroid-by-slug"
    "get-polaroids"
    "post-polaroid"
    "record-networking-swipe"
    "toggle-polaroid-like"
    "update-polaroid"
)

USED_FUNCTIONS=()
UNUSED_FUNCTIONS=()

# Helper function to get wrapper function name
get_wrapper_func() {
    case "$1" in
        "get-networking-history") echo "getNetworkingHistory" ;;
        "get-polaroid-by-id") echo "getPolaroid" ;;
        "get-polaroid-by-slug") echo "getPolaroidBySlug" ;;
        *) echo "" ;;
    esac
}

for func in "${FUNCTIONS[@]}"; do
    USED=false
    wrapper_func=$(get_wrapper_func "$func")
    
    # If there's a wrapper function, we MUST check if the wrapper is called
    # (not just if the edge function is invoked in the wrapper definition)
    if [ -n "$wrapper_func" ]; then
        # Check if wrapper function is called (not just defined)
        if grep -r "${wrapper_func}(" src/ --exclude="src/lib/polaroids.ts" > /dev/null 2>&1; then
            USED=true
        fi
        # Also check for direct invoke calls outside of wrapper definitions
        if [ "$USED" = false ] && grep -r "functions\.invoke.*\"${func}\"" src/ --exclude="src/lib/polaroids.ts" > /dev/null 2>&1; then
            USED=true
        fi
        # Check for fetch calls outside of wrapper definitions
        if [ "$USED" = false ] && grep -r "functions/v1/${func}" src/ --exclude="src/lib/polaroids.ts" > /dev/null 2>&1; then
            USED=true
        fi
    else
        # No wrapper function - check for direct usage
        # Check for direct supabase.functions.invoke calls
        if grep -r "functions\.invoke.*\"${func}\"" src/ > /dev/null 2>&1; then
            USED=true
        fi
        
        # Check for fetch calls to the function URL
        if [ "$USED" = false ] && grep -r "functions/v1/${func}" src/ > /dev/null 2>&1; then
            USED=true
        fi
        
        # Check for function name in strings (might be used dynamically)
        if [ "$USED" = false ] && (grep -r "\"${func}\"" src/ > /dev/null 2>&1 || grep -r "'${func}'" src/ > /dev/null 2>&1); then
            USED=true
        fi
    fi
    
    if [ "$USED" = true ]; then
        USED_FUNCTIONS+=("${func}")
    else
        UNUSED_FUNCTIONS+=("${func}")
    fi
done

# Print results
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Function Usage Analysis${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${GREEN}✅ Used Functions (${#USED_FUNCTIONS[@]}/${#FUNCTIONS[@]}):${NC}"
for func in "${USED_FUNCTIONS[@]}"; do
    echo -e "   ✓ ${func}"
done

if [ ${#UNUSED_FUNCTIONS[@]} -gt 0 ]; then
    echo -e "\n${RED}❌ Unused Functions (${#UNUSED_FUNCTIONS[@]}):${NC}"
    for func in "${UNUSED_FUNCTIONS[@]}"; do
        echo -e "   ✗ ${func}"
    done
    echo -e "\n${YELLOW}💡 These functions are not called from the frontend codebase.${NC}"
    echo -e "${YELLOW}   Consider removing them if they're no longer needed.${NC}"
    exit 1
else
    echo -e "\n${GREEN}🎉 All functions are being used!${NC}"
    exit 0
fi

