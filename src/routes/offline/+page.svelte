<svelte:head>
  <title>Offline - FreeSpeech AAC</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-zinc-100 p-6 text-center">
  <img src="/icons/offline.svg" alt="Offline" class="mb-6 h-32 w-32" />
  <h1 class="mb-4 text-3xl font-bold text-zinc-800">You're offline</h1>
  <p class="mb-6 max-w-md text-zinc-600">
    FreeSpeech AAC needs an internet connection to access this page.
    Check your connection and try again.
  </p>

  <div class="space-y-4">
    <div class="flex flex-col">
      <p class="mb-2 text-sm font-semibold text-zinc-700">You can still access:</p>
      <ul class="list-disc text-left text-zinc-600">
        <li>Previously viewed projects and pages</li>
        <li>Cached tiles and images</li>
        <li>Basic text-to-speech functionality</li>
      </ul>
    </div>

    <button
      onclick="window.location.reload()"
      class="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
      Try again
    </button>

    <button
      onclick="window.history.back()"
      class="mt-2 rounded border border-zinc-300 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-50">
      Go back
    </button>
  </div>
</div>
