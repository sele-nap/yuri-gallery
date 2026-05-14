<script>
	import { favorites } from '$lib/stores/favorites.js';
	import { activeSearch, activeSort, showFavoritesOnly } from '$lib/stores/gallery.js';
	import { ArrowUpDown, Heart, X } from 'lucide-svelte';

	/** @type {number} */
	export let imageCount = 0;

	let searchInput = '';
	let debounceTimer;
	let sortOpen = false;

	const SORT_OPTIONS = [
		{ label: 'Latest', value: '' },
		{ label: 'Top rated', value: 'order:score' },
		{ label: 'Random', value: 'order:random' },
		{ label: 'Oldest', value: 'order:id_asc' }
	];

	$: currentSortLabel = SORT_OPTIONS.find((o) => o.value === $activeSort)?.label ?? 'Latest';

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

	function goHome() {
		searchInput = '';
		activeSearch.set('');
		activeSort.set('');
		showFavoritesOnly.set(false);
	}

	/** @param {string} value */
	function setSort(value) {
		activeSort.set(value);
		sortOpen = false;
	}

	/** @param {KeyboardEvent} e */
	function handleKey(e) {
		if (e.key === 'Escape') sortOpen = false;
	}
</script>

<svelte:window on:keydown={handleKey} />

<header class="glass sticky top-0 z-40 px-4 py-3">
	<div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3">
		<a href="/" on:click={goHome} class="flex items-center gap-2 shrink-0 group">
			<span class="text-2xl font-display italic text-pink-mid group-hover:text-pink-bright transition-colors">
				百合
			</span>
			<span class="text-lg font-display text-pink-soft/80">Gallery</span>
			{#if imageCount > 0}
				<span class="text-xs text-pink-soft/30 font-body hidden sm:inline">{imageCount} images</span>
			{/if}
		</a>

		<div class="flex-1 w-full sm:max-w-md relative">
			<label for="tag-search" class="sr-only">Search tags</label>
			<input
				id="tag-search"
				type="text"
				bind:value={searchInput}
				on:input={handleSearch}
				placeholder="Search tags… (e.g. cherry_blossoms)"
				class="w-full bg-bg-primary/60 border border-purple-mid/30 rounded-full px-4 py-2 text-sm text-pink-soft placeholder:text-pink-soft/30 focus:outline-none focus:border-pink-mid/60 transition-colors pr-8"
			/>
			{#if searchInput}
				<button
					on:click={clearSearch}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-pink-soft/40 hover:text-pink-mid transition-colors"
					aria-label="Clear search"
				>
					<X size={14} />
				</button>
			{/if}
		</div>

		<div class="flex items-center gap-2 shrink-0">
			<div class="relative">
				<button
					on:click={() => (sortOpen = !sortOpen)}
					class="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border
						{$activeSort
						? 'bg-purple-mid/20 text-purple-soft border-purple-mid/40'
						: 'bg-transparent text-pink-soft/60 border-pink-soft/20 hover:border-purple-mid/30 hover:text-pink-soft'}"
					aria-label="Sort"
					aria-expanded={sortOpen}
					aria-haspopup="listbox"
				>
					<ArrowUpDown size={14} />
					<span class="hidden sm:inline text-xs">{currentSortLabel}</span>
				</button>

				{#if sortOpen}
					<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
					<div
						class="fixed inset-0 z-40"
						on:click={() => (sortOpen = false)}
					></div>
					<ul
						role="listbox"
						aria-label="Sort order"
						class="absolute right-0 top-full mt-2 z-50 glass rounded-xl overflow-hidden border border-purple-mid/20 w-36 animate-slide-up"
					>
						{#each SORT_OPTIONS as opt}
							<li role="option" aria-selected={$activeSort === opt.value}>
								<button
									on:click={() => setSort(opt.value)}
									class="w-full text-left px-3 py-2 text-sm transition-colors
										{$activeSort === opt.value
										? 'text-purple-soft bg-purple-mid/20'
										: 'text-pink-soft/60 hover:text-pink-soft hover:bg-purple-mid/10'}"
								>
									{opt.label}
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<button
				on:click={() => showFavoritesOnly.update((v) => !v)}
				class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
					{$showFavoritesOnly
					? 'bg-pink-mid/20 text-pink-mid border-pink-mid/40'
					: 'bg-transparent text-pink-soft/60 border-pink-soft/20 hover:border-pink-mid/30 hover:text-pink-soft'}"
				aria-label={$showFavoritesOnly ? 'Show all images' : 'Show favorites only'}
				aria-pressed={$showFavoritesOnly}
			>
				<Heart size={16} fill={$showFavoritesOnly ? 'currentColor' : 'none'} />
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
