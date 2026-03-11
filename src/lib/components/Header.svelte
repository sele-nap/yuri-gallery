<script>
	import { showFavoritesOnly, activeSearch } from '$lib/stores/gallery.js';
	import { favorites } from '$lib/stores/favorites.js';

	/** @type {string} */
	let searchInput = '';
	let debounceTimer;

	function handleSearch() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			activeSearch.set(searchInput.trim());
		}, 500);
	}

	function clearSearch() {
		searchInput = '';
		activeSearch.set('');
	}
</script>

<header class="glass sticky top-0 z-40 px-4 py-3">
	<div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3">
		<!-- Logo -->
		<a href="/" class="flex items-center gap-2 shrink-0 group">
			<span class="text-2xl font-display italic text-pink-mid group-hover:text-pink-bright transition-colors">
				百合
			</span>
			<span class="text-lg font-display text-pink-soft/80">Gallery</span>
		</a>

		<!-- Search -->
		<div class="flex-1 w-full sm:max-w-md relative">
			<input
				type="text"
				bind:value={searchInput}
				on:input={handleSearch}
				placeholder="Search tags… (e.g. school_uniform)"
				class="w-full bg-bg-primary/60 border border-purple-mid/30 rounded-full px-4 py-2 text-sm text-pink-soft placeholder:text-pink-soft/30 focus:outline-none focus:border-pink-mid/60 transition-colors pr-8"
			/>
			{#if searchInput}
				<button
					on:click={clearSearch}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-pink-soft/40 hover:text-pink-mid transition-colors"
					aria-label="Clear search"
				>
					✕
				</button>
			{/if}
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-2 shrink-0">
			<button
				on:click={() => showFavoritesOnly.update((v) => !v)}
				class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
					{$showFavoritesOnly
					? 'bg-pink-mid/20 text-pink-mid border-pink-mid/40'
					: 'bg-transparent text-pink-soft/60 border-pink-soft/20 hover:border-pink-mid/30 hover:text-pink-soft'}"
				title="My favorites"
			>
				<span class="text-base">{$showFavoritesOnly ? '♥' : '♡'}</span>
				<span class="hidden sm:inline">Favorites</span>
				{#if $favorites.length > 0}
					<span class="bg-pink-mid text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
						{$favorites.length > 9 ? '9+' : $favorites.length}
					</span>
				{/if}
			</button>
		</div>
	</div>
</header>
