<script>
	import { Heart, Play, Square, Copy, ExternalLink, Download, ChevronLeft, ChevronRight, X, Star } from 'lucide-svelte';
	import { lightboxPost, activeSearch } from '$lib/stores/gallery.js';
	import { favorites } from '$lib/stores/favorites.js';
	import { toast } from '$lib/stores/toast.js';
	import { parseTags, getDanbooruUrl } from '$lib/utils/danbooru.js';
	import { onDestroy } from 'svelte';

	/** @type {import('../utils/danbooru').DanbooruPost[]} */
	export let posts = [];

	$: post = $lightboxPost;
	$: isFavorited = post ? $favorites.includes(post.id) : false;
	$: artists = post ? parseTags(post.tag_string_artist) : [];
	$: characters = post ? parseTags(post.tag_string_character).slice(0, 6) : [];
	$: generalTags = post ? parseTags(post.tag_string_general).slice(0, 12) : [];
	$: currentIndex = post ? posts.findIndex((p) => p.id === post.id) : -1;

	let imageLoaded = false;
	let slideshowActive = false;
	let slideshowTimer = null;
	let dialogEl;
	let openerEl;

	$: if (post) {
		imageLoaded = false;
		openerEl = /** @type {HTMLElement | null} */ (document.activeElement);
		setTimeout(() => dialogEl?.focus(), 0);
	}
	$: if (!post && slideshowActive) stopSlideshow();

	function close() {
		stopSlideshow();
		lightboxPost.set(null);
		setTimeout(() => openerEl?.focus(), 0);
	}

	function prev() {
		if (currentIndex > 0) lightboxPost.set(posts[currentIndex - 1]);
	}

	function next() {
		if (currentIndex < posts.length - 1) lightboxPost.set(posts[currentIndex + 1]);
		else stopSlideshow();
	}

	function toggleSlideshow() {
		if (slideshowActive) {
			stopSlideshow();
		} else {
			slideshowActive = true;
			slideshowTimer = setInterval(next, 3000);
			toast.add('Slideshow started', 'info');
		}
	}

	function stopSlideshow() {
		slideshowActive = false;
		clearInterval(slideshowTimer);
		slideshowTimer = null;
	}

	function toggleFavorite() {
		if (!post) return;
		favorites.toggle(post.id);
		toast.add(isFavorited ? 'Removed from favorites' : 'Added to favorites');
	}

	async function copyLink() {
		if (!post) return;
		await navigator.clipboard.writeText(getDanbooruUrl(post.id));
		toast.add('Link copied!', 'info');
	}

	const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

	/** @param {KeyboardEvent} e */
	function handleKey(e) {
		if (!post) return;
		if (e.key === 'Escape') { close(); return; }
		if (e.key === 'ArrowLeft') { prev(); return; }
		if (e.key === 'ArrowRight') { next(); return; }
		if (e.key === 'f' || e.key === 'F') { toggleFavorite(); return; }

		if (e.key === 'Tab' && dialogEl) {
			const focusable = /** @type {HTMLElement[]} */ ([...dialogEl.querySelectorAll(FOCUSABLE)]);
			if (focusable.length === 0) { e.preventDefault(); return; }
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) { e.preventDefault(); last.focus(); }
			} else {
				if (document.activeElement === last) { e.preventDefault(); first.focus(); }
			}
		}
	}

	/** @param {string} tag */
	function addTagSearch(tag) {
		activeSearch.set(tag);
		close();
	}

	onDestroy(stopSlideshow);
</script>

<svelte:window on:keydown={handleKey} />

