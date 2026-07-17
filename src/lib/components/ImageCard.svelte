<script>
	import { favorites } from '$lib/stores/favorites.js';
	import { lightboxPost } from '$lib/stores/gallery.js';
	import { toast } from '$lib/stores/toast.js';
	import { getDanbooruUrl, parseTags } from '$lib/utils/danbooru.js';
	import { Heart, Star } from 'lucide-svelte';

	/** @type {import('../utils/danbooru').DanbooruPost} */
	export let post;
	/** First-row cards are visible on load — skip lazy-loading so LCP isn't delayed. */
	export let priority = false;

	let loaded = false;
	let error = false;

	$: isFavorited = $favorites.includes(post.id);
	$: artists = parseTags(post.tag_string_artist).slice(0, 2);

	function toggleFavorite(e) {
		e.stopPropagation();
		favorites.toggle(post.id);
		toast.add(isFavorited ? 'Removed from favorites' : 'Added to favorites');
	}

	function openLightbox() {
		lightboxPost.set(post);
	}
</script>

<div class="masonry-item group relative will-change-transform">
	<button
		on:click={openLightbox}
		disabled={error}
		class="block w-full rounded-xl overflow-hidden relative ring-0 shadow-sm shadow-ink-700/15 transition-shadow duration-300 focus:outline-none focus:ring-2
			{error ? 'cursor-default' : 'cursor-zoom-in hover:shadow-md hover:shadow-ink-700/20 hover:ring-2 ring-rose-500/60'}"
	>
		<div
			class="relative w-full overflow-hidden min-h-[120px]"
			style="aspect-ratio: {post.image_width}/{post.image_height};"
		>
			{#if !loaded && !error}
				<div class="absolute inset-0 bg-paper overflow-hidden">
					<div class="shimmer w-full h-full"></div>
				</div>
			{/if}

			{#if !error}
				<img
					src={post.large_file_url}
					alt={artists.length > 0 ? `Artwork by ${artists.join(', ')}` : `Yuri artwork #${post.id}`}
					width={post.image_width}
					height={post.image_height}
					loading={priority ? 'eager' : 'lazy'}
					fetchpriority={priority ? 'high' : 'auto'}
					decoding="async"
					class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
					class:opacity-0={!loaded}
					class:animate-fade-in={loaded}
					on:load={() => (loaded = true)}
					on:error={() => (error = true)}
				/>
			{:else}
				<div class="absolute inset-0 flex items-center justify-center bg-paper text-ink-700/20 text-sm rounded-xl">
					Image unavailable
				</div>
			{/if}
		</div>

		<div class="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
			<div class="absolute bottom-0 left-0 right-0 p-3">
				{#if artists.length > 0}
					<p class="text-white text-xs font-medium mb-1 truncate">
						{artists.join(', ')}
					</p>
				{/if}

				<div class="flex items-center justify-between">
					<span class="text-white/70 text-xs flex items-center gap-1 tabular-nums">
						<Star size={10} fill="currentColor" />
						{post.score}
					</span>
					<a
						href={getDanbooruUrl(post.id)}
						target="_blank"
						rel="noopener noreferrer"
						on:click|stopPropagation
						class="text-white/60 hover:text-white text-xs transition-colors"
					>
						Danbooru
					</a>
				</div>
			</div>
		</div>
	</button>

	<button
		on:click={toggleFavorite}
		class="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-[background-color,color,opacity] duration-200 z-10
			{isFavorited
			? 'bg-rose-400 text-white opacity-100 scale-100'
			: 'bg-dawn-50/70 text-ink-700/60 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-rose-500/20 hover:text-rose-500'}"
		aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
	>
		<Heart size={14} fill={isFavorited ? 'currentColor' : 'none'} />
	</button>
</div>
