
import React, { useState } from 'react';
import { Mic, Loader2, AlertCircle } from 'lucide-react';
import FileUpload from './components/FileUpload';
import TranscriptionTable from './components/TranscriptionTable';
import { AppStatus, ProcessingState, TranscriptionSegment } from './types';
import { processAudioFile } from './services/fileUtils';
import { transcribeChunks } from './services/geminiService';

const App: React.FC = () => {
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [state, setState] = useState<ProcessingState>({
    status: AppStatus.IDLE,
  });

  const handleFileSelect = async (selectedFile: File) => {
    setSegments([]);
    startTranscription(selectedFile);
  };

  const startTranscription = async (fileToTranscribe: File) => {
    setState({ status: AppStatus.CHUNKING, message: 'Analyzing and processing audio file...' });

    try {
      // Step 1: Client-side Chunking (10-min chunks)
      const { chunks, duration } = await processAudioFile(fileToTranscribe, (msg) => {
        setState(prev => ({ ...prev, message: msg }));
      });

      setState({ status: AppStatus.PROCESSING, message: 'Sending audio to Gemini for transcription...' });

      // Step 2: Sequential Processing with Gemini
      const resultSegments = await transcribeChunks(chunks, (msg) => {
         setState(prev => ({ ...prev, message: msg }));
      });
      
      setSegments(resultSegments);
      setState({ status: AppStatus.COMPLETED });

    } catch (error: any) {
      console.error(error);
      let errorMessage = "An error occurred during transcription.";
      if (error.message) {
        errorMessage = error.message;
      }
      setState({ status: AppStatus.ERROR, message: errorMessage });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Mic className="text-primary" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
              VerbaFlow
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Transcribe Full Podcasts <br/> with Editor & PDF Export
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload long audio/video files. We'll chunk them automatically for accuracy, allow you to edit names, chapters, and export to PDF.
          </p>
        </div>

        {/* Input Section */}
        {state.status === AppStatus.IDLE || state.status === AppStatus.COMPLETED || state.status === AppStatus.ERROR ? (
           <FileUpload 
            onFileSelect={handleFileSelect} 
            isLoading={false} 
          />
        ) : null}

        {/* Status Indicators */}
        {(state.status === AppStatus.CHUNKING || state.status === AppStatus.PROCESSING) && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <Loader2 size={48} className="text-primary animate-spin relative z-10" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              {state.status === AppStatus.CHUNKING ? 'Processing Audio' : 'Transcribing'}
            </h3>
            <p className="text-slate-500 mt-2 max-w-md text-center">{state.message}</p>
          </div>
        )}

        {state.status === AppStatus.ERROR && (
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-fade-in">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold">Transcription Failed</h3>
              <p className="text-sm mt-1">{state.message}</p>
              <button 
                onClick={() => setState({ status: AppStatus.IDLE })}
                className="mt-3 text-xs font-semibold underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {state.status === AppStatus.COMPLETED && segments.length > 0 && (
          <TranscriptionTable initialSegments={segments} />
        )}
      </main>
      
      <footer className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm mt-12">
        &copy; {new Date().getFullYear()} VerbaFlow Transcribe. Built with React & Gemini.
      </footer>
    </div>
  );
};

export default App;
