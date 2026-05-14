import { writable } from 'svelte/store';

export const lightboxPost = writable(
  /** @type {import('../utils/danbooru').DanbooruPost | null} */ (null),
);
export const activeSearch = writable('');
export const activeSort = writable('');
export const showFavoritesOnly = writable(false);
