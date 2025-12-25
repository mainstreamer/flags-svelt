# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server with live reload (port 8080)
npm run build        # Create production build
npm run start        # Serve production build from public/
```

## Architecture

This is a **Svelte 3 SPA** (capitals quiz game) built with Rollup. Not SvelteKit.

### Key Files

- `src/main.js` - Entry point, mounts App to document body
- `src/App.svelte` - Root component, manages game state and authentication flow
- `src/Constants.js` - API base URL configuration (toggle between localhost/production)
- `src/CustomFetch.js` - Fetch wrapper that injects JWT Bearer token from localStorage

### Component Structure

- **App.svelte** - Orchestrates login → region selection → quiz → game over flow
- **TelegramLoginWidget.svelte** - Telegram OAuth login
- **HighScores.svelte** - Region picker and leaderboard display
- **FetchCapitalsQuestion.svelte** - Quiz question display, answer handling, scoring
- **Component.svelte** - Timer component (30s countdown)

### State & Communication

- No centralized store; state lives in App.svelte and flows via props
- Child→parent communication uses Svelte `createEventDispatcher` events:
  - `triggerGameOver`, `updateTimeTotal`, `timerStopped`, etc.
- Auth token stored in `localStorage` as "token"

## Backend API

Requires a backend running at the URL configured in `src/Constants.js` (default: `http://localhost:8000`).

Key endpoints:
- `POST /capitals/game-start/:gameType` - Start game
- `GET /capitals/question/:gameId` - Get next question
- `GET /capitals/answer/:gameId/:countryCode/:answer` - Submit answer (answer is base64 encoded)
- `POST /capitals/game-over` - End game
- `GET /capitals/high-scores/:region` - Leaderboard
- `GET /api/tg/login` - Telegram auth
