'use client';

import { useEffect, useRef, useState } from 'react';
import { NAV, PROFILE } from '../data';
import { clamp } from '../util';

export function Preloader() {
  return (
    <div className="pre" aria-hidden="true">
      <div className="pre-in">
        <b>
          <span style={{ '--i': 0 }}>S</span>
          <span style={{ '--i': 1 }}>M</span>
          <span style={{ '--i': 2 }} className="sl">/</span>
        </b>
        <i className="pre-bar" />
        <span className="mono">Portfolio 2026</span>
      </div>
    </div>
  );
}

export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  );
}

export function Cursor() {
  const el = useRef(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const node = el.current;
    node.style.display = 'block';
    let mx = 0, my = 0, cx = 0, cy = 0, raf = 0;
    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target.closest ? e.target.closest('[data-cursor]') : null;
      setLabel(t ? t.getAttribute('data-cursor') : '');
    };
    const loop = () => {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      node.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={el} className={'cur' + (label ? ' lbl' : '')} aria-hidden="true">
      <i />
      <span>{label}</span>
    </div>
  );
}

export function ProgressBar() {
  const bar = useRef(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.current.style.transform = 'scaleX(' + (h > 0 ? clamp(scrollY / h, 0, 1) : 0) + ')';
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  return <div id="bar" ref={bar} />;
}

export function Toast() {
  const [msg, setMsg] = useState('');
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t;
    const h = (e) => {
      setMsg(e.detail);
      setOn(true);
      clearTimeout(t);
      t = setTimeout(() => setOn(false), 2000);
    };
    window.addEventListener('app-toast', h);
    return () => {
      window.removeEventListener('app-toast', h);
      clearTimeout(t);
    };
  }, []);
  return (
    <div className={'toast' + (on ? ' on' : '')} role="status">
      {msg}
    </div>
  );
}

export function Header() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => {
      setScrolled(scrollY > 24);
      const y = innerHeight * 0.35;
      let cur = '';
      NAV.forEach(([id]) => {
        const s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top < y) cur = id;
      });
      setActive(cur);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const cur = root.getAttribute('data-theme');
    const isDark = cur ? cur === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  return (
    <header className={'top' + (scrolled ? ' scrolled' : '')}>
      <div className="wrap">
        <a className="brand" href="#top" data-cursor="Top">
          SM<b>/</b>
        </a>
        <nav className="links" aria-label="Sections">
          {NAV.map(([id, label]) => (
            <a key={id} href={'#' + id} className={active === id ? 'on' : ''}>
              {label}
            </a>
          ))}
        </nav>
        <button className="btn icon-btn" onClick={toggleTheme} aria-label="Switch light or dark theme" data-cursor="Theme">
          ◐
        </button>
        <a className="btn pri mag" href="#contact" data-cursor="Say hi">
          Let&apos;s talk ↗
        </a>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="big-mark" aria-hidden="true">
          {PROFILE.name}
        </div>
        <div className="foot-row">
          <span>© 2026 {PROFILE.name}</span>
          <span>Designed in Figma. Built with React.</span>
          <a href="#top" data-cursor="Back to top">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
