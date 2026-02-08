# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Kevin Zhang, built with React + TypeScript and deployed to GitHub Pages at `https://kevinzhang30.github.io/`.

## Commands

- **Dev server:** `npm start` (localhost:3000)
- **Build:** `npm run build`
- **Test:** `npm test` (react-scripts test, watch mode by default; use `npm test -- --watchAll=false` for CI)
- **Deploy:** `npm run deploy` (builds then pushes to gh-pages branch)

## Tech Stack

- React 19 with TypeScript, bootstrapped with Create React App (react-scripts)
- Material-UI (MUI) 7 for components and layout
- Framer Motion for animations
- React Router DOM 7 for client-side routing
- Leaflet / React Leaflet for the interactive travel map
- React PDF for embedded resume viewing
- Emotion for CSS-in-JS styling

## Architecture

**Routing:** App.tsx defines all routes and wraps the app in MUI ThemeProvider. Routes map to page components: `/` (Home), `/resume`, `/projects`, `/gallery`, `/map`.

**Configuration-driven content:** Page content is defined in JSON files under `public/config/` (skills, projects, resume, gallery, travel, current-work, personal-info). Pages fetch their config at mount time with `fetch()` and fall back to hardcoded defaults on failure. To update site content, edit the JSON configs — no code changes needed.

**Component structure:** `src/components/` has shared components (Header, Footer). `src/pages/` has the five page components. Each page is self-contained with its own data fetching, state, search/filter logic, and animations.

**Theming:** Custom MUI theme in App.tsx with primary (#00838f teal) and secondary (#1976d2 blue) colors.

**Patterns used across pages:**
- Fetch-with-fallback for loading JSON config
- Framer Motion variant objects with staggered children animations
- MUI responsive grid via `gridTemplateColumns` breakpoints
- Client-side search/filter with `Array.filter()` and `toLowerCase()`

## Deployment Notes

- `homepage` in package.json is set to `"."` for relative routing on GitHub Pages
- The `build/` directory is committed to the repo
