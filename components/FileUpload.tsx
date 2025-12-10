
import React, { useCallback, useState } from 'react';
import { Upload, FileAudio, FileVideo } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (isLoading) return;
    
    // Simple validation
    const validTypes = ['audio/', 'video/'];
    const isValid = validTypes.some(type => file.type.startsWith(type));
    
    if (isValid) {
      setSelectedFileName(file.name);
      onFileSelect(file);
    } else {
      alert("Please upload a valid audio or video file.");
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileName(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out
        ${dragActive ? 'border-primary bg-primary/5' : 'border-slate-300 bg-white hover:bg-slate-50'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleChange}
          accept="audio/*,video/*"
          disabled={isLoading}
        />

        {selectedFileName ? (
          <div className="flex flex-col items-center p-4 text-center animate-fade-in">
             <div className="p-4 bg-indigo-50 rounded-full mb-3 text-primary">
                {selectedFileName.match(/\.(mp4|mov|avi|mkv)$/i) ? <FileVideo size={32} /> : <FileAudio size={32} />}
            </div>
            <p className="text-lg font-medium text-slate-700 max-w-xs truncate">{selectedFileName}</p>
            <p className="text-sm text-slate-500 mt-1">Ready to transcribe</p>
            <button 
              onClick={clearFile}
              className="mt-4 px-4 py-2 text-sm text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors z-10"
              disabled={isLoading}
            >
              Change File
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center p-4 text-center">
            <div className="p-4 bg-slate-100 rounded-full mb-3 text-slate-400">
              <Upload size={32} />
            </div>
            <p className="text-lg font-medium text-slate-700">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              Supports MP3, WAV, M4A, MP4, MOV. <br/> (Long files are automatically chunked for full accuracy)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;