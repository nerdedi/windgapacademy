<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import VoiceRecorder from './VoiceRecorder.svelte';
  import { LocalSettings } from '$ts/client/stores';

  export let tileId: string;
  export let tileName: string;
  export let imageUrl: string | null = null;

  const dispatch = createEventDispatcher();

  let showRecorder = false;
  let hasCustomAudio = false;
  let audioUrl: string | null = null;
  let isPlaying = false;
  let audio: HTMLAudioElement;

  onMount(async () => {
    // Check if there's a custom recording for this tile
    const storedAudio = localStorage.getItem(`voice-recording-${tileId}`);
    if (storedAudio) {
      hasCustomAudio = true;
      audioUrl = storedAudio;
    }

    // Initialize audio element for playback
    audio = new Audio();
    audio.addEventListener('ended', () => {
      isPlaying = false;
    });
  });

  function toggleRecorder() {
    showRecorder = !showRecorder;
  }

  function handleRecordingReady(event: CustomEvent) {
    const { url, blob } = event.detail;

    // Store the voice recording in IndexedDB or localStorage
    storeVoiceRecording(blob, url);

    // Update UI
    audioUrl = url;
    hasCustomAudio = true;
    showRecorder = false;
  }

  function handleSaveRecording(event: CustomEvent) {
    const { blob, url } = event.detail;

    // Store the voice recording
    storeVoiceRecording(blob, url);

    // Update UI
    showRecorder = false;
    hasCustomAudio = true;

    // Notify parent components
    dispatch('recordingUpdated', { tileId, hasCustomAudio: true });
  }

  async function storeVoiceRecording(blob: Blob, url: string) {
    try {
      // Store in IndexedDB if available, otherwise localStorage
      if (window.indexedDB) {
        // Implementation would go here (similar to offlineStorage.ts)
        // For now, we'll use localStorage as a simple solution
      }

      // Store URL in localStorage as a fallback
      localStorage.setItem(`voice-recording-${tileId}`, url);

      // Also store the fact that this tile has custom audio
      const tilesWithCustomAudio = JSON.parse(localStorage.getItem('tiles-with-custom-audio') || '[]');
      if (!tilesWithCustomAudio.includes(tileId)) {
        tilesWithCustomAudio.push(tileId);
        localStorage.setItem('tiles-with-custom-audio', JSON.stringify(tilesWithCustomAudio));
      }
    } catch (error) {
      console.error('Error storing voice recording:', error);
    }
  }

  function deleteVoiceRecording() {
    if (!hasCustomAudio) return;

    try {
      // Remove from localStorage
      localStorage.removeItem(`voice-recording-${tileId}`);

      // Remove from tiles with custom audio list
      const tilesWithCustomAudio = JSON.parse(localStorage.getItem('tiles-with-custom-audio') || '[]');
      const updatedList = tilesWithCustomAudio.filter((id: string) => id !== tileId);
      localStorage.setItem('tiles-with-custom-audio', JSON.stringify(updatedList));

      // Update UI
      hasCustomAudio = false;
      audioUrl = null;

      // Notify parent components
      dispatch('recordingUpdated', { tileId, hasCustomAudio: false });

    } catch (error) {
      console.error('Error deleting voice recording:', error);
    }
  }

  function playVoiceRecording() {
    if (!audioUrl || isPlaying) return;

    try {
      audio.src = audioUrl;
      audio.play();
      isPlaying = true;
    } catch (error) {
      console.error('Error playing voice recording:', error);
      isPlaying = false;
    }
  }

  function stopPlayback() {
    if (!isPlaying) return;

    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
  }
</script>

<div class="voice-tile p-4 bg-white rounded-lg shadow-sm border border-gray-200">
  <div class="flex items-center gap-3">
    <!-- Tile Image -->
    {#if imageUrl}
      <div class="w-12 h-12 flex-shrink-0">
        <img src={imageUrl} alt={tileName} class="w-full h-full object-contain rounded" />
      </div>
    {/if}

    <!-- Tile Name -->
    <div class="flex-grow">
      <h3 class="font-medium text-gray-900">{tileName}</h3>
      {#if hasCustomAudio}
        <p class="text-xs text-green-600">Custom recording available</p>
      {:else}
        <p class="text-xs text-gray-400">No custom recording</p>
      {/if}
    </div>

    <!-- Controls -->
    <div class="flex gap-2">
      {#if hasCustomAudio && audioUrl}
        <!-- Play/Stop Button -->
        {#if isPlaying}
          <button
            on:click={stopPlayback}
            class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          </button>
        {:else}
          <button
            on:click={playVoiceRecording}
            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        {/if}

        <!-- Delete Button -->
        <button
          on:click={deleteVoiceRecording}
          class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      {/if}

      <!-- Record Button -->
      <button
        on:click={toggleRecorder}
        class="w-10 h-10 rounded-full {showRecorder ? 'bg-gray-200 hover:bg-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white'} flex items-center justify-center">
        {#if showRecorder}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Voice Recorder -->
  {#if showRecorder}
    <div class="mt-4">
      <VoiceRecorder
        maxDuration={15}
        autoStop={true}
        on:recordingReady={handleRecordingReady}
        on:save={handleSaveRecording}
      />
    </div>
  {/if}
</div>
