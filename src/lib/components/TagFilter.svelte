<script>
	import { activeSearch } from '$lib/stores/gallery.js';

	const PRESET_TAGS = [
		{ label: 'All', tag: '' },
		{ label: 'Kiss', tag: 'kiss' },
		{ label: 'Hug', tag: 'hug' },
		{ label: 'School', tag: 'school_uniform' },
		{ label: 'Flowers', tag: 'flower' },
		{ label: 'Umbrella', tag: 'umbrella' },
		{ label: 'Crying', tag: 'crying' },
		{ label: 'Rain', tag: 'rain' },
		{ label: 'Wedding', tag: 'wedding' },
		{ label: 'Yukata', tag: 'yukata' }
	];

	$: activeTag = $activeSearch;
</script>

<div class="flex flex-wrap gap-2 px-4 py-3">
	{#each PRESET_TAGS as { label, tag }}
		<button
			on:click={() => activeSearch.set(tag)}
			aria-pressed={activeTag === tag}
			class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border
				{activeTag === tag
				? 'bg-gradient-to-r from-[#D52D00] via-[#FF9A56] via-[#FFF0E8] to-[#A50062] text-white border-transparent shadow-lg shadow-[#D52D00]/20'
				: 'bg-transparent text-pink-soft/50 border-pink-soft/15 hover:border-pink-mid/40 hover:text-pink-soft'}"
		>
			{label}
		</button>
	{/each}
</div>
