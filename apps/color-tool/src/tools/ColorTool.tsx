import React, { useState, useCallback, useMemo } from 'react';

interface ColorToolProps {
  accentColor?: string;
}

// 颜色转换工具函数
function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const [r, g, b] = rgb.map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = lum(hex1), l2 = lum(hex2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function generatePalette(hex: string): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex];
  const [h, s, l] = rgbToHsl(...rgb);
  return [
    hslToHex(h, s, Math.max(l - 30, 10)),
    hslToHex(h, s, Math.max(l - 15, 15)),
    hex,
    hslToHex(h, s, Math.min(l + 15, 90)),
    hslToHex(h, s, Math.min(l + 30, 95)),
  ];
}

function generateHarmony(hex: string, mode: string): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex];
  const [h, s, l] = rgbToHsl(...rgb);
  switch (mode) {
    case 'complementary': return [hex, hslToHex((h + 180) % 360, s, l)];
    case 'triadic': return [hex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
    case 'analogous': return [hslToHex((h - 30 + 360) % 360, s, l), hex, hslToHex((h + 30) % 360, s, l)];
    case 'split': return [hex, hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l)];
    default: return [hex];
  }
}

export default function ColorTool({ accentColor = '#f97316' }: ColorToolProps) {
  const [colorInput, setColorInput] = useState('#f97316');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#1e293b');
  const [harmonyMode, setHarmonyMode] = useState('complementary');
  const [copied, setCopied] = useState('');

  const parsedHex = useMemo(() => {
    let c = colorInput.trim();
    if (!c.startsWith('#')) c = '#' + c;
    if (/^#[0-9a-f]{6}$/i.test(c)) return c;
    return null;
  }, [colorInput]);

  const rgb = parsedHex ? hexToRgb(parsedHex) : null;
  const hsl = rgb ? rgbToHsl(...rgb) : null;
  const palette = parsedHex ? generatePalette(parsedHex) : [];
  const harmony = parsedHex ? generateHarmony(parsedHex, harmonyMode) : [];
  const contrast = getContrastRatio(fgColor, bgColor);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 1500);
  }, []);

  const contrastLevel =
    contrast >= 7 ? 'AAA ✅' : contrast >= 4.5 ? 'AA ✅' : contrast >= 3 ? 'AA 大文本 ⚠️' : '不通过 ❌';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 颜色输入 + 预览 */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>🎨 颜色转换</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="color"
            value={parsedHex || '#f97316'}
            onChange={(e) => setColorInput(e.target.value)}
            style={{ width: '56px', height: '56px', border: 'none', borderRadius: '12px', cursor: 'pointer', background: 'transparent' }}
          />
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="#f97316"
            spellCheck={false}
            style={inputStyle}
          />
          {parsedHex && (
            <div style={{ width: '80px', height: '56px', borderRadius: '12px', background: parsedHex, border: '1px solid rgba(255,255,255,0.1)' }} />
          )}
        </div>

        {parsedHex && rgb && hsl && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
            {[
              { label: 'HEX', value: parsedHex },
              { label: 'RGB', value: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` },
              { label: 'HSL', value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => copy(f.value)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>{f.label}</div>
                <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'monospace' }}>
                  {copied === f.value ? '✓ 已复制' : f.value}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 明暗调色板 */}
      {parsedHex && palette.length > 0 && (
        <div style={cardStyle}>
          <h3 style={titleStyle}>🌓 明暗梯度</h3>
          <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', height: '80px' }}>
            {palette.map((c, i) => (
              <div
                key={i}
                onClick={() => copy(c)}
                style={{
                  flex: 1,
                  background: c,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '8px',
                  transition: 'flex 0.2s',
                }}
                title={c}
              >
                <span style={{ fontSize: '10px', fontWeight: 600, color: i < 2 ? '#fff' : '#000', opacity: 0.7 }}>
                  {copied === c ? '✓' : c}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 和谐配色 */}
      {parsedHex && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ ...titleStyle, marginBottom: 0 }}>🌈 和谐配色</h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { key: 'complementary', label: '互补' },
                { key: 'triadic', label: '三角' },
                { key: 'analogous', label: '类似' },
                { key: 'split', label: '分裂互补' },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setHarmonyMode(m.key)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '8px',
                    border: harmonyMode === m.key ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.08)',
                    background: harmonyMode === m.key ? `${accentColor}20` : 'transparent',
                    color: harmonyMode === m.key ? accentColor : '#94a3b8',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', height: '80px' }}>
            {harmony.map((c, i) => (
              <div
                key={i}
                onClick={() => copy(c)}
                style={{
                  flex: 1,
                  background: c,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'flex 0.2s',
                }}
                title={c}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                  {copied === c ? '✓ 已复制' : c}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 对比度检测 */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>👁️ 对比度检测 (WCAG)</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>前景色</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
              <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                spellCheck={false} style={{ ...inputStyle, width: '100px' }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>背景色</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
              <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                spellCheck={false} style={{ ...inputStyle, width: '100px' }} />
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: contrast >= 4.5 ? '#4ade80' : contrast >= 3 ? '#facc15' : '#f87171' }}>
              {contrast.toFixed(2)}:1
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>{contrastLevel}</div>
          </div>
        </div>
        <div style={{
          padding: '24px',
          borderRadius: '12px',
          background: bgColor,
          color: fgColor,
          fontSize: '16px',
          fontWeight: 600,
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          这是预览文字 — The quick brown fox
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: '24px',
  borderRadius: '16px',
  background: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid rgba(255,255,255,0.06)',
  backdropFilter: 'blur(10px)',
};

const titleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#e2e8f0',
  marginBottom: '16px',
};

const inputStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: '#e2e8f0',
  fontSize: '16px',
  fontFamily: 'monospace',
  outline: 'none',
  width: '140px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: '#64748b',
  fontWeight: 600,
  marginBottom: '6px',
};
