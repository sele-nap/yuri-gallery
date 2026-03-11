import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'yuri-gallery-favorites';

function createFavoritesStore() {
	const initial = browser
		? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		: [];

	const { subscribe, update, set } = writable(/** @type {number[]} */ (initial));

	/** @param {number} id */
	function toggle(id) {
		update((ids) => {
			const next = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
			if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			return next;
		});
	}

	/** @param {number} id */
	function has(id) {
		let result = false;
		subscribe((ids) => (result = ids.includes(id)))();
		return result;
	}

	function clear() {
		set([]);
		if (browser) localStorage.removeItem(STORAGE_KEY);
	}

	return { subscribe, toggle, has, clear };
}

export const favorites = createFavoritesStore();
