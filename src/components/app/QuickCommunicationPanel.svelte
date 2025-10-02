<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { AudioPlayer } from '$ts/client/audioRecording';

	export let userId: string;

	const dispatch = createEventDispatcher();
	const audioPlayer = new AudioPlayer();

	// Emergency/Urgent phrases
	const emergencyPhrases = [
		{ text: "Help me", icon: "exclamation-triangle", color: "bg-red-600" },
		{ text: "I need assistance", icon: "hand-index", color: "bg-red-500" },
		{ text: "Call someone", icon: "telephone", color: "bg-orange-600" },
		{ text: "I'm hurt", icon: "bandaid", color: "bg-red-700" },
		{ text: "Emergency", icon: "lightning", color: "bg-red-800" }
	];

	// Common quick phrases
	const quickPhrases = [
		{ text: "Yes", icon: "check-circle", color: "bg-green-600" },
		{ text: "No", icon: "x-circle", color: "bg-red-600" },
		{ text: "Please", icon: "hand-thumbs-up", color: "bg-blue-600" },
		{ text: "Thank you", icon: "heart", color: "bg-pink-600" },
		{ text: "Hello", icon: "wave", color: "bg-yellow-600" },
		{ text: "Goodbye", icon: "door-open", color: "bg-purple-600" },
		{ text: "I want", icon: "hand-index-thumb", color: "bg-indigo-600" },
		{ text: "I need", icon: "exclamation", color: "bg-teal-600" },
		{ text: "More", icon: "plus-circle", color: "bg-cyan-600" },
		{ text: "Stop", icon: "stop-circle", color: "bg-red-500" },
		{ text: "Go", icon: "arrow-right-circle", color: "bg-green-500" },
		{ text: "Wait", icon: "pause-circle", color: "bg-yellow-500" }
	];

	// Favorite phrases (loaded from user preferences)
	let favoritePhrases: Array<{text: string, audioData?: string}> = [];

	// Load favorite phrases from localStorage or API
	function loadFavoritePhrases() {
		const saved = localStorage.getItem(`favorites_${userId}`);
		if (saved) {
			favoritePhrases = JSON.parse(saved);
		}
	}

	function saveFavoritePhrases() {
		localStorage.setItem(`favorites_${userId}`, JSON.stringify(favoritePhrases));
	}

	async function speakPhrase(text: string, audioData?: string) {
		if (audioData) {
			// Play custom recorded audio
			try {
				const audioBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: 'audio/webm' });
				await audioPlayer.playAudioBlob(audioBlob);
			} catch (error) {
				console.error('Custom audio playback failed, falling back to TTS:', error);
				dispatch('speak', { text });
			}
		} else {
			// Use text-to-speech
			dispatch('speak', { text });
		}
	}

	function addToFavorites(text: string) {
		if (!favoritePhrases.find(p => p.text === text)) {
			favoritePhrases = [...favoritePhrases, { text }];
			saveFavoritePhrases();
		}
	}

	function removeFromFavorites(text: string) {
		favoritePhrases = favoritePhrases.filter(p => p.text !== text);
		saveFavoritePhrases();
	}

	// Initialize on component mount
	loadFavoritePhrases();
</script>

<div class="bg-white border-t border-gray-200 p-4 space-y-4">
	<!-- Emergency Section -->
	<div>
		<h3 class="text-sm font-semibold text-red-700 mb-2 flex items-center">
			<i class="bi bi-exclamation-triangle-fill mr-2"></i>
			Emergency
		</h3>
		<div class="flex flex-wrap gap-2">
			{#each emergencyPhrases as phrase}
				<button
					on:click={() => speakPhrase(phrase.text)}
					class="{phrase.color} text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-1 shadow-sm"
				>
					<i class="bi bi-{phrase.icon}"></i>
					<span>{phrase.text}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Quick Phrases Section -->
	<div>
		<h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
			<i class="bi bi-lightning-fill mr-2"></i>
			Quick Phrases
		</h3>
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
			{#each quickPhrases as phrase}
				<button
					on:click={() => speakPhrase(phrase.text)}
					class="{phrase.color} text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-1 shadow-sm min-h-[3rem]"
				>
					<i class="bi bi-{phrase.icon}"></i>
					<span class="text-xs">{phrase.text}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Favorites Section -->
	{#if favoritePhrases.length > 0}
		<div>
			<h3 class="text-sm font-semibold text-yellow-700 mb-2 flex items-center">
				<i class="bi bi-star-fill mr-2"></i>
				Favorites
			</h3>
			<div class="flex flex-wrap gap-2">
				{#each favoritePhrases as phrase}
					<div class="relative group">
						<button
							on:click={() => speakPhrase(phrase.text, phrase.audioData)}
							class="bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors flex items-center space-x-1 shadow-sm"
						>
							<i class="bi bi-star-fill"></i>
							<span>{phrase.text}</span>
						</button>
						<button
							on:click={() => removeFromFavorites(phrase.text)}
							class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<i class="bi bi-x"></i>
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Add to Favorites Helper Text -->
	<div class="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
		<i class="bi bi-info-circle mr-1"></i>
		Tap and hold any phrase to add it to favorites
	</div>
</div>

<style>
	/* Custom hover effects for emergency buttons */
	.bg-red-600:hover, .bg-red-500:hover, .bg-red-700:hover, .bg-red-800:hover, .bg-orange-600:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
	}
</style>
