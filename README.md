# 百合 Gallery

A yuri image gallery powered by the [Danbooru](https://danbooru.donmai.us) public API.

## Features

- **Infinite scroll** — images load automatically as you scroll
- **Masonry grid** — dynamic layout with fade-in animations
- **Lightbox** — click any image to open a full view with tags, resolution, and score
- **Search** — filter by any Danbooru tag
- **Quick filters** — preset tag buttons (Kiss, Hug, School, Rain…)
- **Sort** — by latest, top rated, random, or oldest
- **Favorites** — save images locally (persisted in `localStorage`)
- **Slideshow** — auto-advance images in the lightbox every 3 seconds
- **Copy link** — copy a Danbooru post URL to clipboard
- **Keyboard shortcuts** — `←` `→` navigate, `Esc` close, `F` toggle favorite, `?` show shortcuts

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