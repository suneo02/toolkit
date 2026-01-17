# Quick Start Guide

## 🚀 First Time Setup

```bash
# Clone this repository
git clone <repo-url> ~/Documents/suneo-agent-skills
cd ~/Documents/suneo-agent-skills

# Initialize for Codex (backs up existing skills)
node scripts/codex.js bootstrap

# Initialize for Gemini (backs up existing skills)
node scripts/gemini.js bootstrap
```

## 📦 Daily Sync

```bash
# Sync Codex skills (pulls latest from Git)
node scripts/codex.js sync

# Sync Gemini skills
node scripts/gemini.js sync
```

## ➕ Add New Skill

```bash
# After agent creates a new skill, adopt it into the repo
node scripts/codex.js adopt my-new-skill

# Commit to Git
git add skills/my-new-skill
git commit -m "Add new skill: my-new-skill"
git push
```

## 📋 View Status

```bash
# List all skills and their link status
node scripts/codex.js list
node scripts/gemini.js list
```

## 📖 Full Documentation

See [docs/skills-management.md](./docs/skills-management.md) for complete documentation.

## 🆘 Help

```bash
node scripts/codex.js help
node scripts/gemini.js help
```
