<script lang="ts">
  import { onMount } from 'svelte';
  import VoiceTile from '../app/VoiceTile.svelte';
  import type { Tile } from '$ts/common/types';
  import { fade, fly } from 'svelte/transition';

  export let project: any;
  export let onClose: () => void;

  let tiles: Tile[] = [];
  let tilesWithCustomAudio: string[] = [];
  let searchQuery = '';
  let loading = true;

  onMount(async () => {
    await loadTiles();
    loadCustomAudioTiles();
    loading = false;
  });

  async function loadTiles() {
    // Get tiles from all pages in the project
    try {
      // This would normally be fetched from an API
      // For now, we'll use the project pages
      if (project && project.pages) {
        const allTiles: Tile[] = [];

        project.pages.forEach((page: any) => {
          if (page.tiles && Array.isArray(page.tiles)) {
            allTiles.push(...page.tiles);
          }
        });

        tiles = allTiles;
      }
    } catch (error) {
      console.error('Error loading tiles:', error);
    }
  }

  function loadCustomAudioTiles() {
    // Get list of tiles that have custom audio recordings
    const savedList = localStorage.getItem('tiles-with-custom-audio');
    if (savedList) {
      try {
        tilesWithCustomAudio = JSON.parse(savedList);
      } catch (error) {
        console.error('Error parsing custom audio tiles:', error);
        tilesWithCustomAudio = [];
      }
    }
  }

  function handleRecordingUpdate(event: CustomEvent) {
    const { tileId, hasCustomAudio } = event.detail;

    // Update the list of tiles with custom audio
    if (hasCustomAudio && !tilesWithCustomAudio.includes(tileId)) {
      tilesWithCustomAudio = [...tilesWithCustomAudio, tileId];
    } else if (!hasCustomAudio) {
      tilesWithCustomAudio = tilesWithCustomAudio.filter(id => id !== tileId);
    }

    // Save the updated list to localStorage
    localStorage.setItem('tiles-with-custom-audio', JSON.stringify(tilesWithCustomAudio));
  }

  // Filter tiles based on search query
  $: filteredTiles = tiles.filter(tile => {
    const hasMatchingName = tile.text && tile.text.toLowerCase().includes(searchQuery.toLowerCase());
    return searchQuery === '' ? true : hasMatchingName;
  });

  // Sort tiles to show those with custom audio first
  $: sortedTiles = [...filteredTiles].sort((a, b) => {
    const aHasAudio = tilesWithCustomAudio.includes(a.id);
    const bHasAudio = tilesWithCustomAudio.includes(b.id);

    if (aHasAudio && !bHasAudio) return -1;
    if (!aHasAudio && bHasAudio) return 1;
    return 0;
  });
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" transition:fade={{ duration: 200 }}>
  <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" transition:fly={{ y: 20, duration: 200 }}>
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-800">Voice Recordings</h2>
      <button
        on:click={onClose}
        class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Search bar -->
    <div class="p-4 border-b border-gray-200">
      <div class="relative">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search tiles..."
          class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4">
      {#if loading}
        <div class="flex justify-center items-center h-32">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      {:else if sortedTiles.length === 0}
        <div class="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <p class="text-lg">No tiles found</p>
          <p class="text-sm">{searchQuery ? 'Try a different search term' : 'This project has no tiles yet'}</p>
        </div>
      {:else}
        <div class="grid gap-4 grid-cols-1">
          {#each sortedTiles as tile (tile.id)}
            <VoiceTile
              tileId={tile.id}
              tileName={tile.text || 'Untitled Tile'}
              imageUrl={tile.image}
              on:recordingUpdated={handleRecordingUpdate}
            />
          {/each}
        </div>
      {/if}
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200 flex justify-between items-center">
      <div>
        <span class="text-sm text-gray-500">
          {tilesWithCustomAudio.length} {tilesWithCustomAudio.length === 1 ? 'tile' : 'tiles'} with custom recordings
        </span>
      </div>
      <button
        on:click={onClose}
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Done
      </button>
    </div>
  </div>
</div>
