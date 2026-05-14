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
		class="fixed inset-0 z-[70] bg-bg-primary/90 backdrop-blur-sm flex items-center justify-center p-4"
		on:click|self={close}
	>
		<div
			bind:this={dialogEl}
			role="dialog"
			aria-modal="true"
			aria-label="Manage filter tags"
			tabindex="-1"
			class="glass rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col focus:outline-none animate-slide-up"
		>
			<!-- Header -->
			<div class="flex items-center justify-between px-5 py-4 border-b border-sakura-mid/15">
				<h2 class="text-base font-display font-semibold text-sakura-soft">Filter tags</h2>
				<button
					on:click={close}
					class="w-8 h-8 rounded-full flex items-center justify-center text-sakura-soft/60 hover:text-sakura-mid hover:bg-sakura-pale transition-colors"
					aria-label="Close"
				>
					<X size={16} />
				</button>
			</div>

			<!-- Tag list -->
			<ul class="flex-1 overflow-y-auto px-4 py-3 space-y-2">
				{#each $presetTags as t (t.id)}
					<li class="flex items-center gap-2">
						{#if editingId === t.id}
							<input
								bind:value={editLabel}
								placeholder="Label"
								class="flex-1 min-w-0 bg-white border border-sakura-mid/30 rounded-lg px-3 py-1.5 text-sm text-sakura-soft placeholder:text-sakura-soft/40 focus:outline-none focus:border-sakura-mid"
							/>
							<input
								bind:value={editTag}
								placeholder="danbooru_tag"
								on:keydown={(e) => e.key === 'Enter' && saveEdit()}
								class="flex-1 min-w-0 bg-white border border-sakura-mid/30 rounded-lg px-3 py-1.5 text-sm text-sakura-soft placeholder:text-sakura-soft/40 focus:outline-none focus:border-sakura-mid font-mono"
							/>
							<button on:click={saveEdit} class="w-7 h-7 rounded-full flex items-center justify-center text-sakura-mid hover:bg-sakura-pale transition-colors" aria-label="Save">
								<Check size={14} />
							</button>
							<button on:click={cancelEdit} class="w-7 h-7 rounded-full flex items-center justify-center text-sakura-soft/50 hover:bg-sakura-pale transition-colors" aria-label="Cancel">
								<X size={14} />
							</button>
						{:else}
							<span class="flex-1 text-sm font-medium text-sakura-soft">{t.label}</span>
							<span class="text-xs text-sakura-soft/50 font-mono truncate max-w-[120px]">{t.tag}</span>
							<button on:click={() => startEdit(t)} class="w-7 h-7 rounded-full flex items-center justify-center text-sakura-soft/50 hover:text-sakura-mid hover:bg-sakura-pale transition-colors" aria-label="Edit {t.label}">
								<Pencil size={13} />
							</button>
							<button on:click={() => presetTags.remove(t.id)} class="w-7 h-7 rounded-full flex items-center justify-center text-sakura-soft/50 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete {t.label}">
								<Trash2 size={13} />
							</button>
						{/if}
					</li>
				{/each}
			</ul>

			<!-- Add new tag -->
			<div class="px-4 py-3 border-t border-sakura-mid/15 space-y-2">
				<p class="text-xs font-semibold uppercase tracking-wider text-sakura-mid mb-2">Add a tag</p>
				<div class="flex gap-2">
					<input
						bind:this={newLabelEl}
						bind:value={newLabel}
						placeholder="Label (e.g. Holding hands)"
						class="flex-1 min-w-0 bg-white border border-sakura-mid/25 rounded-lg px-3 py-1.5 text-sm text-sakura-soft placeholder:text-sakura-soft/40 focus:outline-none focus:border-sakura-mid"
					/>
					<input
						bind:value={newTag}
						placeholder="tag (e.g. holding_hands)"
						on:keydown={(e) => e.key === 'Enter' && addTag()}
						class="flex-1 min-w-0 bg-white border border-sakura-mid/25 rounded-lg px-3 py-1.5 text-sm text-sakura-soft placeholder:text-sakura-soft/40 focus:outline-none focus:border-sakura-mid font-mono"
					/>
					<button
						on:click={addTag}
						disabled={!newLabel.trim() || !newTag.trim()}
						class="w-8 h-8 rounded-full flex items-center justify-center text-white bg-sakura-mid hover:bg-plum-mid disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
						aria-label="Add tag"
					>
						<Plus size={16} />
					</button>
				</div>
			</div>

			<!-- Footer -->
			<div class="px-4 py-3 border-t border-sakura-mid/15 flex justify-end">
				<button
					on:click={() => { presetTags.reset(); }}
					class="flex items-center gap-1.5 text-xs text-sakura-soft/60 hover:text-sakura-mid transition-colors"
				>
					<RotateCcw size={12} />
					Reset to defaults
				</button>
			</div>
		</div>
	</div>
{/if}
