<script>
	const height = 160 + Math.floor(Math.random() * 200);
</script>

<div
	class="masonry-item rounded-xl overflow-hidden"
	style="height: {height}px;"
>
	<div class="w-full h-full bg-bg-card relative overflow-hidden">
		<div
			class="absolute inset-0"
			style="background: linear-gradient(90deg, transparent 0%, rgba(155,93,229,0.08) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"
		></div>
	</div>
</div>

<style>
	@keyframes shimmer {
		0% { background-position: -200% 0; }
		100% { background-position: 200% 0; }
	}
</style>
