<script>
	import { onMount, onDestroy } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import TagFilter from '$lib/components/TagFilter.svelte';
	import ImageCard from '$lib/components/ImageCard.svelte';
	import SkeletonCard from '$lib/components/SkeletonCard.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import { fetchPosts } from '$lib/utils/danbooru.js';
	import { activeSearch, showFavoritesOnly } from '$lib/stores/gallery.js';
	import { favorites } from '$lib/stores/favorites.js';

	/** @type {import('../lib/utils/danbooru').DanbooruPost[]} */
	let posts = [];
	let page = 1;
	let loading = false;
	let hasMore = true;
	let error = '';
	let sentinel;

	/** @type {IntersectionObserver | null} */
	let observer = null;

	$: currentSearch = $activeSearch;
	$: onlyFavorites = $showFavoritesOnly;
	$: favoritedIds = $favorites;

	$: displayedPosts = onlyFavorites
		? posts.filter((p) => favoritedIds.includes(p.id))
		: posts;

	// Reset when search changes
	$: {
		currentSearch; // reactive dependency
		resetAndLoad();
	}

	async function resetAndLoad() {
		posts = [];
		page = 1;
		hasMore = true;
		error = '';
		await loadMore();
	}

	async function loadMore() {
		if (loading || !hasMore) return;
		loading = true;
		error = '';

		try {
			const newPosts = await fetchPosts({ page, tags: currentSearch });
			if (newPosts.length === 0) {
				hasMore = false;
			} else {
				posts = [...posts, ...newPosts];
				page += 1;
			}
		} catch (e) {
			error = 'Failed to load images. Please try again in a moment.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading && hasMore) {
					loadMore();
				}
			},
			{ rootMargin: '300px' }
		);

		if (sentinel) observer.observe(sentinel);
	});

	onDestroy(() => observer?.disconnect());

	$: if (sentinel && observer) {
		observer.observe(sentinel);
	}
</script>

<svelte:head>
	<title>百合 Gallery</title>
</svelte:head>

<Header />
<TagFilter />

<main class="max-w-7xl mx-auto px-3 pb-16">
	<!-- Favorites empty state -->
	{#if onlyFavorites && displayedPosts.length === 0 && !loading}
		<div class="flex flex-col items-center justify-center py-24 gap-4 animate-slide-up">
			<p class="text-6xl">♡</p>
			<p class="text-pink-soft/40 text-center">
				No favorites yet.<br />
				<span class="text-pink-soft/20 text-sm">Click ♡ on any image to save it here.</span>
			</p>
		</div>

	<!-- Error state -->
	{:else if error && posts.length === 0}
		<div class="flex flex-col items-center justify-center py-24 gap-4 animate-slide-up">
			<p class="text-pink-soft/40 text-center">{error}</p>
			<button on:click={resetAndLoad} class="btn-primary">Try again</button>
		</div>

	<!-- Gallery -->
	{:else}
		<div class="masonry">
			{#each displayedPosts as post (post.id)}
				<ImageCard {post} />
			{/each}

			<!-- Skeleton cards while loading -->
			{#if loading}
				{#each Array(8) as _, i}
					<SkeletonCard />
				{/each}
			{/if}
		</div>

		<!-- Error inline -->
		{#if error}
			<div class="text-center py-8">
				<p class="text-pink-soft/40 text-sm mb-3">{error}</p>
				<button on:click={loadMore} class="btn-primary">Try again</button>
			</div>
		{/if}

		<!-- End of results -->
		{#if !hasMore && posts.length > 0}
			<div class="text-center py-12">
				<p class="text-pink-soft/20 text-sm font-display italic">~ End of gallery ~</p>
			</div>
		{/if}

		<!-- Infinite scroll sentinel (hidden when favorites-only mode) -->
		{#if !onlyFavorites}
			<div bind:this={sentinel} class="h-1"></div>
		{/if}
	{/if}
</main>

<Lightbox {posts} />
