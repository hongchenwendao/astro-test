import React from 'react';
import type { SisterSite } from '@saas/core';

interface FooterProps {
  siteName: string;
  sisterSites: SisterSite[];
  accentColor?: string;
}

export function Footer({
  siteName,
  sisterSites,
  accentColor = '#6366f1',
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 24px 32px',
        marginTop: '80px',
      }}
    >
      <div
        style={{ maxWidth: '960px', margin: '0 auto' }}
      >
        {/* Sister Sites — SEO 群链（动态注入 + 静态降级） */}
        <div style={{ marginBottom: '32px' }}>
          <h4
            style={{
              fontSize: '12px',
              letterSpacing: '0.05em',
              color: '#64748b',
              marginBottom: '16px',
              fontWeight: 600,
            }}
          >
            推荐工具
          </h4>
          {/* 
            动态注入占位: Workers 的 HTMLRewriter 会根据 D1 数据替换此 div 内容。
            如果 D1 查询失败或在纯静态环境下，下面的静态链接作为降级内容显示。
          */}
          <div id="dynamic-sister-sites">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              {sisterSites.map((site) => (
                <a
                  key={site.url}
                  href={site.url}
                  target="_blank"
                  rel="noopener"
                  title={site.description}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      accentColor;
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor =
                      'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      '#94a3b8';
                  }}
                >
                  {site.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
            © {currentYear} {siteName}. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a
              href="/privacy"
              style={{
                fontSize: '13px',
                color: '#475569',
                textDecoration: 'none',
              }}
            >
              隐私政策
            </a>
            <a
              href="/terms"
              style={{
                fontSize: '13px',
                color: '#475569',
                textDecoration: 'none',
              }}
            >
              使用条款
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
