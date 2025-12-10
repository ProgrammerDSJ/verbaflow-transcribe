export interface TranscriptionSegment {
  id: string; // Unique ID for React keys and editing
  timestamp: string;
  speaker: string;
  text: string;
  isSectionHeader?: boolean; // If true, this segment acts as a visual divider/chapter
  sectionTitle?: string;
  note?: string; // User comments
}

export interface SpeakerMap {
  [originalName: string]: string; // Maps "Speaker 1" -> "Steven"
}

export interface TranscriptionResult {
  segments: TranscriptionSegment[];
  summary?: string;
  language?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  CHUNKING = 'CHUNKING', // New state for audio processing
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface ProcessingState {
  status: AppStatus;
  message?: string;
  progress?: number;
}