#!/bin/bash
# ==============================================================================
# CyberRiskTwin (SIH260105) - One-Click GitHub Push Script
# Target Repository: https://github.com/Anusha-demonslayer/SIH260105
# ==============================================================================

set -e

REPO_URL="github.com/Anusha-demonslayer/SIH260105.git"

if [ -z "$1" ]; then
  echo "=================================================================="
  echo "  CyberRiskTwin (SIH260105) GitHub Push Assistant"
  echo "=================================================================="
  echo "Usage: ./push_to_github.sh <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>"
  echo ""
  echo "Alternatively, if you already have SSH keys or credentials configured:"
  echo "       git push -u origin main"
  echo "=================================================================="
  exit 1
fi

GITHUB_TOKEN="$1"

echo "Configuring remote origin with provided GitHub Personal Access Token..."
git remote set-url origin "https://${GITHUB_TOKEN}@${REPO_URL}"

echo "Pushing branch 'main' to https://github.com/Anusha-demonslayer/SIH260105..."
git push -u origin main --force

# Reset origin URL to clean HTTPS to avoid storing token in .git/config
git remote set-url origin "https://${REPO_URL}"

echo "✅ SUCCESS: All codes and documentation successfully pushed to:"
echo "   https://github.com/Anusha-demonslayer/SIH260105"
