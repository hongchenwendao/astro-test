import React, { useCallback, useRef, useState } from 'react';

interface UploadZoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFiles: (files: File[]) => void;
  accentColor?: string;
}

export function UploadZone({
  accept = 'image/*',
  multiple = true,
  maxSizeMB = 20,
  onFiles,
  accentColor = '#6366f1',
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const maxBytes = maxSizeMB * 1024 * 1024;
      const valid = Array.from(fileList).filter((f) => f.size <= maxBytes);
      if (valid.length > 0) onFiles(valid);
    },
    [maxSizeMB, onFiles]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragging ? accentColor : 'rgba(255,255,255,0.2)'}`,
        borderRadius: '16px',
        padding: '48px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: isDragging
          ? `${accentColor}10`
          : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>
        {isDragging ? '📥' : '🖼️'}
      </div>
      <p
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#e2e8f0',
          margin: '0 0 8px',
        }}
      >
        {isDragging ? '松开即可上传' : '拖拽图片到此处'}
      </p>
      <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
        或点击选择文件 · 单张最大 {maxSizeMB}MB
      </p>
    </div>
  );
}
