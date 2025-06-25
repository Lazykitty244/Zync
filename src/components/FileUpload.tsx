import React, { useCallback } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an audio file
      if (file.type.startsWith('audio/')) {
        onUpload(file);
      } else {
        alert('Please select an audio file (MP3, WAV, OGG, etc.)');
      }
    }
  }, [onUpload]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
      
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          id="audio-upload"
        />
        
        <label
          htmlFor="audio-upload"
          className="cursor-pointer block"
        >
          <div className="text-gray-400 mb-2">
            <svg className="mx-auto h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <p className="text-sm text-gray-400">
            Click to upload an audio file
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports MP3, WAV, OGG and other audio formats
          </p>
        </label>
      </div>
    </div>
  );
}