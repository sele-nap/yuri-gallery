<script>
	import { presetTags } from '$lib/stores/tags.js';
	import { Check, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-svelte';
	import { onDestroy } from 'svelte';

	export let open = false;

	let dialogEl;
	let openerEl;
	let newLabel = '';
	let newTag = '';
	let newLabelEl;

	/** @type {number | null} */
	let editingId = null;
	let editLabel = '';
	let editTag = '';

	$: if (open) {
		openerEl = /** @type {HTMLElement | null} */ (document.activeElement);
		setTimeout(() => dialogEl?.focus(), 0);
	}

	function close() {
		open = false;
		editingId = null;
		setTimeout(() => openerEl?.focus(), 0);
	}

	function addTag() {
		if (!newLabel.trim() || !newTag.trim()) return;
		presetTags.add(newLabel, newTag);
		newLabel = '';
		newTag = '';
		newLabelEl?.focus();
	}

	/** @param {import('$lib/stores/tags').PresetTag} t */
	function startEdit(t) {
		editingId = t.id;
		editLabel = t.label;
		editTag = t.tag;
	}

	function saveEdit() {
		if (editingId !== null && editLabel.trim() && editTag.trim()) {
			presetTags.edit(editingId, editLabel, editTag);
		}
		editingId = null;
	}

	function cancelEdit() {
		editingId = null;
	}

	/** @param {import('$lib/stores/tags').PresetTag} t */
	function removeTag(t) {
		if (confirm(`Remove "${t.label}" from your filter tags?`)) {
			presetTags.remove(t.id);
		}
	}

	function resetTags() {
		if (confirm('Reset all filter tags to the defaults? This removes any tags you added or edited.')) {
			presetTags.reset();
		}
	}

	/** @param {KeyboardEvent} e */
	function handleKey(e) {
		if (!open) return;
		if (e.key === 'Escape') { close(); return; }
		if (e.key === 'Tab' && dialogEl) {
			const focusable = /** @type {HTMLElement[]} */ ([...dialogEl.querySelectorAll(
				'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
			)]);
			if (!focusable.length) { e.preventDefault(); return; }
			const first = focusable[0], last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
			else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
		}
	}

	onDestroy(() => { open = false; });
</script>

<svelte:window on:keydown={handleKey} />

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-[70] bg-dawn-50/90 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
		on:click|self={close}
	>
		<div
			bind:this={dialogEl}
			role="dialog"
			aria-modal="true"
			aria-label="Manage filter tags"
			tabindex="-1"
			class="glass rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 animate-slide-up"
		>
			<div class="flex items-center justify-between px-5 py-4 border-b border-rose-500/15">
				<h2 class="text-display-lg font-display font-semibold text-ink-700">Filter tags</h2>
				<button
					on:click={close}
					class="w-8 h-8 rounded-full flex items-center justify-center text-ink-700/60 hover:text-rose-500 hover:bg-blush-100 transition-colors"
					aria-label="Close"
				>
					<X size={16} />
				</button>
			</div>

			<ul class="flex-1 overflow-y-auto px-4 py-3 space-y-2">
				{#each $presetTags as t (t.id)}
					<li class="flex items-center gap-2">
						{#if editingId === t.id}
							<input
								bind:value={editLabel}
								placeholder="Label"
								aria-label="Tag label"
								class="flex-1 min-w-0 bg-paper border border-rose-500/30 rounded-lg px-3 py-1.5 text-sm text-ink-700 placeholder:text-ink-700/40 focus:outline-none focus:border-rose-500"
							/>
							<input
								bind:value={editTag}
								placeholder="danbooru_tag"
								aria-label="Danbooru tag"
								spellcheck="false"
								on:keydown={(e) => e.key === 'Enter' && saveEdit()}
								class="flex-1 min-w-0 bg-paper border border-rose-500/30 rounded-lg px-3 py-1.5 text-sm text-ink-700 placeholder:text-ink-700/40 focus:outline-none focus:border-rose-500 font-mono"
							/>
							<button on:click={saveEdit} class="w-7 h-7 rounded-full flex items-center justify-center text-rose-500 hover:bg-blush-100 transition-colors" aria-label="Save">
								<Check size={14} />
							</button>
							<button on:click={cancelEdit} class="w-7 h-7 rounded-full flex items-center justify-center text-ink-700/50 hover:bg-blush-100 transition-colors" aria-label="Cancel">
								<X size={14} />
							</button>
						{:else}
							<span class="flex-1 text-sm font-medium text-ink-700">{t.label}</span>
							<span class="text-xs text-ink-700/50 font-mono truncate max-w-[120px]">{t.tag}</span>
							<button on:click={() => startEdit(t)} class="w-7 h-7 rounded-full flex items-center justify-center text-ink-700/50 hover:text-rose-500 hover:bg-blush-100 transition-colors" aria-label="Edit {t.label}">
								<Pencil size={13} />
							</button>
							<button on:click={() => removeTag(t)} class="w-7 h-7 rounded-full flex items-center justify-center text-ink-700/50 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete {t.label}">
								<Trash2 size={13} />
							</button>
						{/if}
					</li>
				{/each}
			</ul>

			<div class="px-4 py-3 border-t border-rose-500/15 space-y-2">
				<p class="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-2">Add a tag</p>
				<div class="flex gap-2">
					<input
						bind:this={newLabelEl}
						bind:value={newLabel}
						placeholder="Label (e.g. Holding hands)"
						aria-label="New tag label"
						class="flex-1 min-w-0 bg-paper border border-rose-500/25 rounded-lg px-3 py-1.5 text-sm text-ink-700 placeholder:text-ink-700/40 focus:outline-none focus:border-rose-500"
					/>
					<input
						bind:value={newTag}
						placeholder="tag (e.g. holding_hands)"
						aria-label="New Danbooru tag"
						spellcheck="false"
						on:keydown={(e) => e.key === 'Enter' && addTag()}
						class="flex-1 min-w-0 bg-paper border border-rose-500/25 rounded-lg px-3 py-1.5 text-sm text-ink-700 placeholder:text-ink-700/40 focus:outline-none focus:border-rose-500 font-mono"
					/>
					<button
						on:click={addTag}
						disabled={!newLabel.trim() || !newTag.trim()}
						class="w-8 h-8 rounded-full flex items-center justify-center text-white bg-rose-500 hover:bg-mauve-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
						aria-label="Add tag"
					>
						<Plus size={16} />
					</button>
				</div>
			</div>

			<div class="px-4 py-3 border-t border-rose-500/15 flex justify-end">
				<button
					on:click={resetTags}
					class="flex items-center gap-1.5 text-xs text-ink-700/60 hover:text-rose-500 transition-colors"
				>
					<RotateCcw size={12} />
					Reset to defaults
				</button>
			</div>
		</div>
	</div>
{/if}
