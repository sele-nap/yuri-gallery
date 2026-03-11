<script>
	import { lightboxPost } from '$lib/stores/gallery.js';
	import { favorites } from '$lib/stores/favorites.js';
	import { toast } from '$lib/stores/toast.js';
	import { parseTags, getDanbooruUrl } from '$lib/utils/danbooru.js';

	/** @type {import('../utils/danbooru').DanbooruPost} */
	export let post;

	let loaded = false;
	let error = false;

	$: isFavorited = $favorites.includes(post.id);
	$: artists = parseTags(post.tag_string_artist).slice(0, 2);

	function toggleFavorite(e) {
		e.stopPropagation();
		favorites.toggle(post.id);
		toast.add(isFavorited ? 'Removed from favorites' : 'Added to favorites ♥');
	}

	function openLightbox() {
		lightboxPost.set(post);
	}
</script>

<div class="masonry-item group relative">
	<button
		on:click={openLightbox}
		class="block w-full rounded-xl overflow-hidden relative cursor-zoom-in ring-0 hover:ring-2 ring-pink-mid/60 transition-all duration-300 focus:outline-none focus:ring-2"
	>
		{#if !loaded && !error}
			<div class="w-full bg-bg-card" style="aspect-ratio: {post.image_width}/{post.image_height}; min-height: 120px;">
				<div class="absolute inset-0 overflow-hidden">
					<div class="w-full h-full" style="background: linear-gradient(90deg, transparent 0%, rgba(155,93,229,0.08) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div>
				</div>
			</div>
		{/if}

		{#if !error}
			<img
				src={post.large_file_url}
				alt="Yuri artwork"
				loading="lazy"
				class="w-full h-auto block transition-all duration-500 group-hover:scale-[1.02]"
				class:opacity-0={!loaded}
				class:animate-fade-in={loaded}
				on:load={() => (loaded = true)}
				on:error={() => (error = true)}
			/>
		{:else}
			<div class="w-full h-40 bg-bg-card flex items-center justify-center text-pink-soft/20 text-sm rounded-xl">
				Image unavailable
			</div>
		{/if}

		<div class="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
			<div class="absolute bottom-0 left-0 right-0 p-3">
				{#if artists.length > 0}
					<p class="text-pink-mid text-xs font-medium mb-1 truncate">
						{artists.join(', ')}
					</p>
				{/if}

				<div class="flex items-center justify-between">
					<span class="text-pink-soft/60 text-xs">⭐ {post.score}</span>
					<a
						href={getDanbooruUrl(post.id)}
						target="_blank"
						rel="noopener noreferrer"
						on:click|stopPropagation
						class="text-pink-soft/50 hover:text-pink-mid text-xs transition-colors"
					>
						Danbooru ↗
					</a>
				</div>
			</div>
		</div>
	</button>

	<button
		on:click={toggleFavorite}
		class="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10
			{isFavorited
			? 'bg-pink-mid text-white opacity-100 scale-100'
			: 'bg-bg-primary/70 text-pink-soft/60 opacity-0 group-hover:opacity-100 hover:bg-pink-mid/20 hover:text-pink-mid'}"
		aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
		title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
	>
		{isFavorited ? '♥' : '♡'}
	</button>
</div>

<style>
	@keyframes shimmer {
		0% { background-position: -200% 0; }
		100% { background-position: 200% 0; }
	}
</style>