{#if post}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
	<div
		bind:this={dialogEl}
		class="fixed inset-0 z-[60] bg-bg-primary/95 backdrop-blur-md flex items-center justify-center p-4"
		on:click|self={close}
		role="dialog"
		aria-modal="true"
		aria-label="Image viewer"
		tabindex="-1"
	>
		<button
			on:click={close}
			class="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-pink-soft/60 hover:text-pink-mid transition-colors z-10"
			aria-label="Close"
		>
			<X size={18} />
		</button>

		<div class="flex flex-col lg:flex-row gap-4 max-h-[90vh] w-full max-w-6xl animate-slide-up overflow-y-auto lg:overflow-visible">
			<!-- Image -->
			<div class="flex-1 flex items-center justify-center min-h-0 relative">
				<!-- Nav arrows inside image container, won't conflict with close button -->
				{#if currentIndex > 0}
					<button
						on:click={prev}
						class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-pink-soft/60 hover:text-pink-mid transition-colors z-10"
						aria-label="Previous"
					>
						<ChevronLeft size={20} />
					</button>
				{/if}
				{#if currentIndex < posts.length - 1}
					<button
						on:click={next}
						class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-pink-soft/60 hover:text-pink-mid transition-colors z-10"
						aria-label="Next"
					>
						<ChevronRight size={20} />
					</button>
				{/if}

				{#if !imageLoaded}
					<div class="w-full max-h-[50vh] lg:max-h-[80vh] aspect-square bg-bg-card rounded-2xl animate-pulse"></div>
				{/if}
				<img
					src={post.large_file_url}
					alt={artists.length > 0 ? `Artwork by ${artists.join(', ')}` : `Yuri artwork #${post.id}`}
					class="max-w-full max-h-[50vh] md:max-h-[65vh] lg:max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-opacity duration-300"
					class:opacity-0={!imageLoaded}
					class:opacity-100={imageLoaded}
					on:load={() => (imageLoaded = true)}
				/>
				{#if slideshowActive}
					<div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs text-purple-soft/80">
						<span class="w-2 h-2 rounded-full bg-purple-mid animate-pulse"></span>
						Slideshow
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="lg:w-72 shrink-0 glass rounded-2xl p-4 overflow-y-auto max-h-[40vh] lg:max-h-[80vh] flex flex-col gap-4">
				<button
					on:click={toggleFavorite}
					class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-medium transition-all duration-200 border
						{isFavorited ? 'bg-pink-mid/20 text-pink-mid border-pink-mid/40' : 'bg-transparent text-pink-soft/60 border-pink-soft/20 hover:border-pink-mid/30 hover:text-pink-mid'}"
				>
					<Heart size={14} fill={isFavorited ? 'currentColor' : 'none'} />
					{isFavorited ? 'Saved' : 'Save'}
				</button>

				<div class="flex gap-2">
					<button
						on:click={toggleSlideshow}
						class="btn-icon {slideshowActive ? 'text-purple-soft border-purple-mid/40 bg-purple-mid/20' : ''}"
						aria-label={slideshowActive ? 'Stop slideshow' : 'Start slideshow'}
						aria-pressed={slideshowActive}
					>
						{#if slideshowActive}<Square size={14} />{:else}<Play size={14} />{/if}
					</button>

					<button on:click={copyLink} class="btn-icon" aria-label="Copy link">
						<Copy size={14} />
					</button>

					<a
						href={getDanbooruUrl(post.id)}
						target="_blank"
						rel="noopener noreferrer"
						class="btn-icon"
						aria-label="View on Danbooru"
					>
						<ExternalLink size={14} />
					</a>

					<a
						href={post.file_url}
						target="_blank"
						rel="noopener noreferrer"
						download
						class="btn-icon"
						aria-label="Download image"
					>
						<Download size={14} />
					</a>
				</div>

				<div class="text-xs text-pink-soft/40 space-y-1">
					<div>ID: <span class="text-pink-soft/60">#{post.id}</span></div>
					<div>Resolution: <span class="text-pink-soft/60">{post.image_width} × {post.image_height}</span></div>
					<div class="flex items-center gap-1">
						Score:
						<span class="text-pink-soft/60 flex items-center gap-1">
							<Star size={10} fill="currentColor" />
							{post.score}
						</span>
					</div>
				</div>

				{#if artists.length > 0}
					<div>
						<p class="text-xs font-medium text-pink-mid/80 uppercase tracking-wider mb-2">Artist</p>
						<div class="flex flex-wrap gap-1.5">
							{#each artists as tag}
								<button on:click={() => addTagSearch(tag)} class="tag-badge-artist">{tag}</button>
							{/each}
						</div>
					</div>
				{/if}

				{#if characters.length > 0}
					<div>
						<p class="text-xs font-medium text-purple-soft/80 uppercase tracking-wider mb-2">Characters</p>
						<div class="flex flex-wrap gap-1.5">
							{#each characters as tag}
								<button on:click={() => addTagSearch(tag)} class="tag-badge-character">{tag}</button>
							{/each}
						</div>
					</div>
				{/if}

				{#if generalTags.length > 0}
					<div>
						<p class="text-xs font-medium text-purple-mid/80 uppercase tracking-wider mb-2">General Tags</p>
						<div class="flex flex-wrap gap-1.5">
							{#each generalTags as tag}
								<button on:click={() => addTagSearch(tag)} class="tag-badge-general">{tag}</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
