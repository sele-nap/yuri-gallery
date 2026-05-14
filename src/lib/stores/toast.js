import { writable } from 'svelte/store';

/** @typedef {{ id: number, message: string, type: 'success' | 'info' }} Toast */

const { subscribe, update } = writable(/** @type {Toast[]} */ ([]));

let nextId = 0;

function add(message, type = 'success', duration = 2200) {
  const id = nextId++;
  update((toasts) => [...toasts, { id, message, type }]);
  setTimeout(() => remove(id), duration);
}

function remove(id) {
  update((toasts) => toasts.filter((t) => t.id !== id));
}

export const toast = { subscribe, add, remove };
