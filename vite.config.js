// vite.config.js
// Vite build configuration for GadiW.
// Created: 29/04/2026 (Lesson 10A)
//
// base: '/GadiW/' — required for GitHub Pages deployment.
// GitHub Pages serves the site at https://avshi2-maker.github.io/GadiW/
// so all asset paths (CSS, JS, images) need that prefix at build time.
// Local dev (npm run dev) is unaffected — Vite ignores `base` in dev mode.

import { defineConfig } from 'vite';

export default defineConfig({
  base: '/GadiW/',
});