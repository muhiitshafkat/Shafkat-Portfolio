'use client';

import { useRef } from 'react';
import { PRICING } from '../data';
import { copyText, glow, money } from '../util';

export function makeBrief(picked) {
  const lines = ['Project brief'];
  if (!picked.length) lines.push('No services selected yet.');
  let total = 0;
  let days = 0;
  picked.forEach((id) => {
    const s = PRICING.find((x) => x.id === id);
    total += s.price;
    days += s.days;
    lines.push('- ' + s.name + ' (' + money.format(s.price) + ')');
  });
  lines.push('Total from: ' + money.format(total), 'Timeline: ' + (days ? days + ' days' : 'to be discussed'));
  return lines.join('\n');
}

export function Pricing({ picked, setPicked }) {
  const dropRef = useRef(null);
  const suppress = useRef(false);

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const onDown = (e, id) => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const chip = e.currentTarget;
    const sx = e.clientX;
    const sy = e.clientY;
    let ghost = null;
    const inDrop = (x, y) => {
      const r = dropRef.current.getBoundingClientRect();
      return x > r.left && x < r.right && y > r.top && y < r.bottom;
    };
    const move = (ev) => {
      if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) {
        ghost = chip.cloneNode(true);
        ghost.classList.add('ghost');
        document.body.appendChild(ghost);
      }
      if (ghost) {
        ghost.style.left = ev.clientX - 130 + 'px';
        ghost.style.top = ev.clientY - 24 + 'px';
        dropRef.current.classList.toggle('over', inDrop(ev.clientX, ev.clientY));
      }
    };
    const up = (ev) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (ghost) {
        if (inDrop(ev.clientX, ev.clientY)) setPicked((p) => (p.includes(id) ? p : [...p, id]));
        ghost.remove();
        dropRef.current.classList.remove('over');
        suppress.current = true;
        setTimeout(() => {
          suppress.current = false;
        }, 0);
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  let total = 0;
  let days = 0;
  picked.forEach((id) => {
    const s = PRICING.find((x) => x.id === id);
    total += s.price;
    days += s.days;
  });

  return (
    <section id="pricing">
      <div className="wrap">
        <div className="kicker mono">Pricing</div>
        <h2 className="rv" style={{ marginBottom: 12 }}>
          Build your project.
        </h2>
        <p className="intro rv">
          Drag a service into your project, or tap it. The total and timeline update as you go. Prices are examples and
          the final quote comes after we talk.
        </p>
        <div className="build">
          <div className="panel rv" onPointerMove={glow}>
            <h3>Services</h3>
            <div className="tray">
              {PRICING.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={'chip' + (picked.includes(s.id) ? ' used' : '')}
                  data-cursor="Drag or tap"
                  onPointerDown={(e) => onDown(e, s.id)}
                  onClick={() => {
                    if (!suppress.current) toggle(s.id);
                  }}
                >
                  <span>
                    {s.name}
                    <small>{s.desc}</small>
                  </span>
                  <em>{money.format(s.price)}</em>
                </button>
              ))}
            </div>
          </div>
          <div className="panel rv" style={{ '--d': '.1s' }} onPointerMove={glow}>
            <h3>Your project</h3>
            <div className="drop" ref={dropRef}>
              {picked.length === 0 ? (
                <div className="empty">
                  Drop services here.
                  <br />
                  Each one becomes part of your project.
                </div>
              ) : (
                picked.map((id) => {
                  const s = PRICING.find((x) => x.id === id);
                  return (
                    <div className="item" key={id}>
                      <span>{s.name}</span>
                      <span>
                        <span className="mono">{money.format(s.price)}</span>{' '}
                        <button type="button" aria-label={'Remove ' + s.name} onClick={() => toggle(id)}>
                          ×
                        </button>
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="sum">
              <div>
                <span className="mono">Total, from</span>
                <b>{money.format(total)}</b>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="mono">Timeline</span>
                <b style={{ fontSize: 28 }}>{days ? days + ' days' : '–'}</b>
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="btn pri mag"
                type="button"
                onClick={() => copyText(makeBrief(picked), 'Brief copied. Paste it into a message')}
              >
                Copy my project brief
              </button>
              <a className="btn mag" href="#contact">
                Send it to Shafkat ↓
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
