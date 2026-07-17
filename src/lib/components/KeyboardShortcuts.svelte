<script>
	let open = false;
	let dialogEl;
	let triggerEl;

	const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

	/** @param {KeyboardEvent} e */
	function handleKey(e) {
		if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
			const tag = document.activeElement?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA') return;
			open = !open;
			return;
		}
		if (!open) return;
		if (e.key === 'Escape') {
			open = false;
			triggerEl?.focus();
			return;
		}
		if (e.key === 'Tab' && dialogEl) {
			const focusable = /** @type {HTMLElement[]} */ ([...dialogEl.querySelectorAll(FOCUSABLE)]);
			if (focusable.length === 0) { e.preventDefault(); return; }
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) { e.preventDefault(); last.focus(); }
			} else {
				if (document.activeElement === last) { e.preventDefault(); first.focus(); }
			}
		}
	}

	$: if (open && dialogEl) setTimeout(() => dialogEl?.focus(), 0);

	const shortcuts = [
		{ key: '← →', desc: 'Navigate images in lightbox' },
		{ key: 'Esc', desc: 'Close lightbox' },
		{ key: 'F', desc: 'Toggle favorite (in lightbox)' },
		{ key: '?', desc: 'Show / hide this panel' }
	];
</script>

<svelte:window on:keydown={handleKey} />

<button
	bind:this={triggerEl}
	on:click={() => (open = !open)}
	class="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full glass border border-mauve-600/30 flex items-center justify-center text-mauve-400/60 hover:text-mauve-400 hover:bg-mauve-600/10 transition-colors duration-200 text-sm font-bold shadow-lg"
	aria-label="Keyboard shortcuts"
	aria-expanded={open}
	aria-haspopup="dialog"
>
	?
</button>

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 overscroll-contain"
		on:click|self={() => { open = false; triggerEl?.focus(); }}
	>
		<div
			bind:this={dialogEl}
			role="dialog"
			aria-modal="true"
			aria-label="Keyboard shortcuts"
			tabindex="-1"
			class="glass rounded-2xl p-5 w-full max-w-xs animate-slide-up border border-mauve-600/20 outline-none focus-visible:ring-2 focus-visible:ring-mauve-600/50"
		>
			<p class="text-xs font-medium text-mauve-400/60 uppercase tracking-wider mb-3">Keyboard shortcuts</p>
			<div class="space-y-2.5">
				{#each shortcuts as { key, desc }}
					<div class="flex items-center justify-between gap-4">
						<span class="text-ink-700/50 text-sm">{desc}</span>
						<kbd class="px-2 py-0.5 rounded-md bg-dawn-50 border border-mauve-600/30 text-mauve-400 text-xs font-mono whitespace-nowrap">
							{key}
						</kbd>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
