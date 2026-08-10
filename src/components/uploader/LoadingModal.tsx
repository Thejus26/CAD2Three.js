import React from 'react';

export interface LoadingModalProps {
  isOpen: boolean;
  filename: string;
  progress: number;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, filename, progress }) => {
  if (!isOpen) return null;

  return (
    <div
      data-testid="loading-modal"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(17, 17, 27, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: '#1e1e2e',
          padding: '24px 32px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minWidth: '320px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          textAlign: 'center',
          color: '#cdd6f4',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Parsing CAD Model</h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#a6adc8' }}>{filename}</p>

        {/* Progress Bar Container */}
        <div
          style={{
            width: '100%',
            height: '8px',
            background: '#313244',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              height: '100%',
              background: '#89b4fa',
              transition: 'width 0.2s ease',
            }}
          />
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#89b4fa' }}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};
