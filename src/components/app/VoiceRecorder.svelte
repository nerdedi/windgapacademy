<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  export let maxDuration = 10; // Maximum recording duration in seconds
  export let autoStop = true; // Auto stop after maxDuration
  export let showWaveform = true; // Show audio waveform while recording

  const dispatch = createEventDispatcher();

  let recorder: MediaRecorder | null = null;
  let audioChunks: BlobPart[] = [];
  let audioUrl: string = '';
  let isRecording = false;
  let recordingTime = 0;
  let timerInterval: ReturnType<typeof setInterval>;
  let audioBlob: Blob;
  let audioCtx: AudioContext;
  let analyser: AnalyserNode;
  let source: MediaStreamAudioSourceNode;
  let canvasCtx: CanvasRenderingContext2D | null;
  let animationFrame: number;
  let canvas: HTMLCanvasElement;
  let stream: MediaStream;

  onMount(() => {
    if (showWaveform && canvas) {
      canvasCtx = canvas.getContext('2d');
    }
  });

  onDestroy(() => {
    stopRecording();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  });

  async function startRecording() {
    try {
      if (isRecording) return;

      // Request microphone access
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio analyzer for visualization if needed
      if (showWaveform) {
        setupAudioAnalyzer(stream);
      }

      // Create and configure media recorder
      recorder = new MediaRecorder(stream);
      audioChunks = [];

      // Collect audio chunks
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      // Handle recording stop
      recorder.onstop = () => {
        processRecording();
      };

      // Start recording
      recorder.start();
      isRecording = true;
      recordingTime = 0;

      // Start timer
      timerInterval = setInterval(() => {
        recordingTime += 1;
        if (autoStop && recordingTime >= maxDuration) {
          stopRecording();
        }
      }, 1000);

      dispatch('recordingStarted');

    } catch (error) {
      console.error('Error starting recording:', error);
      dispatch('error', { error });
    }
  }

  function stopRecording() {
    if (!isRecording || !recorder) return;

    clearInterval(timerInterval);
    recorder.stop();
    isRecording = false;

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    dispatch('recordingStopped', { duration: recordingTime });
  }

  function setupAudioAnalyzer(stream: MediaStream) {
    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!canvasCtx || !isRecording) return;

      // Request next animation frame
      animationFrame = requestAnimationFrame(draw);

      // Get frequency data
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      canvasCtx.fillStyle = '#f9fafb';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waveform
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight: number;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#2563eb');
        gradient.addColorStop(1, '#3b82f6');

        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    draw();
  }

  function processRecording() {
    // Create final audio blob
    audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

    // Generate playable URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    audioUrl = URL.createObjectURL(audioBlob);

    // Dispatch event with audio data
    dispatch('recordingReady', {
      blob: audioBlob,
      url: audioUrl,
      duration: recordingTime
    });
  }

  function cancelRecording() {
    stopRecording();
    audioChunks = [];
    audioUrl = '';
    dispatch('recordingCancelled');
  }
</script>

<div class="voice-recorder bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
  <div class="flex flex-col items-center">
    <!-- Waveform visualization -->
    {#if showWaveform}
      <div class="w-full mb-3 h-20 bg-gray-50 rounded-md overflow-hidden">
        <canvas
          bind:this={canvas}
          width="320"
          height="80"
          class="w-full h-full"
        ></canvas>
      </div>
    {/if}

    <!-- Recording timer -->
    <div class="text-xl font-mono mb-3 {isRecording ? 'text-red-500' : 'text-gray-500'}">
      {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
    </div>

    <!-- Controls -->
    <div class="flex gap-3">
      {#if !isRecording && !audioUrl}
        <button
          on:click={startRecording}
          class="rounded-full w-12 h-12 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white"
          title="Start Recording">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      {:else if isRecording}
        <button
          on:click={stopRecording}
          class="rounded-full w-12 h-12 flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white"
          title="Stop Recording">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </button>
        <button
          on:click={cancelRecording}
          class="rounded-full w-12 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700"
          title="Cancel Recording">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {:else if audioUrl}
        <!-- Play button for recorded audio -->
        <audio controls src={audioUrl} class="h-10"></audio>
        <div class="flex gap-2">
          <button
            on:click={() => {
              audioUrl = '';
              audioChunks = [];
              dispatch('reset');
            }}
            class="rounded-full w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700"
            title="Reset">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            on:click={() => dispatch('save', { blob: audioBlob, url: audioUrl })}
            class="rounded-full w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white"
            title="Save Recording">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
