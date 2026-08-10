import React from 'react';
import { validateFileExtension } from '@/services/loaders';

export interface DropzoneProps {
  onFileLoaded: (file: File) => void;
  onError: (errorMessage: string) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFileLoaded, onError }) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!validateFileExtension(file.name)) {
      onError(`Unsupported file type: ${file.name}. Only .stl and .obj files are currently supported.`);
      return;
    }
    onFileLoaded(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      data-testid="dropzone-overlay"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: isDragOver ? 'rgba(137, 180, 250, 0.25)' : 'rgba(30, 30, 46, 0.75)',
        backdropFilter: 'blur(8px)',
        border: `2px dashed ${isDragOver ? '#89b4fa' : 'rgba(255, 255, 255, 0.2)'}`,
        borderRadius: '12px',
        padding: '16px 24px',
        color: '#cdd6f4',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleInputChange}
        accept=".stl,.obj"
        style={{ display: 'none' }}
        data-testid="file-input"
      />
      <span style={{ fontSize: '1.25rem' }}>📁</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Drop CAD model here</div>
        <div style={{ fontSize: '0.75rem', color: '#a6adc8' }}>Supports .STL, .OBJ files</div>
      </div>
    </div>
  );
};
