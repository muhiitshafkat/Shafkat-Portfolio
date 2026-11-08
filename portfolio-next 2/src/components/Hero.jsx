'use client';

import { useRef, useState } from 'react';
import { ORBIT_CHIPS, PROFILE, TICKER } from '../data';
import { PHOTO } from '../photo';
import { clamp } from '../util';

function Words({ text, start = 0, cls = '' }) {
  return text.split(' ').map((w, k) => (
    <span className="w" key={k}>
      <span className={'wi ' + cls} style={{ '--i': start + k }}>
        {w}
        {' '}
      </span>
    </span>
  ));
}

export function Hero() {
  const stage = useRef(null);
  const hero = useRef(null);
  const [ring, setRing] = useState(100);
  const [xy, setXy] = useState('0 / 0');
  const drag = useRef(null);

  const onStageMove = (e) => {
    const b = stage.current.getBoundingClientRect();
    const px = (e.clientX - b.left) / b.width - 0.5;
    const py = (e.clientY - b.top) / b.height - 0.5;
    stage.current.style.setProperty('--ry', (px * 18).toFixed(1) + 'deg');
    stage.current.style.setProperty('--rx', (-py * 18).toFixed(1) + 'deg');
    setXy(Math.round(px * 1000) + ' / ' + Math.round(py * 1000));
  };
  const onStageLeave = () => {
    stage.current.style.setProperty('--ry', '0deg');
    stage.current.style.setProperty('--rx', '0deg');
  };
  const onHeroMove = (e) => {
    const r = hero.current.getBoundingClientRect();
    hero.current.style.setProperty('--mx', e.clientX - r.left + 'px');
    hero.current.style.setProperty('--my', e.clientY - r.top + 'px');
  };

  const scrubDown = (e) => {
    drag.current = { x: e.clientX, v: ring };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const scrubMove = (e) => {
    if (drag.current) setRing(clamp(Math.round(drag.current.v + (e.clientX - drag.current.x) * 0.5), 60, 130));
  };
  const scrubUp = () => {
    drag.current = null;
  };
  const scrubKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      setRing((v) => clamp(v + 5, 60, 130));
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      setRing((v) => clamp(v - 5, 60, 130));
      e.preventDefault();
    }
  };

  return (
    <section className="hero" ref={hero} onPointerMove={onHeroMove}>
      <div className="wrap hero-grid">
        <div>
          <div className="kicker mono fu" style={{ '--d': '0s' }}>
            <span className="live" aria-hidden="true" />
            {PROFILE.role} · open to new projects
          </div>
          <h1 aria-label="Hi, I'm Shafkat H Muhit. I design products people enjoy using.">
            <Words text="Hi, I'm" start={0} />
            <Words text={PROFILE.name + '.'} start={2} cls="acc" />
            <Words text="I design products people enjoy using." start={6} />
          </h1>
          <p className="lead fu" style={{ '--d': '.55s' }}>
            UI/UX designer with 5+ years of experience creating user-focused interfaces for web and mobile, from SaaS
            products for Canadian and US teams to government platforms in Bangladesh.
          </p>
          <div className="cta fu" style={{ '--d': '.7s' }}>
            <a className="btn pri mag" href="#work" data-cursor="Open work">
              See my work ↗
            </a>
            <a className="btn mag" href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="WhatsApp">
              Message on WhatsApp
            </a>
          </div>
        </div>

        <div
          className="stage fu"
          style={{ '--d': '.3s', '--ring': ring / 100 }}
          ref={stage}
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
        >
          <div className="grid-bg" />
          <div className="orbit" />
          <div className="orbit2" aria-hidden="true">
            {ORBIT_CHIPS.map((c, k) => (
              <div className="oc" key={c} style={{ '--a': (360 / ORBIT_CHIPS.length) * k + 'deg' }}>
                <span>{c}</span>
              </div>
            ))}
          </div>
          <div className="portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Portrait of Shafkat H Muhit" src={PHOTO} width="720" height="720" />
          </div>
          <div className="tag">Figma · expert</div>
          <div className="inspect" aria-label="Inspector">
            <h3>Inspector</h3>
            <div className="row">
              <span>Ring</span>
              <span
                className="scrub"
                tabIndex={0}
                role="slider"
                aria-valuemin={60}
                aria-valuemax={130}
                aria-valuenow={ring}
                aria-label="Orbit ring size, drag sideways to change"
                data-cursor="Drag ↔"
                onPointerDown={scrubDown}
                onPointerMove={scrubMove}
                onPointerUp={scrubUp}
                onPointerCancel={scrubUp}
                onKeyDown={scrubKey}
              >
                {ring}%
              </span>
            </div>
            <div className="row">
              <span>X / Y</span>
              <span>{xy}</span>
            </div>
            <div className="row">
              <span>
                <i className="swatch" />
                Fill
              </span>
              <span>FF4D8D</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Ticker() {
  const items = [];
  for (let r = 0; r < 4; r++) TICKER.forEach((w) => items.push(w));
  return (
    <div className="ticker" aria-hidden="true">
      <div className="track">
        {items.map((w, k) => (
          <span key={k}>{w}</span>
        ))}
      </div>
    </div>
  );
}
