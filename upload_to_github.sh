#!/usr/bin/env bash
# Script to initialize git, commit and push to GitHub
# Usage: ./upload_to_github.sh <REMOTE_URL>

if ! command -v git >/dev/null 2>&1; then
  echo "Git is not installed. Please install Git first."
  exit 1
fi

REMOTE_URL="$1"

if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "Initial import: TecnoInnova frontend + backend"
  echo "Initial commit created."
else
  echo "Git repo already initialized. Adding and committing changes if any..."
  git add .
  git commit -m "Update: cambios locales" || echo "No hay cambios para commitear."
fi

if [ -z "$REMOTE_URL" ]; then
  echo "No remote URL provided. Create a repo on GitHub and run: ./upload_to_github.sh <REMOTE_URL>"
  exit 0
fi

git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"
git branch -M main
echo "Pushing to $REMOTE_URL (branch main)..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo "Push exitoso."
else
  echo "Error al empujar al remoto."
fi
