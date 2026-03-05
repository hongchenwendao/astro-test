import React from 'react';
import type { PricingPlan } from '@saas/core';

interface PricingTableProps {
  plans: PricingPlan[];
  accentColor?: string;
}

export function PricingTable({
  plans,
  accentColor = '#6366f1',
}: PricingTableProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${plans.length}, 1fr)`,
        gap: '24px',
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      {plans.map((plan) => (
        <div
          key={plan.name}
          style={{
            background: plan.highlighted
              ? `linear-gradient(135deg, ${accentColor}22, ${accentColor}08)`
              : 'rgba(255,255,255,0.03)',
            border: plan.highlighted
              ? `2px solid ${accentColor}`
              : '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform =
              'translateY(-4px)';
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              `0 20px 40px ${accentColor}15`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'none';
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          }}
        >
          {plan.highlighted && (
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: `linear-gradient(135deg, ${accentColor}, #a78bfa)`,
                color: 'white',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              最受欢迎
            </div>
          )}

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#e2e8f0',
              margin: '0 0 8px',
            }}
          >
            {plan.name}
          </h3>

          <p
            style={{
              fontSize: '14px',
              color: '#94a3b8',
              margin: '0 0 20px',
              lineHeight: 1.5,
            }}
          >
            {plan.description}
          </p>

          <div style={{ margin: '0 0 24px' }}>
            <span
              style={{ fontSize: '40px', fontWeight: 800, color: '#f1f5f9' }}
            >
              {plan.price}
            </span>
            {plan.period && (
              <span style={{ fontSize: '14px', color: '#64748b' }}>
                /{plan.period}
              </span>
            )}
          </div>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 24px',
              flex: 1,
            }}
          >
            {plan.features.map((feature) => (
              <li
                key={feature}
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: accentColor }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>

          <button
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: plan.highlighted
                ? 'none'
                : '1px solid rgba(255,255,255,0.12)',
              background: plan.highlighted
                ? `linear-gradient(135deg, ${accentColor}, #a78bfa)`
                : 'transparent',
              color: plan.highlighted ? 'white' : '#e2e8f0',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!plan.highlighted) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.06)';
              }
            }}
            onMouseLeave={(e) => {
              if (!plan.highlighted) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'transparent';
              }
            }}
          >
            {plan.cta}
          </button>
        </div>
      ))}
    </div>
  );
}
