import React from 'react';

interface ProseProps {
  children: React.ReactNode;
}

/**
 * Prose — 为 Markdown 渲染后的 HTML 提供精美的阅读排版样式。
 * 包裹在此组件中的内容（h1-h6, p, a, blockquote, code, ul/ol 等）
 * 会自动获得优化的间距、字号和颜色。
 */
export function Prose({ children }: ProseProps) {
  return (
    <div className="prose-container" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <style dangerouslySetInnerHTML={{ __html: proseStyles }} />
      <div className="prose">{children}</div>
    </div>
  );
}

const proseStyles = `
.prose {
  font-size: 17px;
  line-height: 1.8;
  color: #cbd5e1;
}

.prose h1 {
  font-size: 2.2em;
  font-weight: 800;
  color: #f1f5f9;
  margin: 2em 0 0.6em;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.prose h2 {
  font-size: 1.6em;
  font-weight: 700;
  color: #e2e8f0;
  margin: 1.8em 0 0.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.prose h3 {
  font-size: 1.3em;
  font-weight: 600;
  color: #e2e8f0;
  margin: 1.5em 0 0.4em;
}

.prose p {
  margin: 1.2em 0;
}

.prose a {
  color: #818cf8;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.prose a:hover {
  color: #a78bfa;
}

.prose strong {
  color: #f1f5f9;
  font-weight: 600;
}

.prose blockquote {
  border-left: 3px solid #6366f1;
  padding: 0.8em 1.2em;
  margin: 1.5em 0;
  background: rgba(99, 102, 241, 0.06);
  border-radius: 0 8px 8px 0;
  color: #94a3b8;
  font-style: italic;
}

.prose blockquote p {
  margin: 0.4em 0;
}

.prose ul, .prose ol {
  padding-left: 1.6em;
  margin: 1em 0;
}

.prose li {
  margin: 0.4em 0;
}

.prose li::marker {
  color: #6366f1;
}

.prose code {
  background: rgba(255,255,255,0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #e879f9;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.prose pre {
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 20px 24px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose pre code {
  background: none;
  padding: 0;
  color: #e2e8f0;
  font-size: 0.85em;
  line-height: 1.7;
}

.prose img {
  max-width: 100%;
  border-radius: 12px;
  margin: 1.5em 0;
  border: 1px solid rgba(255,255,255,0.06);
}

.prose hr {
  border: none;
  border-top: 1px solid rgba(255,255,255,0.06);
  margin: 2em 0;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}

.prose th, .prose td {
  border: 1px solid rgba(255,255,255,0.08);
  padding: 10px 14px;
  text-align: left;
}

.prose th {
  background: rgba(255,255,255,0.04);
  font-weight: 600;
  color: #e2e8f0;
}
`;
