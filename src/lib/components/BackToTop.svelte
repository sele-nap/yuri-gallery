<script>
	import { ChevronUp } from 'lucide-svelte';

	let visible = false;

	function onScroll() {
		visible = window.scrollY > 400;
	}

	function scrollToTop() {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
	}
</script>

<svelte:window on:scroll={onScroll} />

{#if visible}
	<button
		on:click={scrollToTop}
		class="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full glass border border-rose-500/30 flex items-center justify-center text-rose-500 hover:bg-rose-500/20 transition-[background-color,transform] duration-200 hover:scale-110 animate-fade-in shadow-lg shadow-rose-500/10"
		aria-label="Back to top"
	>
		<ChevronUp size={18} />
	</button>
{/if}
