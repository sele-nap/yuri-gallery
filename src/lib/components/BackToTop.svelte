<script>
	import { ChevronUp } from 'lucide-svelte';

	let visible = false;

	function onScroll() {
		visible = window.scrollY > 400;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:window on:scroll={onScroll} />

{#if visible}
	<button
		on:click={scrollToTop}
		class="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full glass border border-pink-mid/30 flex items-center justify-center text-pink-mid hover:bg-pink-mid/20 transition-all duration-200 hover:scale-110 animate-fade-in shadow-lg shadow-pink-mid/10"
		aria-label="Back to top"
	>
		<ChevronUp size={18} />
	</button>
{/if}
