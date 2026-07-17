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

<header class="glass-header sticky top-0 z-40 px-4 py-3">
	<div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3">
		<a href="/" on:click={goHome} class="flex items-center gap-3 shrink-0 group">
			<h1 class="contents">
				<span class="font-display text-display-xl text-rose-500 group-hover:text-coral-500 transition-colors" lang="ja">
					百合
				</span>
				<span class="flex flex-col gap-1">
					<span class="font-body text-xs font-semibold tracking-[0.3em] uppercase text-mauve-600">Gallery</span>
					<span class="h-px w-10 bg-rose-500/40"></span>
					{#if imageCount > 0}
						<span class="text-xs text-ink-400 font-body hidden sm:inline">{imageCount} images</span>
					{/if}
				</span>
			</h1>
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
				class="w-full bg-paper border border-rose-500/25 rounded-full px-4 py-2 text-sm text-ink-700 placeholder:text-ink-700/40 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 transition-colors pr-8"
			/>
			{#if searchInput}
				<button
					on:click={clearSearch}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-700/40 hover:text-rose-500 transition-colors"
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
					class="absolute left-0 right-0 top-full mt-1 z-50 glass rounded-xl overflow-hidden border border-rose-500/20 animate-slide-up"
				>
					{#each suggestions as suggestion, i}
						<li role="option" aria-selected={i === selectedIndex}>
							<button
								on:mousedown|preventDefault={() => selectSuggestion(suggestion)}
								class="w-full text-left px-4 py-2 text-sm flex items-center justify-between gap-2 transition-colors
									{i === selectedIndex ? 'bg-rose-500/15' : 'hover:bg-rose-500/10'}"
							>
								<span class="
									{TAG_CATEGORIES[suggestion.category] === 'artist' ? 'text-coral-500' :
									 TAG_CATEGORIES[suggestion.category] === 'character' ? 'text-rose-500' :
									 TAG_CATEGORIES[suggestion.category] === 'copyright' ? 'text-mauve-600/80' :
									 'text-ink-700/80'}">
									{suggestion.label}
								</span>
								<span class="text-xs text-ink-700/30 shrink-0">{suggestion.post_count.toLocaleString()}</span>
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
					class="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 border
						{$activeSort
						? 'bg-blush-100 text-mauve-600 border-rose-500/40 font-semibold'
						: 'bg-paper text-ink-700 border-rose-500/25 hover:border-rose-500 hover:text-rose-500'}"
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
						class="absolute right-0 top-full mt-2 z-50 glass rounded-xl overflow-hidden border border-mauve-600/20 w-36 animate-slide-up"
					>
						{#each SORT_OPTIONS as opt}
							<li role="option" aria-selected={$activeSort === opt.value}>
								<button
									on:click={() => setSort(opt.value)}
									class="w-full text-left px-3 py-2 text-sm transition-colors
										{$activeSort === opt.value
										? 'text-mauve-600 bg-blush-100 font-semibold'
										: 'text-ink-700 hover:text-rose-500 hover:bg-blush-100'}"
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
				class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border
					{$showFavoritesOnly
					? 'bg-coral-500 text-white border-transparent font-semibold'
					: 'bg-paper text-ink-700 border-rose-500/25 hover:border-rose-500 hover:text-rose-500'}"
				aria-label={$showFavoritesOnly ? 'Show all images' : 'Show favorites only'}
				aria-pressed={$showFavoritesOnly}
			>
				<Heart size={16} fill={$showFavoritesOnly ? 'currentColor' : 'none'} />
				<span class="hidden sm:inline">Favorites</span>
				{#if $favorites.length > 0}
					<span class="bg-paper/80 text-coral-500 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
						{$favorites.length > 9 ? '9+' : $favorites.length}
					</span>
				{/if}
			</button>
		</div>
	</div>
</header>
