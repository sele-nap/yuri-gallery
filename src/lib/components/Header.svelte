<script>
	import { favorites } from '$lib/stores/favorites.js';
	import { activeSearch, activeSort, showFavoritesOnly } from '$lib/stores/gallery.js';
	import { fetchTagSuggestions } from '$lib/utils/danbooru.js';
	import { ArrowUpDown, Heart, X } from 'lucide-svelte';

	/** @type {number} */
	export let imageCount = 0;

	let searchInput = '';
	let debounceTimer;
	let autocompleteTimer;
	let sortOpen = false;

	$: searchInput = $activeSearch;

	/** @type {import('$lib/utils/danbooru').TagSuggestion[]} */
	let suggestions = [];
	let selectedIndex = -1;

	const TAG_CATEGORIES = { 0: 'general', 1: 'artist', 3: 'copyright', 4: 'character' };

	const SORT_OPTIONS = [
		{ label: 'Latest', value: '' },
		{ label: 'Top rated', value: 'order:score' },
		{ label: 'Random', value: 'order:random' },
		{ label: 'Oldest', value: 'order:id_asc' }
	];

	$: currentSortLabel = SORT_OPTIONS.find((o) => o.value === $activeSort)?.label ?? 'Latest';

	function handleSearch() {
		clearTimeout(debounceTimer);
		clearTimeout(autocompleteTimer);
		debounceTimer = setTimeout(() => {
			activeSearch.set(searchInput.trim());
		}, 500);
		autocompleteTimer = setTimeout(async () => {
			suggestions = searchInput.trim().length >= 2
				? await fetchTagSuggestions(searchInput.trim())
				: [];
			selectedIndex = -1;
		}, 200);
	}

	/** @param {import('$lib/utils/danbooru').TagSuggestion} tag */
	function selectSuggestion(tag) {
		searchInput = tag.value;
		activeSearch.set(tag.value);
		suggestions = [];
		selectedIndex = -1;
		clearTimeout(debounceTimer);
		clearTimeout(autocompleteTimer);
	}

	/** @param {KeyboardEvent} e */
	function handleInputKey(e) {
		if (!suggestions.length) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, -1);
		} else if (e.key === 'Enter' && selectedIndex >= 0) {
			e.preventDefault();
			selectSuggestion(suggestions[selectedIndex]);
		} else if (e.key === 'Escape') {
			suggestions = [];
			selectedIndex = -1;
		}
	}

	function clearSearch() {
		searchInput = '';
		activeSearch.set('');
		suggestions = [];
	}

	function goHome() {
		searchInput = '';
		activeSearch.set('');
		activeSort.set('');
		showFavoritesOnly.set(false);
		suggestions = [];
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
			<span class="text-2xl font-display italic text-sakura-mid group-hover:text-sakura-bright transition-colors" lang="ja">
				百合
			</span>
			<span class="text-lg font-display" style="background: linear-gradient(to right, #D52D00, #EF7627, #FF9A56, #D162A4, #B55690, #A50062); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Gallery</span>
			{#if imageCount > 0}
				<span class="text-xs text-sakura-muted font-body hidden sm:inline">{imageCount} images</span>
			{/if}
		</a>

		<div class="flex-1 w-full sm:max-w-md relative">
			<label for="tag-search" class="sr-only">Search tags</label>
			<input
				id="tag-search"
				type="text"
				bind:value={searchInput}
				on:input={handleSearch}
				on:keydown={handleInputKey}
				on:blur={() => setTimeout(() => { suggestions = []; }, 150)}
				placeholder="Search tags… (e.g. cherry_blossoms)"
				role="combobox"
				autocomplete="off"
				aria-autocomplete="list"
				aria-controls="tag-suggestions"
				aria-expanded={suggestions.length > 0}
				class="w-full bg-white border border-sakura-mid/25 rounded-full px-4 py-2 text-sm text-sakura-soft placeholder:text-sakura-soft/40 focus:outline-none focus:border-sakura-mid focus:ring-2 focus:ring-sakura-mid/15 transition-colors pr-8"
			/>
			{#if searchInput}
				<button
					on:click={clearSearch}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-sakura-soft/40 hover:text-sakura-mid transition-colors"
					aria-label="Clear search"
				>
					<X size={14} />
				</button>
			{/if}

			{#if suggestions.length > 0}
				<ul
					id="tag-suggestions"
					role="listbox"
					aria-label="Tag suggestions"
					class="absolute left-0 right-0 top-full mt-1 z-50 glass rounded-xl overflow-hidden border border-sakura-mid/20 animate-slide-up"
				>
					<li aria-hidden="true" class="h-0.5 bg-gradient-to-r from-flag-red via-flag-salmon via-flag-white to-flag-purple"></li>
					{#each suggestions as suggestion, i}
						<li role="option" aria-selected={i === selectedIndex}>
							<button
								on:mousedown|preventDefault={() => selectSuggestion(suggestion)}
								class="w-full text-left px-4 py-2 text-sm flex items-center justify-between gap-2 transition-colors
									{i === selectedIndex ? 'bg-sakura-mid/15' : 'hover:bg-sakura-mid/10'}"
							>
								<span class="
									{TAG_CATEGORIES[suggestion.category] === 'artist' ? 'text-flag-salmon' :
									 TAG_CATEGORIES[suggestion.category] === 'character' ? 'text-sakura-mid' :
									 TAG_CATEGORIES[suggestion.category] === 'copyright' ? 'text-flag-purple/80' :
									 'text-sakura-soft/80'}">
									{suggestion.label}
								</span>
								<span class="text-xs text-sakura-soft/30 shrink-0">{suggestion.post_count.toLocaleString()}</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div class="flex items-center gap-2 shrink-0">
			<div class="relative">
				<button
					on:click={() => (sortOpen = !sortOpen)}
					class="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border
						{$activeSort
						? 'bg-sakura-pale text-plum-mid border-sakura-mid/40 font-semibold'
						: 'bg-white text-sakura-soft border-sakura-mid/25 hover:border-sakura-mid hover:text-sakura-mid'}"
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
						class="absolute right-0 top-full mt-2 z-50 glass rounded-xl overflow-hidden border border-plum-mid/20 w-36 animate-slide-up"
					>
						{#each SORT_OPTIONS as opt}
							<li role="option" aria-selected={$activeSort === opt.value}>
								<button
									on:click={() => setSort(opt.value)}
									class="w-full text-left px-3 py-2 text-sm transition-colors
										{$activeSort === opt.value
										? 'text-plum-mid bg-sakura-pale font-semibold'
										: 'text-sakura-soft hover:text-sakura-mid hover:bg-sakura-pale'}"
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
					? 'bg-flag-salmon text-white border-transparent font-semibold'
					: 'bg-white text-sakura-soft border-sakura-mid/25 hover:border-sakura-mid hover:text-sakura-mid'}"
				aria-label={$showFavoritesOnly ? 'Show all images' : 'Show favorites only'}
				aria-pressed={$showFavoritesOnly}
			>
				<Heart size={16} fill={$showFavoritesOnly ? 'currentColor' : 'none'} />
				<span class="hidden sm:inline">Favorites</span>
				{#if $favorites.length > 0}
					<span class="bg-white/80 text-flag-salmon text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
						{$favorites.length > 9 ? '9+' : $favorites.length}
					</span>
				{/if}
			</button>
		</div>
	</div>
</header>
