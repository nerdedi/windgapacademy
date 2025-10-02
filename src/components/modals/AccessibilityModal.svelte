<script lang="ts">
	import { accessibilitySettings, type AccessibilitySettings } from '$ts/client/accessibilityStore';
	import { createEventDispatcher } from 'svelte';

	export let isOpen = false;
	export let userId = '';

	const dispatch = createEventDispatcher();
	let currentSettings: AccessibilitySettings;

	accessibilitySettings.subscribe(settings => {
		currentSettings = { ...settings };
	});

	function updateSetting<K extends keyof AccessibilitySettings>(
		key: K,
		value: AccessibilitySettings[K]
	) {
		currentSettings = { ...currentSettings, [key]: value };
	}

	function saveSettings() {
		accessibilitySettings.saveSettings(userId, currentSettings);
		applyAccessibilitySettings(currentSettings);
		dispatch('close');
		isOpen = false;
	}

	function resetToDefaults() {
		currentSettings = {
			theme: 'default',
			tileSize: 'medium',
			fontSize: 'medium',
			reduceMotion: false,
			enableKeyboardNav: true,
			enableSwitchAccess: false,
			focusHighlight: true,
			screenReaderOptimized: false,
			dwellTime: 1000,
			clickDelay: 300
		};
	}

	function applyAccessibilitySettings(settings: AccessibilitySettings) {
		const root = document.documentElement;

		// Apply theme
		root.setAttribute('data-theme', settings.theme);

		// Apply tile size
		root.setAttribute('data-tile-size', settings.tileSize);

		// Apply font size
		root.setAttribute('data-font-size', settings.fontSize);

		// Apply motion preferences
		if (settings.reduceMotion) {
			root.style.setProperty('--animation-duration', '0s');
		} else {
			root.style.removeProperty('--animation-duration');
		}

		// Apply focus highlight
		root.setAttribute('data-focus-highlight', settings.focusHighlight.toString());
	}

	$: if (isOpen) {
		accessibilitySettings.loadSettings(userId);
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" on:click={() => isOpen = false}>
		<div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" on:click|stopPropagation>
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-2xl font-bold">Accessibility Settings</h2>
				<button on:click={() => isOpen = false} class="text-gray-500 hover:text-gray-700">
					<i class="bi bi-x-lg"></i>
				</button>
			</div>

			<div class="space-y-6">
				<!-- Theme Settings -->
				<div>
					<h3 class="text-lg font-semibold mb-3 flex items-center">
						<i class="bi bi-palette mr-2"></i>
						Visual Theme
					</h3>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{#each [
							{ value: 'default', label: 'Default', desc: 'Standard colors' },
							{ value: 'high-contrast', label: 'High Contrast', desc: 'Better visibility' },
							{ value: 'dark', label: 'Dark Mode', desc: 'Easier on eyes' }
						] as theme}
							<label class="relative">
								<input
									type="radio"
									bind:group={currentSettings.theme}
									value={theme.value}
									class="sr-only"
								/>
								<div class="border-2 rounded-lg p-4 cursor-pointer transition-colors {currentSettings.theme === theme.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}">
									<div class="font-medium">{theme.label}</div>
									<div class="text-sm text-gray-600">{theme.desc}</div>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<!-- Size Settings -->
				<div>
					<h3 class="text-lg font-semibold mb-3 flex items-center">
						<i class="bi bi-arrows-angle-expand mr-2"></i>
						Size Settings
					</h3>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<!-- Tile Size -->
						<div>
							<label class="block text-sm font-medium mb-2">Tile Size</label>
							<select bind:value={currentSettings.tileSize} class="w-full p-2 border border-gray-300 rounded-md">
								<option value="small">Small</option>
								<option value="medium">Medium</option>
								<option value="large">Large</option>
								<option value="extra-large">Extra Large</option>
							</select>
						</div>

						<!-- Font Size -->
						<div>
							<label class="block text-sm font-medium mb-2">Font Size</label>
							<select bind:value={currentSettings.fontSize} class="w-full p-2 border border-gray-300 rounded-md">
								<option value="small">Small</option>
								<option value="medium">Medium</option>
								<option value="large">Large</option>
								<option value="extra-large">Extra Large</option>
							</select>
						</div>
					</div>
				</div>

				<!-- Interaction Settings -->
				<div>
					<h3 class="text-lg font-semibold mb-3 flex items-center">
						<i class="bi bi-hand-index mr-2"></i>
						Interaction
					</h3>
					<div class="space-y-4">
						<label class="flex items-center space-x-3">
							<input
								type="checkbox"
								bind:checked={currentSettings.reduceMotion}
								class="w-4 h-4 text-blue-600"
							/>
							<div>
								<div class="font-medium">Reduce Motion</div>
								<div class="text-sm text-gray-600">Minimize animations and transitions</div>
							</div>
						</label>

						<label class="flex items-center space-x-3">
							<input
								type="checkbox"
								bind:checked={currentSettings.enableKeyboardNav}
								class="w-4 h-4 text-blue-600"
							/>
							<div>
								<div class="font-medium">Keyboard Navigation</div>
								<div class="text-sm text-gray-600">Navigate using keyboard arrows and spacebar</div>
							</div>
						</label>

						<label class="flex items-center space-x-3">
							<input
								type="checkbox"
								bind:checked={currentSettings.focusHighlight}
								class="w-4 h-4 text-blue-600"
							/>
							<div>
								<div class="font-medium">Enhanced Focus Highlight</div>
								<div class="text-sm text-gray-600">Stronger visual focus indicators</div>
							</div>
						</label>

						<label class="flex items-center space-x-3">
							<input
								type="checkbox"
								bind:checked={currentSettings.screenReaderOptimized}
								class="w-4 h-4 text-blue-600"
							/>
							<div>
								<div class="font-medium">Screen Reader Optimization</div>
								<div class="text-sm text-gray-600">Enhanced compatibility with screen readers</div>
							</div>
						</label>
					</div>
				</div>

				<!-- Switch Access Settings -->
				<div>
					<h3 class="text-lg font-semibold mb-3 flex items-center">
						<i class="bi bi-toggle-on mr-2"></i>
						Switch Access
					</h3>
					<div class="space-y-4">
						<label class="flex items-center space-x-3">
							<input
								type="checkbox"
								bind:checked={currentSettings.enableSwitchAccess}
								class="w-4 h-4 text-blue-600"
							/>
							<div>
								<div class="font-medium">Enable Switch Access</div>
								<div class="text-sm text-gray-600">Navigate using external switches</div>
							</div>
						</label>

						{#if currentSettings.enableSwitchAccess}
							<div class="ml-7 space-y-3">
								<div>
									<label class="block text-sm font-medium mb-1">Dwell Time (ms)</label>
									<input
										type="range"
										min="500"
										max="3000"
										step="100"
										bind:value={currentSettings.dwellTime}
										class="w-full"
									/>
									<div class="text-sm text-gray-600">{currentSettings.dwellTime}ms</div>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Click Delay -->
				<div>
					<h3 class="text-lg font-semibold mb-3 flex items-center">
						<i class="bi bi-clock mr-2"></i>
						Click Delay
					</h3>
					<div>
						<label class="block text-sm font-medium mb-1">Prevent Accidental Double Clicks (ms)</label>
						<input
							type="range"
							min="0"
							max="1000"
							step="50"
							bind:value={currentSettings.clickDelay}
							class="w-full"
						/>
						<div class="text-sm text-gray-600">{currentSettings.clickDelay}ms</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex space-x-3 mt-8">
				<button
					on:click={resetToDefaults}
					class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
				>
					Reset to Defaults
				</button>
				<button
					on:click={() => isOpen = false}
					class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
				>
					Cancel
				</button>
				<button
					on:click={saveSettings}
					class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
				>
					Save Settings
				</button>
			</div>
		</div>
	</div>
{/if}
