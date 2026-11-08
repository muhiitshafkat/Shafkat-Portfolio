'use client';

import { useEffect, useRef, useState } from 'react';
import { STEPS } from '../data';
import { clamp } from '../util';

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = (i * 6 * Math.PI) / 180;
  const long = i % 5 === 0;
  const r1 = long ? 78 : 84;
  const r2 = 94;
  return {
    x1: (Math.sin(a) * r1).toFixed(2),
    y1: (-Math.cos(a) * r1).toFixed(2),
    x2: (Math.sin(a) * r2).toFixed(2),
    y2: (-Math.cos(a) * r2).toFixed(2),
    long,
  };
});

export function Process() {
  const ref = useRef(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const on = () => {
      const r = ref.current.getBoundingClientRect();
      setP(clamp(-r.top / (r.height - innerHeight), 0, 1));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  const step = Math.min(3, Math.floor(p * 4));
  const day = Math.max(1, Math.round(p * 14));

  return (
    <section className="process" id="process" ref={ref}>
      <div className="pin">
        <div className="wrap" style={{ width: '100%' }}>
          <div className="kicker mono head-sticky">Process · scroll to turn the dial</div>
          <div className="dial-grid">
            <div className="dial-wrap">
              <svg viewBox="-110 -110 220 220" aria-hidden="true">
                <g transform={'rotate(' + (p * 300).toFixed(1) + ')'}>
                  {TICKS.map((t, i) => (
                    <line
                      key={i}
                      x1={t.x1}
                      y1={t.y1}
                      x2={t.x2}
                      y2={t.y2}
                      stroke={t.long ? 'var(--fg)' : 'var(--muted)'}
                      strokeWidth={t.long ? 1.6 : 0.8}
                    />
                  ))}
                </g>
                <circle r="64" fill="none" stroke="var(--line)" strokeWidth="1" />
                <circle
                  r="64"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 64}
                  strokeDashoffset={2 * Math.PI * 64 * (1 - p)}
                  transform="rotate(-90)"
                />
              </svg>
              <div className="needle" />
              <div className="dial-center">
                <div>
                  <b>{day}</b>
                  <span className="mono">Day</span>
                </div>
              </div>
            </div>
            <div>
              <div className="steps">
                {STEPS.map((s, k) => (
                  <div className={'step' + (k === step ? ' on' : '')} key={s.title}>
                    <span className="mono">{s.days}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                ))}
              </div>
              <div className="dots">
                {STEPS.map((s, k) => (
                  <i key={s.title} className={k <= step ? 'on' : ''} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
