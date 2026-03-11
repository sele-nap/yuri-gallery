# 百合 Gallery

A yuri image gallery powered by the [Danbooru](https://danbooru.donmai.us) public API.

## Features

- **Infinite scroll** — stable masonry columns, no position shifts on new batches
- **Lightbox** — full view with tags, resolution, score, slideshow, and download
- **Search & filters** — by tag, quick presets, and sort order
- **Favorites** — persisted in `localStorage`
- **Keyboard shortcuts** — `←` `→` navigate, `Esc` close, `F` favorite, `?` help
- **Responsive** — 2 to 5 columns depending on screen width

## Stack

- [SvelteKit](https://kit.svelte.dev) with static adapter
- [Tailwind CSS](https://tailwindcss.com)
- Danbooru public API (no auth required, `rating:s` only)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```