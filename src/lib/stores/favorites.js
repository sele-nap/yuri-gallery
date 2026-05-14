import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'yuri-gallery-favorites';

function createFavoritesStore() {
  const initial = browser
    ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    : [];

  const { subscribe, update, set } = writable(
    /** @type {number[]} */ (initial),
  );

  function toggle(id) {
    update((ids) => {
      const next = ids.includes(id)
        ? ids.filter((i) => i !== id)
        : [...ids, id];
      if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clear() {
    set([]);
    if (browser) localStorage.removeItem(STORAGE_KEY);
  }

  return { subscribe, toggle, clear };
}

export const favorites = createFavoritesStore();
