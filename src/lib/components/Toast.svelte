<script>
	import { toast } from '$lib/stores/toast.js';
</script>

<div
	class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none"
	role="status"
	aria-live="polite"
	aria-atomic="true"
>
	{#each $toast as t (t.id)}
		<div
			class="px-4 py-2.5 rounded-full text-sm font-medium shadow-lg animate-slide-up
				{t.type === 'success'
				? 'bg-sakura-mid text-white'
				: 'bg-bg-card border border-plum-mid/30 text-sakura-soft'}"
		>
			{t.message}
		</div>
	{/each}
</div>
