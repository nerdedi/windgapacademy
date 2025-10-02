<script>
	import { setContext, onMount } from 'svelte';
	import { registerServiceWorker, setupPWAInstall, setupOfflineDetection } from '$ts/client/pwa';
	import '../app.css';

	export let data;

	setContext('media_uri', data.media_uri);

	onMount(() => {
		// Initialize PWA functionality
		registerServiceWorker();
		setupPWAInstall();
		setupOfflineDetection();
	});
</script>

<!-- Online/Offline Status -->
<div id="online-status" class="hidden"></div>

<!-- PWA Install Button -->
<button id="pwa-install-button" class="hidden fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
	<i class="bi bi-download"></i> Install App
</button>

<slot />

<style lang="postcss">
	:global(body) {
		@apply font-sans;
	}
</style>
