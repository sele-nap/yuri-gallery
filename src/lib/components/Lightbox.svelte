<script>
	import { lightboxPost, activeSearch } from '$lib/stores/gallery.js';
	import { favorites } from '$lib/stores/favorites.js';
	import { parseTags, getDanbooruUrl } from '$lib/utils/danbooru.js';

	/** @type {import('../utils/danbooru').DanbooruPost[]} */
	export let posts = [];

	$: post = $lightboxPost;
	$: isFavorited = post ? $favorites.includes(post.id) : false;
	$: artists = post ? parseTags(post.tag_string_artist) : [];
	$: characters = post ? parseTags(post.tag_string_character).slice(0, 6) : [];
	$: generalTags = post ? parseTags(post.tag_string_general).slice(0, 12) : [];
	$: currentIndex = post ? posts.findIndex((p) => p.id === post.id) : -1;

	let imageLoaded = false;

	$: if (post) imageLoaded = false;

	function close() {
		lightboxPost.set(null);
	}

	function prev() {
		if (currentIndex > 0) {
			lightboxPost.set(posts[currentIndex - 1]);
		}
	}

	function next() {
		if (currentIndex < posts.length - 1) {
			lightboxPost.set(posts[currentIndex + 1]);
		}
	}

	/** @param {KeyboardEvent} e */
	function handleKey(e) {
		if (!post) return;
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}

	/** @param {string} tag */
	function addTagSearch(tag) {
		activeSearch.set(tag);
		close();
	}
</script>

<svelte:window on:keydown={handleKey} />

{#if post}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
	<div
		class="fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-md flex items-center justify-center p-4"
		on:click|self={close}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Close -->
		<button
			on:click={close}
			class="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-pink-soft/60 hover:text-pink-mid transition-colors z-10"
			aria-label="Close"
		>
			✕
		</button>

		<!-- Navigation arrows -->
		{#if currentIndex > 0}
			<button
				on:click={prev}
				class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-pink-soft/60 hover:text-pink-mid transition-colors z-10"
				aria-label="Previous"
			>
				←
			</button>
		{/if}

		{#if currentIndex < posts.length - 1}
			<button
				on:click={next}
				class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-pink-soft/60 hover:text-pink-mid transition-colors z-10"
				aria-label="Next"
			>
				→
			</button>
		{/if}

		<!-- Main content -->
		<div class="flex flex-col lg:flex-row gap-4 max-h-[90vh] w-full max-w-6xl animate-slide-up">
			<!-- Image -->
			<div class="flex-1 flex items-center justify-center min-h-0">
				{#if !imageLoaded}
					<div class="w-full max-h-[80vh] aspect-square bg-bg-card rounded-2xl animate-pulse"></div>
				{/if}
				<img
					src={post.large_file_url}
					alt="Yuri artwork"
					class="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-opacity duration-300"
					class:opacity-0={!imageLoaded}
					class:opacity-100={imageLoaded}
					on:load={() => (imageLoaded = true)}
				/>
			</div>

			<!-- Sidebar -->
			<div class="lg:w-72 shrink-0 glass rounded-2xl p-4 overflow-y-auto max-h-[80vh] flex flex-col gap-4">
				<!-- Actions -->
				<div class="flex gap-2">
					<button
						on:click={() => favorites.toggle(post.id)}
						class="flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all duration-200 border
							{isFavorited
							? 'bg-pink-mid/20 text-pink-mid border-pink-mid/40'
							: 'bg-transparent text-pink-soft/60 border-pink-soft/20 hover:border-pink-mid/30 hover:text-pink-mid'}"
					>
						{isFavorited ? '♥ Saved' : '♡ Save'}
					</button>
					<a
						href={getDanbooruUrl(post.id)}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-center px-3 py-2 rounded-full glass text-pink-soft/60 hover:text-pink-mid text-sm transition-colors border border-pink-soft/10 hover:border-pink-mid/30"
						title="View on Danbooru"
					>
						↗
					</a>
					<a
						href={post.file_url}
						target="_blank"
						rel="noopener noreferrer"
						download
						class="flex items-center justify-center px-3 py-2 rounded-full glass text-pink-soft/60 hover:text-pink-mid text-sm transition-colors border border-pink-soft/10 hover:border-pink-mid/30"
						title="Download"
					>
						⬇
					</a>
				</div>

				<!-- Infos -->
				<div class="text-xs text-pink-soft/40 space-y-1">
					<div>ID: <span class="text-pink-soft/60">#{post.id}</span></div>
					<div>Resolution: <span class="text-pink-soft/60">{post.image_width} × {post.image_height}</span></div>
					<div>Score: <span class="text-pink-soft/60">⭐ {post.score}</span></div>
				</div>

				<!-- Artists -->
				{#if artists.length > 0}
					<div>
						<p class="text-xs font-medium text-pink-mid/80 uppercase tracking-wider mb-2">Artist</p>
						<div class="flex flex-wrap gap-1.5">
							{#each artists as tag}
								<button on:click={() => addTagSearch(tag)} class="tag-badge-artist">
									{tag.replace(/_/g, ' ')}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Characters -->
				{#if characters.length > 0}
					<div>
						<p class="text-xs font-medium text-purple-soft/80 uppercase tracking-wider mb-2">Characters</p>
						<div class="flex flex-wrap gap-1.5">
							{#each characters as tag}
								<button on:click={() => addTagSearch(tag)} class="tag-badge-character">
									{tag.replace(/_/g, ' ')}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- General tags -->
				{#if generalTags.length > 0}
					<div>
						<p class="text-xs font-medium text-purple-mid/80 uppercase tracking-wider mb-2">General Tags</p>
						<div class="flex flex-wrap gap-1.5">
							{#each generalTags as tag}
								<button on:click={() => addTagSearch(tag)} class="tag-badge-general">
									{tag.replace(/_/g, ' ')}
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
