import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'yuri-gallery-tags';

/**
 * @typedef {{ id: number, label: string, tag: string }} PresetTag
 */

/** @type {PresetTag[]} */
const DEFAULT_TAGS = [
  { id: 1, label: 'Kiss', tag: 'kiss' },
  { id: 2, label: 'Hug', tag: 'hug' },
  { id: 3, label: 'Maid', tag: 'maid' },
  { id: 4, label: 'Flowers', tag: 'flower' },
  { id: 5, label: 'Umbrella', tag: 'umbrella' },
  { id: 6, label: 'Blush', tag: 'blush' },
  { id: 7, label: 'Rain', tag: 'rain' },
  { id: 8, label: 'Wedding', tag: 'wedding' },
  { id: 9, label: 'Yukata', tag: 'yukata' },
];

function createTagsStore() {
  const stored = browser ? localStorage.getItem(STORAGE_KEY) : null;
  const initial = stored
    ? /** @type {PresetTag[]} */ (JSON.parse(stored))
    : DEFAULT_TAGS;

  const { subscribe, update, set } = writable(initial);

  function persist(tags) {
    if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    return tags;
  }

  return {
    subscribe,
    /** @param {string} label @param {string} tag */
    add(label, tag) {
      update((tags) =>
        persist([
          ...tags,
          { id: Date.now(), label: label.trim(), tag: tag.trim() },
        ]),
      );
    },
    /** @param {number} id @param {string} label @param {string} tag */
    edit(id, label, tag) {
      update((tags) =>
        persist(
          tags.map((t) =>
            t.id === id ? { id, label: label.trim(), tag: tag.trim() } : t,
          ),
        ),
      );
    },
    /** @param {number} id */
    remove(id) {
      update((tags) => persist(tags.filter((t) => t.id !== id)));
    },
    reset() {
      set(DEFAULT_TAGS);
      if (browser) localStorage.removeItem(STORAGE_KEY);
    },
  };
}

export const presetTags = createTagsStore();
export { DEFAULT_TAGS };
