#!/bin/bash

# Deploy all Supabase Edge Functions
# This script deploys all functions to the linked Supabase project

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Supabase Edge Functions...${NC}\n"

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed.${NC}"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -d "supabase/functions" ]; then
    echo -e "${RED}❌ Error: supabase/functions directory not found.${NC}"
    echo "Please run this script from the project root."
    exit 1
fi

# Get list of functions (all directories in supabase/functions except deno.json)
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
    "set-mark-for-printing"
)

# Functions that should allow anonymous access (no JWT verification)
ANONYMOUS_FUNCTIONS=("get-polaroids")

# Deploy each function
SUCCESS_COUNT=0
FAILED_FUNCTIONS=()

for func in "${FUNCTIONS[@]}"; do
    echo -e "${BLUE}📦 Deploying ${func}...${NC}"
    
    # Check if function should allow anonymous access
    IS_ANONYMOUS=false
    for anon_func in "${ANONYMOUS_FUNCTIONS[@]}"; do
        if [ "${func}" == "${anon_func}" ]; then
            IS_ANONYMOUS=true
            break
        fi
    done
    
    # Deploy with appropriate flags
    if [ "$IS_ANONYMOUS" = true ]; then
        # Deploy without JWT verification for anonymous access
        if supabase functions deploy "${func}" --no-verify-jwt; then
            echo -e "${GREEN}✅ ${func} deployed successfully (anonymous access enabled)${NC}\n"
            ((SUCCESS_COUNT++))
        else
            echo -e "${RED}❌ Failed to deploy ${func}${NC}\n"
            FAILED_FUNCTIONS+=("${func}")
        fi
    else
        # Deploy with JWT verification (default)
        if supabase functions deploy "${func}"; then
            echo -e "${GREEN}✅ ${func} deployed successfully${NC}\n"
            ((SUCCESS_COUNT++))
        else
            echo -e "${RED}❌ Failed to deploy ${func}${NC}\n"
            FAILED_FUNCTIONS+=("${func}")
        fi
    fi
done

# Summary
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Deployment Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Successfully deployed: ${SUCCESS_COUNT}/${#FUNCTIONS[@]}${NC}"

if [ ${#FAILED_FUNCTIONS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Failed functions:${NC}"
    for func in "${FAILED_FUNCTIONS[@]}"; do
        echo -e "   - ${func}"
    done
    echo -e "\n${YELLOW}💡 Tip: Make sure you're logged in with 'supabase login' and linked to your project${NC}"
    exit 1
fi

echo -e "\n${YELLOW}ℹ️  Note: 'get-polaroids' has been deployed with --no-verify-jwt for anonymous access${NC}"
echo -e "${YELLOW}   You can verify this in Supabase Dashboard → Edge Functions → get-polaroids${NC}\n"

echo -e "${GREEN}🎉 All functions deployed successfully!${NC}"

