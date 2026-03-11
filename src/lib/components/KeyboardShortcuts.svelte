<script>
	let open = false;

	/** @param {KeyboardEvent} e */
	function handleKey(e) {
		if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
			const tag = document.activeElement?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA') return;
			open = !open;
		}
		if (e.key === 'Escape') open = false;
	}

	const shortcuts = [
		{ key: '← →', desc: 'Navigate images in lightbox' },
		{ key: 'Esc', desc: 'Close lightbox' },
		{ key: 'F', desc: 'Toggle favorite (in lightbox)' },
		{ key: '?', desc: 'Show / hide this panel' }
	];
</script>

<svelte:window on:keydown={handleKey} />

<button
	on:click={() => (open = !open)}
	class="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full glass border border-purple-mid/30 flex items-center justify-center text-purple-soft/60 hover:text-purple-soft hover:bg-purple-mid/10 transition-all duration-200 text-sm font-bold shadow-lg"
	aria-label="Keyboard shortcuts"
>
	?
</button>

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
		on:click|self={() => (open = false)}
	>
		<div class="glass rounded-2xl p-5 w-full max-w-xs animate-slide-up border border-purple-mid/20">
			<p class="text-xs font-medium text-purple-soft/60 uppercase tracking-wider mb-3">Keyboard shortcuts</p>
			<div class="space-y-2.5">
				{#each shortcuts as { key, desc }}
					<div class="flex items-center justify-between gap-4">
						<span class="text-pink-soft/50 text-sm">{desc}</span>
						<kbd class="px-2 py-0.5 rounded-md bg-bg-primary border border-purple-mid/30 text-purple-soft text-xs font-mono whitespace-nowrap">
							{key}
						</kbd>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
