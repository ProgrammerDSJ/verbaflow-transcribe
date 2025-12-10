
// Helper to write string to DataView
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Convert AudioBuffer to WAV Blob
function bufferToWav(abuffer: AudioBuffer, len: number) {
  let numOfChan = abuffer.numberOfChannels;
  let length = len * numOfChan * 2 + 44;
  let buffer = new ArrayBuffer(length);
  let view = new DataView(buffer);
  let channels = [] as Float32Array[];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + len * numOfChan * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, abuffer.sampleRate, true);
  view.setUint32(28, abuffer.sampleRate * 2 * numOfChan, true);
  view.setUint16(32, numOfChan * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, len * numOfChan * 2, true);

  // interleave channels
  for (i = 0; i < numOfChan; i++)
    channels.push(abuffer.getChannelData(i));

  offset = 44;
  while (pos < len) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][pos]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(offset, sample, true);
      offset += 2;
    }
    pos++;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

export const processAudioFile = async (
  file: File, 
  onProgress: (msg: string) => void
): Promise<{ chunks: { data: string; mimeType: string }[], duration: number }> => {
  
  onProgress("Decoding audio file... (this may take a moment for large files)");
  
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;
    
    // Chunk size: 2 minutes (120 seconds)
    // Smaller chunks prevent the AI from cutting off output due to token limits.
    const CHUNK_DURATION = 120; 
    const chunks: { data: string; mimeType: string }[] = [];
    
    const sampleRate = audioBuffer.sampleRate;
    const totalSamples = audioBuffer.length;
    const chunkSamples = CHUNK_DURATION * sampleRate;
    
    const numberOfChunks = Math.ceil(duration / CHUNK_DURATION);
    
    for (let i = 0; i < numberOfChunks; i++) {
      onProgress(`Preparing audio chunk ${i + 1} of ${numberOfChunks}...`);
      
      const startSample = i * chunkSamples;
      const endSample = Math.min(startSample + chunkSamples, totalSamples);
      const frameCount = endSample - startSample;
      
      // Create a new buffer for this chunk
      const newBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels, 
        frameCount, 
        sampleRate
      );
      
      // Copy channel data
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        const newChannelData = newBuffer.getChannelData(channel);
        // Use subarray which is faster than loop
        newChannelData.set(channelData.subarray(startSample, endSample));
      }
      
      // Convert chunk to WAV Blob
      const blob = bufferToWav(newBuffer, frameCount);
      
      // Convert Blob to Base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      chunks.push({
        data: base64Data,
        mimeType: 'audio/wav'
      });
    }
    
    return { chunks, duration };
    
  } catch (error) {
    console.error("Audio processing failed", error);
    throw new Error("Failed to decode audio. The file might be corrupt or format not supported by browser.");
  } finally {
    audioContext.close();
  }
};

export const formatDuration = (seconds: number): string => {
  const date = new Date(0);
  date.setSeconds(seconds);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds();
  
  if (hh > 0) {
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  }
  return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
};
