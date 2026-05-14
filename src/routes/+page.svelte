<script>
	import { onMount, onDestroy } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import TagFilter from '$lib/components/TagFilter.svelte';
	import ImageCard from '$lib/components/ImageCard.svelte';
	import SkeletonCard from '$lib/components/SkeletonCard.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';
	import KeyboardShortcuts from '$lib/components/KeyboardShortcuts.svelte';
	import { Heart } from 'lucide-svelte';
	import { fetchPosts } from '$lib/utils/danbooru.js';
	import { activeSearch, activeSort, showFavoritesOnly } from '$lib/stores/gallery.js';
	import { favorites } from '$lib/stores/favorites.js';

	/** @type {import('../lib/utils/danbooru').DanbooruPost[]} */
	let posts = [];
	/** @type {import('../lib/utils/danbooru').DanbooruPost[][]} */
	let columns = [[], []];
	let colCount = 2;
	let nextColIdx = 0;
	let page = 1;
	let loading = false;
	let hasMore = true;
	let error = '';
	let sentinel;

	/** @type {IntersectionObserver | null} */
	let observer = null;
	let resizeTimeout;

	$: displayedColumns = $showFavoritesOnly
		? distributeToColumns(posts.filter((p) => $favorites.includes(p.id)), colCount)
		: columns;

	function getColCount() {
		if (typeof window === 'undefined') return 2;
		const w = window.innerWidth;
		if (w >= 1280) return 5;
		if (w >= 1024) return 4;
		if (w >= 640) return 3;
		return 2;
	}

	/** @param {import('../lib/utils/danbooru').DanbooruPost[]} items @param {number} n */
	function distributeToColumns(items, n) {
		const cols = Array.from({ length: n }, () => []);
		items.forEach((item, i) => { cols[i % n].push(item); });
		return cols;
	}

	/** @param {import('../lib/utils/danbooru').DanbooruPost[]} newPosts */
	function appendToColumns(newPosts) {
		const newCols = columns.map((c) => [...c]);
		for (const post of newPosts) {
			newCols[nextColIdx % colCount].push(post);
			nextColIdx++;
		}
		columns = newCols;
	}

	function handleResize() {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			const n = getColCount();
			if (n !== colCount) {
				colCount = n;
				columns = distributeToColumns(posts, n);
				nextColIdx = posts.length;
			}
		}, 150);
	}

	$: {
		$activeSearch;
		$activeSort;
		resetAndLoad();
	}

	async function resetAndLoad() {
		posts = [];
		page = 1;
		hasMore = true;
		error = '';
		colCount = getColCount();
		columns = Array.from({ length: colCount }, () => []);
		nextColIdx = 0;
		await loadMore();
	}

	async function loadMore() {
		if (loading || !hasMore) return;
		loading = true;
		error = '';

		try {
			const tags = [$activeSearch, $activeSort].filter(Boolean).join(' ');
			const newPosts = await fetchPosts({ page, tags });
			if (newPosts.length === 0) {
				hasMore = false;
			} else {
				posts = [...posts, ...newPosts];
				if (!$showFavoritesOnly) {
					appendToColumns(newPosts);
				}
				page += 1;
			}
		} catch (e) {
			error = 'Failed to load images. Please try again in a moment.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const n = getColCount();
		if (n !== colCount) {
			colCount = n;
			if (posts.length > 0) {
				columns = distributeToColumns(posts, n);
				nextColIdx = posts.length;
			} else {
				columns = Array.from({ length: n }, () => []);
			}
		}

		window.addEventListener('resize', handleResize);

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

	onDestroy(() => {
		observer?.disconnect();
		clearTimeout(resizeTimeout);
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
		}
	});

	$: if (sentinel && observer) {
		observer.observe(sentinel);
	}
</script>

<svelte:head>
	<title>百合 Gallery</title>
</svelte:head>

<Header imageCount={posts.length} />
<TagFilter />

<main id="main-content" class="max-w-7xl mx-auto px-3 pb-16">
	{#if $showFavoritesOnly && displayedColumns.every((c) => c.length === 0) && !loading}
		<div class="flex flex-col items-center justify-center py-24 gap-4 animate-slide-up">
			<p class="text-pink-soft/20"><Heart size={60} /></p>
			<p class="text-pink-soft/40 text-center">
				No favorites yet.<br />
				<span class="text-pink-soft/20 text-sm">Click ♡ on any image to save it here.</span>
			</p>
		</div>

	{:else if error && posts.length === 0}
		<div class="flex flex-col items-center justify-center py-24 gap-4 animate-slide-up">
			<p class="text-pink-soft/40 text-center">{error}</p>
			<button on:click={resetAndLoad} class="btn-primary">Try again</button>
		</div>

	{:else}
		<div class="masonry">
			{#each displayedColumns as column}
				<div class="masonry-col">
					{#each column as post (post.id)}
						<ImageCard {post} />
					{/each}
					{#if loading}
						<SkeletonCard />
						<SkeletonCard />
					{/if}
				</div>
			{/each}
		</div>

		{#if error}
			<div class="text-center py-8">
				<p class="text-pink-soft/40 text-sm mb-3">{error}</p>
				<button on:click={loadMore} class="btn-primary">Try again</button>
			</div>
		{/if}

		{#if !hasMore && posts.length > 0}
			<div class="text-center py-12">
				<p class="text-pink-soft/20 text-sm font-display italic">~ End of gallery ~</p>
			</div>
		{/if}

		{#if !$showFavoritesOnly}
			<div bind:this={sentinel} class="h-1"></div>
		{/if}
	{/if}
</main>

<Lightbox {posts} />
<Toast />
<BackToTop />
<KeyboardShortcuts />
