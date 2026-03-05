import React, { useState, useCallback } from 'react';

interface JsonFormatterProps {
  accentColor?: string;
}

export default function JsonFormatter({
  accentColor = '#10b981',
}: JsonFormatterProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const formatJson = useCallback(() => {
    if (!input.trim()) {
      setError('请输入 JSON 数据');
      setOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (e: any) {
      setError(`JSON 语法错误: ${e.message}`);
      setOutput('');
    }
  }, [input, indent]);

  const minifyJson = useCallback(() => {
    if (!input.trim()) {
      setError('请输入 JSON 数据');
      setOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e: any) {
      setError(`JSON 语法错误: ${e.message}`);
      setOutput('');
    }
  }, [input]);

  const validateJson = useCallback(() => {
    if (!input.trim()) {
      setError('请输入 JSON 数据');
      return;
    }
    try {
      JSON.parse(input);
      setError('');
      setOutput('✅ JSON 格式正确！');
    } catch (e: any) {
      setError(`❌ ${e.message}`);
      setOutput('');
    }
  }, [input]);

  const copyOutput = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const clearAll = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
  }, []);

  const loadSample = useCallback(() => {
    const sample = {
      "name": "JSONGenie",
      "version": "1.0.0",
      "description": "在线 JSON 格式化工具",
      "author": {
        "name": "开发者",
        "email": "dev@jsongenie.dev"
      },
      "features": ["格式化", "校验", "压缩", "树状查看"],
      "config": {
        "theme": "dark",
        "indent": 2,
        "autoFormat": true
      },
      "tags": ["json", "formatter", "developer-tools"]
    };
    setInput(JSON.stringify(sample));
    setOutput('');
    setError('');
  }, []);

  const inputStats = input.trim()
    ? (() => {
        try {
          const parsed = JSON.parse(input);
          const keys = JSON.stringify(parsed).length;
          return { valid: true, size: keys };
        } catch {
          return { valid: false, size: input.length };
        }
      })()
    : null;

  return (
    <div>
      {/* 操作栏 */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '16px',
          alignItems: 'center',
        }}
      >
        <button onClick={formatJson} style={btnStyle(accentColor, true)}>
          ✨ 美化
        </button>
        <button onClick={minifyJson} style={btnStyle(accentColor, false)}>
          📦 压缩
        </button>
        <button onClick={validateJson} style={btnStyle(accentColor, false)}>
          🔍 校验
        </button>
        <button onClick={loadSample} style={btnStyle(accentColor, false)}>
          📋 示例
        </button>
        <button onClick={clearAll} style={btnStyle('#64748b', false)}>
          🗑️ 清空
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', color: '#94a3b8' }}>缩进</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e8f0',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <option value={2}>2 空格</option>
            <option value={4}>4 空格</option>
            <option value={8}>Tab</option>
          </select>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            fontSize: '14px',
            marginBottom: '16px',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {error}
        </div>
      )}

      {/* 编辑器区域 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        {/* 输入 */}
        <div style={editorContainerStyle}>
          <div style={editorHeaderStyle}>
            <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>输入</span>
            {inputStats && (
              <span
                style={{
                  fontSize: '12px',
                  color: inputStats.valid ? '#34d399' : '#fca5a5',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: inputStats.valid
                    ? 'rgba(52, 211, 153, 0.1)'
                    : 'rgba(252, 165, 165, 0.1)',
                }}
              >
                {inputStats.valid ? '✓ 有效' : '✗ 无效'} · {inputStats.size} 字符
              </span>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='在此粘贴你的 JSON...'
            spellCheck={false}
            style={textareaStyle}
          />
        </div>

        {/* 输出 */}
        <div style={editorContainerStyle}>
          <div style={editorHeaderStyle}>
            <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>输出</span>
            {output && (
              <button
                onClick={copyOutput}
                style={{
                  padding: '2px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${accentColor}40`,
                  background: 'transparent',
                  color: accentColor,
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {copied ? '✓ 已复制' : '复制'}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="格式化结果将显示在这里..."
            spellCheck={false}
            style={{
              ...textareaStyle,
              color: '#34d399',
              cursor: 'default',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function btnStyle(color: string, primary: boolean): React.CSSProperties {
  return {
    padding: '8px 18px',
    borderRadius: '10px',
    border: primary ? 'none' : `1px solid ${color}30`,
    background: primary ? `linear-gradient(135deg, ${color}, ${color}cc)` : 'transparent',
    color: primary ? 'white' : color,
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };
}

const editorContainerStyle: React.CSSProperties = {
  borderRadius: '14px',
  overflow: 'hidden',
  background: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid rgba(255,255,255,0.06)',
  display: 'flex',
  flexDirection: 'column',
};

const editorHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 16px',
  background: 'rgba(255,255,255,0.02)',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '400px',
  padding: '16px',
  border: 'none',
  background: 'transparent',
  color: '#e2e8f0',
  fontSize: '14px',
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  lineHeight: 1.6,
  resize: 'vertical',
  outline: 'none',
};
