import React, { useSyncExternalStore } from 'react';
import { $userStore } from '@clerk/astro/client';

interface UserPlanBadgeProps {
  accentColor?: string;
}

export default function UserPlanBadge({ accentColor = '#f97316' }: UserPlanBadgeProps) {
  const user = useSyncExternalStore($userStore.listen, $userStore.get, $userStore.get);

  // 用户数据尚未加载
  if (user === undefined) {
    return (
      <div style={containerStyle}>
        <div style={{ ...badgeStyle, background: 'rgba(255,255,255,0.03)' }}>
          <span style={{ color: '#64748b', fontSize: '13px' }}>加载中...</span>
        </div>
      </div>
    );
  }

  // 未登录
  if (user === null) {
    return (
      <div style={containerStyle}>
        <div style={{ ...badgeStyle, borderColor: `${accentColor}30` }}>
          <span style={{ fontSize: '14px' }}>🔓</span>
          <span style={{ color: '#94a3b8', fontSize: '13px' }}>
            登录以解锁更多功能
          </span>
        </div>
      </div>
    );
  }

  // 从 Clerk 用户 publicMetadata 中读取套餐信息
  const metadata = user.publicMetadata as {
    plan?: string;
    quota?: { dailyLimit?: number; used?: number };
  };

  const plan = metadata?.plan || 'free';
  const dailyLimit = metadata?.quota?.dailyLimit ?? 10;
  const used = metadata?.quota?.used ?? 0;

  const planLabels: Record<string, { label: string; icon: string; color: string }> = {
    free: { label: '免费版', icon: '⚡', color: '#94a3b8' },
    pro: { label: '专业版', icon: '💎', color: accentColor },
    team: { label: '团队版', icon: '🏢', color: '#a78bfa' },
  };

  const currentPlan = planLabels[plan] || planLabels.free;

  return (
    <div style={containerStyle}>
      <div style={{
        ...badgeStyle,
        borderColor: `${currentPlan.color}30`,
        background: `${currentPlan.color}08`,
      }}>
        <span style={{ fontSize: '14px' }}>{currentPlan.icon}</span>
        <span style={{ color: currentPlan.color, fontSize: '13px', fontWeight: 600 }}>
          {currentPlan.label}
        </span>
        {plan === 'free' && (
          <>
            <span style={dividerStyle}>·</span>
            <span style={{ color: '#64748b', fontSize: '13px' }}>
              今日 {used}/{dailyLimit} 次
            </span>
          </>
        )}
        <span style={dividerStyle}>·</span>
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          👋 {user.firstName || user.username || '用户'}
        </span>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '16px',
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '100px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.02)',
  backdropFilter: 'blur(8px)',
};

const dividerStyle: React.CSSProperties = {
  color: '#334155',
  fontSize: '13px',
};
