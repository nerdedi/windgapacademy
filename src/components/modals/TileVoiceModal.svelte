<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import VoiceRecorder from '../app/VoiceRecorder.svelte';
  import { TileBeingEdited, UnsavedChanges } from '$ts/client/stores';

  export let show = false;

  const dispatch = createEventDispatcher();

  let hasCustomVoice = false;
  let audioUrl: string | null = null;
  let isPlaying = false;
  let audio: HTMLAudioElement;

  $: if ($TileBeingEdited && show) {
    checkForCustomVoice();
  }

  function checkForCustomVoice() {
    if (!$TileBeingEdited) return;

    const tileId = $TileBeingEdited.id;
    const storedAudio = localStorage.getItem(`voice-recording-${tileId}`);

    if (storedAudio) {
      hasCustomVoice = true;
      audioUrl = storedAudio;
    } else {
      hasCustomVoice = false;
      audioUrl = null;
    }
  }

  function handleRecordingReady(event) {
    const { url } = event.detail;
    audioUrl = url;
    hasCustomVoice = true;
  }

  function handleSave(event) {
    if (!$TileBeingEdited) return;

    const { blob, url } = event.detail;
    const tileId = $TileBeingEdited.id;

    // Store voice recording
    localStorage.setItem(`voice-recording-${tileId}`, url);

    // Update tile metadata
    $TileBeingEdited = {
      ...$TileBeingEdited,
      hasCustomVoice: true
    };

    // Set unsaved changes flag
    $UnsavedChanges = true;

    // Update UI
    hasCustomVoice = true;
    audioUrl = url;

    dispatch('saved');
  }

  function deleteRecording() {
    if (!$TileBeingEdited) return;

    const tileId = $TileBeingEdited.id;

    // Remove recording
    localStorage.removeItem(`voice-recording-${tileId}`);

    // Update tile metadata
    $TileBeingEdited = {
      ...$TileBeingEdited,
      hasCustomVoice: false
    };

    // Set unsaved changes flag
    $UnsavedChanges = true;

    // Update UI
    hasCustomVoice = false;
    audioUrl = null;

    dispatch('deleted');
  }

  function playRecording() {
    if (!audioUrl || isPlaying) return;

    if (!audio) audio = new Audio();

    audio.src = audioUrl;
    audio.onended = () => {
      isPlaying = false;
    };

    audio.play();
    isPlaying = true;
  }

  function stopPlayback() {
    if (!isPlaying || !audio) return;

    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
  }

  function closeModal() {
    if (isPlaying && audio) {
      audio.pause();
      audio.currentTime = 0;
      isPlaying = false;
    }

    dispatch('close');
  }
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" transition:fade>
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" transition:fly={{ y: 20, duration: 300 }}>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold">Custom Voice Recording</h2>
        <button
          on:click={closeModal}
          class="rounded p-1 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mb-4">
        <p class="text-sm text-gray-600">
          Record a custom voice for this tile. This will be used instead of the text-to-speech voice when this tile is tapped.
        </p>
      </div>

      {#if hasCustomVoice && audioUrl}
        <div class="mb-4 rounded-lg bg-gray-50 p-3">
          <div class="mb-2 text-sm font-medium">Current Recording</div>
          <div class="flex items-center gap-2">
            <!-- Play/Stop Button -->
            <button
              on:click={isPlaying ? stopPlayback : playRecording}
              class="flex items-center justify-center rounded-full bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
            >
              {#if isPlaying}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              {/if}
            </button>
            <span class="text-sm">{isPlaying ? 'Playing...' : 'Tap to play'}</span>
          </div>

          <div class="mt-3 flex justify-end">
            <button
              on:click={deleteRecording}
              class="flex items-center gap-1 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Recording
            </button>
          </div>
        </div>
      {/if}

      <!-- Voice recorder -->
      <VoiceRecorder
        maxDuration={10}
        autoStop={true}
        showWaveform={true}
        on:recordingReady={handleRecordingReady}
        on:save={handleSave}
      />
    </div>
  </div>
{/if}
