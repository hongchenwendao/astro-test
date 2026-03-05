import React, { useState, useCallback } from 'react';
import { UploadZone } from '@saas/ui';

interface CompressedImage {
  id: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  compressedBlob: Blob;
  previewUrl: string;
  originalUrl: string;
}

interface ImageCompressorProps {
  accentColor?: string;
}

export default function ImageCompressor({
  accentColor = '#6366f1',
}: ImageCompressorProps) {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [processing, setProcessing] = useState(false);

  const compressImage = useCallback(
    async (file: File): Promise<CompressedImage> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const originalUrl = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas not supported'));
            return;
          }
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Compression failed'));
                return;
              }
              resolve({
                id: crypto.randomUUID(),
                file,
                originalSize: file.size,
                compressedSize: blob.size,
                compressedBlob: blob,
                previewUrl: URL.createObjectURL(blob),
                originalUrl,
              });
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = originalUrl;
      });
    },
    [quality]
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      setProcessing(true);
      try {
        const results = await Promise.all(files.map(compressImage));
        setImages((prev) => [...prev, ...results]);
      } catch (err) {
        console.error('Compression error:', err);
      }
      setProcessing(false);
    },
    [compressImage]
  );

  const recompress = useCallback(async () => {
    if (images.length === 0) return;
    setProcessing(true);
    try {
      const results = await Promise.all(
        images.map((img) => compressImage(img.file))
      );
      setImages(results);
    } catch (err) {
      console.error('Recompression error:', err);
    }
    setProcessing(false);
  }, [images, compressImage]);

  const downloadImage = (img: CompressedImage) => {
    const a = document.createElement('a');
    a.href = img.previewUrl;
    const ext = 'jpg';
    const baseName = img.file.name.replace(/\.[^.]+$/, '');
    a.download = `${baseName}-compressed.${ext}`;
    a.click();
  };

  const downloadAll = () => {
    images.forEach(downloadImage);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.previewUrl);
        URL.revokeObjectURL(img.originalUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.previewUrl);
      URL.revokeObjectURL(img.originalUrl);
    });
    setImages([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalOriginal = images.reduce((sum, i) => sum + i.originalSize, 0);
  const totalCompressed = images.reduce((sum, i) => sum + i.compressedSize, 0);
  const totalSaved = totalOriginal > 0
    ? Math.round((1 - totalCompressed / totalOriginal) * 100)
    : 0;

  return (
    <div>
      {/* Upload Zone */}
      <UploadZone
        onFiles={handleFiles}
        accentColor={accentColor}
        accept="image/*"
        multiple
      />

      {/* Quality Slider */}
      <div
        style={{
          margin: '24px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <label
          style={{ fontSize: '14px', color: '#94a3b8', whiteSpace: 'nowrap' }}
        >
          画质
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor }}
        />
        <span
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#e2e8f0',
            minWidth: '40px',
            textAlign: 'right',
          }}
        >
          {Math.round(quality * 100)}%
        </span>
        {images.length > 0 && (
          <button
            onClick={recompress}
            disabled={processing}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: `1px solid ${accentColor}`,
              background: 'transparent',
              color: accentColor,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            重新压缩
          </button>
        )}
      </div>

      {/* Processing indicator */}
      {processing && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: '#a78bfa',
            fontSize: '15px',
          }}
        >
          ⏳ 压缩中...
        </div>
      )}

      {/* Results */}
      {images.length > 0 && (
        <div>
          {/* Summary bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              marginBottom: '16px',
              background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
              borderRadius: '12px',
              border: `1px solid ${accentColor}30`,
            }}
          >
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                  原始大小
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0' }}>
                  {formatSize(totalOriginal)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                  压缩后
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#a78bfa' }}>
                  {formatSize(totalCompressed)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                  节省
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#4ade80' }}>
                  {totalSaved}%
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={downloadAll}
                style={{
                  padding: '8px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${accentColor}, #8b5cf6)`,
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                全部下载
              </button>
              <button
                onClick={clearAll}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  color: '#94a3b8',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                清空
              </button>
            </div>
          </div>

          {/* Image cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {images.map((img) => {
              const saved = Math.round(
                (1 - img.compressedSize / img.originalSize) * 100
              );
              return (
                <div
                  key={img.id}
                  style={{
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      overflow: 'hidden',
                      background: '#111',
                    }}
                  >
                    <img
                      src={img.previewUrl}
                      alt={img.file.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(4px)',
                        color: saved > 0 ? '#4ade80' : '#f87171',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      {saved > 0 ? `-${saved}%` : `+${Math.abs(saved)}%`}
                    </div>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#e2e8f0',
                        margin: '0 0 6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {img.file.name}
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        margin: '0 0 10px',
                      }}
                    >
                      {formatSize(img.originalSize)} → {formatSize(img.compressedSize)}
                    </p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => downloadImage(img)}
                        style={{
                          flex: 1,
                          padding: '6px',
                          borderRadius: '8px',
                          border: 'none',
                          background: `${accentColor}20`,
                          color: accentColor,
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        下载
                      </button>
                      <button
                        onClick={() => removeImage(img.id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'transparent',
                          color: '#64748b',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
