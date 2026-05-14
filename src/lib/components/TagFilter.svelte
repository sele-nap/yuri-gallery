<script>
	import { activeSearch, showFavoritesOnly } from '$lib/stores/gallery.js';
	import { presetTags } from '$lib/stores/tags.js';
	import { SlidersHorizontal } from 'lucide-svelte';
	import TagManager from './TagManager.svelte';

	/** @type {import('../utils/danbooru').DanbooruPost[]} */
	export let posts = [];
	/** @type {import('../utils/danbooru').DanbooruPost[]} */
	export let favoritePosts = [];

	let managerOpen = false;

	$: displayTags = (() => {
		if (!$showFavoritesOnly || favoritePosts.length === 0) return $presetTags;

		const counts = /** @type {Record<string, number>} */ ({});
		for (const post of favoritePosts) {
			for (const tag of post.tag_string_general.split(' ').filter(Boolean)) {
				// skip tags that are purely symbols/punctuation
				if (tag.replace(/[^\w]/g, '').length < 2) continue;
				counts[tag] = (counts[tag] || 0) + 1;
			}
		}

		return Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 9)
			.map(([tag], i) => ({ id: i, label: tag.replace(/_/g, ' '), tag }));
	})();
</script>

<div class="flex items-center gap-2 px-4 py-3">
	<nav aria-label="Filter by tag" class="flex flex-wrap items-center gap-2 flex-1">
		<button
			on:click={() => activeSearch.set('')}
			aria-pressed={$activeSearch === ''}
			class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border
				{$activeSearch === ''
				? 'bg-gradient-to-r from-[#D52D00] via-[#FF9A56] via-[#FFF0E8] to-[#A50062] text-[#1A0008] border-transparent shadow-sm shadow-[#D52D00]/20'
				: 'bg-white text-[#4A1030] border-[#C2185B]/25 hover:border-[#C2185B] hover:text-[#C2185B] hover:bg-[#FCE4EC]'}"
		>
			All
		</button>

		{#each displayTags as { label, tag } (tag)}
			<button
				on:click={() => activeSearch.set(tag)}
				aria-pressed={$activeSearch === tag}
				class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border
					{$activeSearch === tag
					? 'bg-gradient-to-r from-[#D52D00] via-[#FF9A56] via-[#FFF0E8] to-[#A50062] text-[#1A0008] border-transparent shadow-sm shadow-[#D52D00]/20'
					: 'bg-white text-[#4A1030] border-[#C2185B]/25 hover:border-[#C2185B] hover:text-[#C2185B] hover:bg-[#FCE4EC]'}"
			>
				{label}
			</button>
		{/each}
	</nav>

	{#if !$showFavoritesOnly}
		<button
			on:click={() => (managerOpen = true)}
			class="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-[#4A1030]/60 border border-[#C2185B]/20 hover:text-[#C2185B] hover:border-[#C2185B]/50 hover:bg-[#FCE4EC] transition-colors"
			aria-label="Manage filter tags"
		>
			<SlidersHorizontal size={12} />
			<span class="hidden sm:inline">Edit</span>
		</button>
	{/if}
</div>

<TagManager bind:open={managerOpen} />
