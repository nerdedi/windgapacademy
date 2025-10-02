<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { VoiceRecorder, AudioPlayer, blobToBase64, base64ToBlob } from '$ts/client/audioRecording';

	export let isOpen = false;
	export let tileText = '';
	export let existingRecording: string | null = null;

	const dispatch = createEventDispatcher();
	const recorder = new VoiceRecorder();
	const player = new AudioPlayer();

	let isRecording = false;
	let isPlaying = false;
	let recordingBlob: Blob | null = null;
	let recordingDuration = 0;
	let recordingTimer: number;

	// Load existing recording if available
	$: if (existingRecording && !recordingBlob) {
		recordingBlob = base64ToBlob(existingRecording);
	}

	async function startRecording() {
		const success = await recorder.startRecording();
		if (success) {
			isRecording = true;
			recordingDuration = 0;
			recordingTimer = setInterval(() => {
				recordingDuration += 0.1;
			}, 100);
		}
	}

	async function stopRecording() {
		if (isRecording) {
			recordingBlob = await recorder.stopRecording();
			isRecording = false;
			clearInterval(recordingTimer);
		}
	}

	async function playRecording() {
		if (recordingBlob && !isPlaying) {
			isPlaying = true;
			try {
				await player.playAudioBlob(recordingBlob);
			} catch (error) {
				console.error('Playback failed:', error);
			} finally {
				isPlaying = false;
			}
		}
	}

	function deleteRecording() {
		recordingBlob = null;
		recordingDuration = 0;
		player.stop();
		isPlaying = false;
	}

	async function saveRecording() {
		if (recordingBlob) {
			const base64 = await blobToBase64(recordingBlob);
			dispatch('save', { audioData: base64 });
		}
		closeModal();
	}

	function closeModal() {
		isOpen = false;
		if (isRecording) {
			stopRecording();
		}
		player.stop();
		isPlaying = false;
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" on:click={closeModal}>
		<div class="bg-white rounded-lg p-6 w-96 max-w-[90vw]" on:click|stopPropagation>
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold">Record Voice for Tile</h3>
				<button on:click={closeModal} class="text-gray-500 hover:text-gray-700">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>

			<div class="mb-4">
				<p class="text-sm text-gray-600 mb-2">Recording for:</p>
				<p class="font-medium bg-gray-100 p-2 rounded">{tileText}</p>
			</div>

			<div class="space-y-4">
				<!-- Recording Controls -->
				<div class="flex items-center justify-center space-x-4">
					{#if !recordingBlob}
						{#if !isRecording}
							<button
								on:click={startRecording}
								class="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-red-600 transition-colors"
							>
								<i class="bi bi-mic text-2xl"></i>
							</button>
						{:else}
							<button
								on:click={stopRecording}
								class="bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center animate-pulse"
							>
								<i class="bi bi-stop-fill text-2xl"></i>
							</button>
						{/if}
					{/if}

					<!-- Playback Controls -->
					{#if recordingBlob}
						<div class="flex items-center space-x-2">
							<button
								on:click={playRecording}
								disabled={isPlaying}
								class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50"
							>
								{#if isPlaying}
									<i class="bi bi-pause-fill"></i>
								{:else}
									<i class="bi bi-play-fill"></i>
								{/if}
							</button>

							<button
								on:click={deleteRecording}
								class="bg-gray-500 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-600 transition-colors"
							>
								<i class="bi bi-trash"></i>
							</button>
						</div>
					{/if}
				</div>

				<!-- Recording Status -->
				{#if isRecording}
					<div class="text-center">
						<p class="text-red-600 font-medium">Recording... {recordingDuration.toFixed(1)}s</p>
						<div class="flex items-center justify-center mt-2">
							<div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
						</div>
					</div>
				{:else if recordingBlob}
					<div class="text-center">
						<p class="text-green-600 font-medium">
							<i class="bi bi-check-circle"></i> Recording saved ({recordingDuration.toFixed(1)}s)
						</p>
					</div>
				{:else}
					<div class="text-center">
						<p class="text-gray-500">Tap the microphone to start recording</p>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex space-x-3 pt-4">
					<button
						on:click={closeModal}
						class="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						on:click={saveRecording}
						disabled={!recordingBlob}
						class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Save Recording
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom animations for recording indicator */
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
