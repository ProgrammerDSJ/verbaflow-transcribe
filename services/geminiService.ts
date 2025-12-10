
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TranscriptionSegment } from "../types";

const MODEL_NAME = "gemini-2.5-flash";

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      timestamp: {
        type: Type.STRING,
        description: "The timestamp of the spoken line relative to the audio chunk start (HH:MM:SS or MM:SS).",
      },
      speaker: {
        type: Type.STRING,
        description: "The identifier of the speaker (e.g., Speaker 1, Speaker 2). Keep consistent with previous context.",
      },
      text: {
        type: Type.STRING,
        description: "The transcribed text.",
      },
    },
    required: ["timestamp", "speaker", "text"],
  },
};

const repairTruncatedJson = (jsonStr: string): string => {
  let cleaned = jsonStr.trim();
  if (!cleaned.endsWith(']')) {
    const lastObjectEnd = cleaned.lastIndexOf('},');
    if (lastObjectEnd !== -1) {
      cleaned = cleaned.substring(0, lastObjectEnd + 1); 
      cleaned += ']';
    } else {
        const lastBrace = cleaned.lastIndexOf('}');
        if (lastBrace !== -1) {
             cleaned = cleaned.substring(0, lastBrace + 1);
             cleaned += ']';
        }
    }
  }
  return cleaned;
};

// Helper to convert timestamp string to seconds
const timestampToSeconds = (ts: string): number => {
  const parts = ts.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
};

// Helper to convert seconds back to HH:MM:SS
const secondsToTimestamp = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Simple delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const CHUNK_DURATION_SECONDS = 120; // Must match fileUtils.ts

export const transcribeChunks = async (
  chunks: { data: string; mimeType: string }[],
  onProgress: (msg: string) => void
): Promise<TranscriptionSegment[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  let allSegments: TranscriptionSegment[] = [];
  let chunkOffsetSeconds = 0;
  
  // Context memory to help speaker consistency across chunks
  let previousTranscriptContext = "";

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    let success = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!success && attempts < maxAttempts) {
      attempts++;
      onProgress(`Transcribing part ${i + 1} of ${chunks.length}... ${attempts > 1 ? `(Attempt ${attempts})` : ''}`);
      
      try {
        const contextPrompt = previousTranscriptContext 
          ? `PREVIOUS CONTEXT (The conversation immediately preceding this chunk):
             """
             ${previousTranscriptContext}
             """
             IMPORTANT: Use this context to identify speakers. If "Speaker 1" was speaking at the end of the context, they are likely the first speaker here unless the voice changes clearly.` 
          : "This is the start of the audio.";

        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: {
            parts: [
              { inlineData: chunk },
              {
                text: `
                  You are an expert transcriber. Transcribe this audio chunk verbatim. It is part ${i + 1} of a longer podcast/video.
                  
                  ${contextPrompt}

                  STRICT INSTRUCTIONS:
                  1. DISTINGUISH SPEAKERS: Listen carefully to voice pitch, tone, and cadence. Differentiate clearly between 'Speaker 1', 'Speaker 2', etc.
                  2. VERBATIM: Transcribe EVERY spoken word. Do not summarize. Include filler words if they add context, but remove excessive stuttering.
                  3. TIMESTAMPS: Must be relative to the start of THIS chunk (00:00).
                  4. FORMAT: Return a valid JSON array matching the schema.
                  5. CONTINUITY: Ensure the flow of text matches the previous context provided.
                `,
              },
            ],
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.1, // Lower temperature for more consistent/deterministic output
            maxOutputTokens: 8192,
          },
        });

        const jsonText = response.text || "[]";
        let segments: any[] = [];
        
        try {
          segments = JSON.parse(jsonText);
        } catch (e) {
          console.warn(`JSON parse error in chunk ${i}, repairing...`);
          segments = JSON.parse(repairTruncatedJson(jsonText));
        }

        // Adjust timestamps and add ID
        const adjustedSegments = segments.map((s: any, idx: number) => {
          const secondsInChunk = timestampToSeconds(s.timestamp);
          const totalSeconds = chunkOffsetSeconds + secondsInChunk;
          return {
            id: `seg-${i}-${idx}-${Date.now()}`,
            timestamp: secondsToTimestamp(totalSeconds),
            speaker: s.speaker,
            text: s.text,
          };
        });

        allSegments = [...allSegments, ...adjustedSegments];
        
        // Update context for the next chunk
        // Take the last 3 segments to give the model a sense of who was speaking last
        if (adjustedSegments.length > 0) {
          const lastFew = adjustedSegments.slice(-3);
          previousTranscriptContext = lastFew.map(s => `${s.speaker}: ${s.text}`).join("\n");
        }

        success = true;

      } catch (error) {
        console.error(`Error transcribing chunk ${i} attempt ${attempts}:`, error);
        
        if (attempts === maxAttempts) {
          allSegments.push({
            id: `err-${i}`,
            timestamp: secondsToTimestamp(chunkOffsetSeconds),
            speaker: "System",
            text: `[Error: Failed to transcribe part ${i + 1} after ${maxAttempts} attempts. Audio data may be missing here.]`
          });
          // Don't kill the whole process, just move to next chunk
          // Reset context since we have a gap
          previousTranscriptContext = ""; 
        } else {
          await delay(1000 * attempts);
        }
      }
    }
    
    chunkOffsetSeconds += CHUNK_DURATION_SECONDS; 
    await delay(500);
  }

  return mergeConsecutiveSegments(allSegments);
};

// Post-processing to merge small consecutive segments from the same speaker
const mergeConsecutiveSegments = (segments: TranscriptionSegment[]): TranscriptionSegment[] => {
  if (segments.length === 0) return [];

  const merged: TranscriptionSegment[] = [];
  let current = segments[0];

  for (let i = 1; i < segments.length; i++) {
    const next = segments[i];

    // If same speaker and not a section header/error, merge text
    if (
      current.speaker === next.speaker && 
      !current.isSectionHeader && 
      !next.isSectionHeader &&
      !current.text.startsWith('[Error') &&
      !next.text.startsWith('[Error')
    ) {
      current.text += " " + next.text;
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);
  return merged;
};
