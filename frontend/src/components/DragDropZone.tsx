import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

interface Props {
  onUpload: (file: File) => void;
}

export default function DragDropZone({ onUpload }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept: {'application/pdf':['.pdf']},
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDrop: files => {
      setIsDragActive(false);
      if (files[0]) {
        setIsUploading(true);
        setUploadProgress(0);
        
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + 5;
            if (newProgress >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
              }, 500);
              return 100;
            }
            return newProgress;
          });
        }, 100);
        
        onUpload(files[0]);
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-12 border-2 border-dashed rounded-xl transition-all duration-300 bg-gradient-to-br ${
        isDragActive 
          ? 'border-cyan-500 from-cyan-900/20 to-purple-900/20 shadow-lg shadow-cyan-500/10'
          : 'border-gray-600 from-gray-900 to-gray-900 hover:border-cyan-500/60 hover:from-gray-900 hover:to-gray-800'
      }`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center">
        {isUploading ? (
          <div className="flex flex-col items-center space-y-6 w-full max-w-sm">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-gray-700"></div>
                <div 
                  className="absolute inset-0 rounded-full border-2 border-t-cyan-500 border-r-purple-500 border-b-transparent border-l-transparent"
                  style={{ 
                    transform: `rotate(${uploadProgress * 3.6}deg)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-cyan-400">
                  {uploadProgress}%
                </div>
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="text-center text-cyan-400 font-medium">Uploading PDF...</div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-600"
                  style={{ width: `${uploadProgress}%`, transition: 'width 0.1s ease-out' }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-inner">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {isDragActive ? "Drop Your PDF Here" : "Upload PDF Document"}
              </h3>
              <p className="text-gray-400 text-center max-w-md">
                {isDragActive 
                  ? "Release to upload the file" 
                  : "Drag & drop your PDF file here, or click to browse"
                }
              </p>
            </div>
            
            {/* Supported file info */}
            <div className="mt-6 text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Supported file: PDF
            </div>
          </>
        )}
      </div>
    </div>
  );
}