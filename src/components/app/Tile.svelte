<script lang="ts">
	import { speakText } from '$ts/client/speak';
	import {
		TileBeingEdited,
		LocalSettings,
		EditingTiles,
		UnsavedChanges,
		DiscardUnsavedChangesHandler,
		UnsavedChangesModalOpen,
		UsingOnlineSearch,
		Sentence
	} from '$ts/client/stores';
	import type { Tile } from '$ts/common/types';

	export let tile: Tile;
	export let noInteraction = false;

	let tileTextContainerHeight = 0;

	const handleInteraction = () => {
		if ($EditingTiles) {
			// deselect tile
			if ($TileBeingEdited && $TileBeingEdited.id === tile.id) return ($TileBeingEdited = null);

			if (!$UnsavedChanges) {
				// reset state
				$UsingOnlineSearch = false;
				$TileBeingEdited = { ...tile };
			} else {
				// handle unsaved changes
				$DiscardUnsavedChangesHandler = () => {
					$UsingOnlineSearch = false;
					$TileBeingEdited = { ...tile };
				};

				// open modal
				$UnsavedChangesModalOpen = true;
			}
		} else {
			if ($LocalSettings.speakOnTap) {
				// Pass the tile ID to check for custom voice recordings
				speakText(tile.text, tile.id);
			}
			if ($LocalSettings.sentenceBuilder && !tile.navigation) {
				$Sentence = [...$Sentence, tile];
			}
		}
	};
</script>

<div
	class={`group relative h-full w-full transition-opacity ${$EditingTiles && $TileBeingEdited && $TileBeingEdited.id !== tile.id ? 'opacity-40' : ''}`}
>
	<button
		on:click={noInteraction ? null : handleInteraction}
		style={`background-color: ${tile.backgroundColor}; border-color: ${tile.borderColor};${tile.image ? ' grid-template-rows: 25% 75%;' : ''}`}
		class={`absolute left-0 top-0 h-full w-full overflow-hidden rounded-md border ${
			tile.image ? 'grid grid-cols-1 grid-rows-2' : 'grid place-items-center'
		}`}
	>
		{#if tile.image}
			<div bind:clientHeight={tileTextContainerHeight} class="relative h-full w-full">
				<div class="absolute left-0 top-0 flex h-full w-full items-center justify-center">
					<p
						style={`font-size: ${Math.max(3, Math.floor(tileTextContainerHeight * 0.7))}px;`}
						class="flex-1 truncate px-2 text-center"
					>
						{tile.displayText || tile.text}
					</p>
				</div>
			</div>

			<img src={tile.image} class="h-full w-full object-contain" alt="Tile media" />
		{:else}
			<p class={`w-full truncate ${!tile.image ? 'text-[2vw]' : 'py-2'}`}>
				{tile.displayText || tile.text}
			</p>
		{/if}

		<!-- Custom voice indicator -->
		{#if tile.hasCustomVoice}
			<div class="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-blue-500 p-0.5 shadow-md">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" class="h-3 w-3">
					<path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
					<path d="M5.5 9.643a.5.5 0 01-.5.5H3a.5.5 0 010-1h2a.5.5 0 01.5.5zM17 9.643a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM5 12.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5z" />
				</svg>
			</div>
		{/if}
	</button>
	{#if tile.navigation}
		<div
			style={`background-color: ${tile.backgroundColor}; border-color: ${tile.borderColor};`}
			class={`absolute -top-1 left-0 h-[10px] w-[50%] rounded-t-md border border-b-0 brightness-100 group-hover:brightness-105 group-active:brightness-100`}
		/>
	{/if}
</div>
