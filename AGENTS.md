# Challenge Aufgaben & Lösungsarchiv — Agent Instructions

## Project Overview

Single-page German-language challenge tracking app. No build step — plain HTML + CSS + JS, Supabase (PostgreSQL) for sync, localStorage as offline fallback.

## Architecture

| File | Role |
|------|------|
| `index.html` + `script.js` | Main dashboard, task CRUD, admin panel, Supabase sync |
| `chat.html` + `chat.js` | Community chat with user registration and file uploads |
| `aichat.html` + `aichat.js` | ARIA AI chatbot challenge (resistance/trust mechanic) |
| `style.css` | Dark-mode design system via CSS custom properties |

**Data flow:** User action → event handler → mutate `state` object → `saveTasks()` → Supabase upsert (or localStorage fallback) → re-render UI

**Realtime:** Supabase Postgres channels subscribed on `tasks`, `tips`, `chat_users`, `chat_messages`; also refreshes on `window focus`.

## Key Conventions

- `localStorage` keys are prefixed with `ks_` (e.g. `ks_tasks`, `ks_admin_password`)
- Task IDs: `task-N` for defaults, `task-{timestamp}` for user-created
- All UI strings and comments are in **German**
- Task publish cadence: Sundays (tasks), Wednesdays (tips)
- Validation modes: `auto` (regex pattern match) or `manual` (admin review)

## Supabase Tables

`tasks`, `tips`, `chat_users`, `chat_messages`, `ai_challenge_state` — see `script.js` for full field reference.

## Git Sync

> This project has **no git repository yet**. When initializing:

1. **Create `.gitignore` first** — SSL certificate files (`.cer`, `.key`, `.zip`) and any `.env` files must be excluded before the first commit.
2. **Hardcoded secrets** — `SUPABASE_URL`, `SUPABASE_KEY`, and `ADMIN_PASSWORD` are currently inline in `script.js` and `chat.js`. Before pushing to a remote, extract them or acknowledge they are public anon keys.
3. **Recommended remote:** GitHub (private repo)
4. **Suggested branch strategy:** `main` (production) + feature branches

### Typical Git Sync Workflow

```bash
# First-time setup
git init
git add .gitignore
git add .
git commit -m "initial commit"
git remote add origin <repo-url>
git push -u origin main

# Ongoing sync
git pull --rebase origin main   # get remote changes
# ... edit files ...
git add -p                      # review changes
git commit -m "<message>"
git push origin main
```

### .gitignore essentials for this project

```
*.cer
*.key
*.zip
.env
.env.*
```

## Running the App

No install or build needed. Open `index.html` in a browser, or serve over HTTPS using the provided SSL certificates with a static server (e.g. `npx serve .`).
