'use client';

import { useEffect, useRef, useState } from 'react';
import { PHOTO } from '../photo';
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
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState('');
  const nav = useRef(null);

  // The glowing pill behind the nav links glides to whichever link is hovered, or to the section you are in.
  useEffect(() => {
    const place = () => {
      const n = nav.current;
      if (!n) return;
      const t = hover || active;
      const a = t ? n.querySelector('[data-id="' + t + '"]') : null;
      if (a) {
        n.style.setProperty('--x', a.offsetLeft + 'px');
        n.style.setProperty('--w', a.offsetWidth + 'px');
        n.style.setProperty('--o', '1');
      } else {
        n.style.setProperty('--o', '0');
      }
    };
    place();
    window.addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    return () => window.removeEventListener('resize', place);
  }, [hover, active]);

  // After choosing a section, its heading lights up once it has scrolled into view.
  const flash = (id) => {
    setOpen(false);
    const h = document.querySelector('#' + id + ' h2, #' + id + ' .kicker');
    if (!h) return;
    setTimeout(() => {
      h.classList.remove('flash');
      void h.offsetWidth;
      h.classList.add('flash');
    }, 500);
    setTimeout(() => h.classList.remove('flash'), 2600);
  };

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

  // Phone menu: lock page scroll while open, close with Escape or when the screen grows to desktop size.
  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = open ? 'hidden' : '';
    const key = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const size = () => {
      if (innerWidth > 980) setOpen(false);
    };
    window.addEventListener('keydown', key);
    window.addEventListener('resize', size);
    return () => {
      root.style.overflow = '';
      window.removeEventListener('keydown', key);
      window.removeEventListener('resize', size);
    };
  }, [open]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const cur = root.getAttribute('data-theme');
    const isDark = cur ? cur === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  return (
    <>
      <header className={'top' + (scrolled ? ' scrolled' : '')}>
        <div className="wrap">
          <a className="brand" href="#top" data-cursor="Top" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bav" src={PHOTO} alt="" width="34" height="34" />
            <span className="nm">{PROFILE.name}</span>
          </a>
          <nav className="links" aria-label="Sections" ref={nav} onMouseLeave={() => setHover('')}>
            <span className="nav-ind" aria-hidden="true" />
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={'#' + id}
                data-id={id}
                className={active === id ? 'on' : ''}
                onMouseEnter={() => setHover(id)}
                onFocus={() => setHover(id)}
                onBlur={() => setHover('')}
                onClick={() => flash(id)}
              >
                {label}
              </a>
            ))}
          </nav>
          <button className="btn icon-btn" onClick={toggleTheme} aria-label="Switch light or dark theme" data-cursor="Theme">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 1.6a6.4 6.4 0 0 1 0 12.8z" fill="currentColor" />
            </svg>
          </button>
          <a className="btn pri mag hd-cta" href="#contact" data-cursor="Say hi" onClick={() => setOpen(false)}>
            Let&apos;s talk ↗
          </a>
          <button
            className="btn icon-btn menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={'burger' + (open ? ' x' : '')} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div id="mobile-nav" className={'mnav' + (open ? ' open' : '')} aria-hidden={!open}>
        <nav aria-label="Mobile sections">
          {NAV.map(([id, label], k) => (
            <a key={id} className="l" href={'#' + id} style={{ '--i': k }} tabIndex={open ? 0 : -1} onClick={() => flash(id)}>
              {label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <div className="mnav-foot" style={{ '--i': NAV.length }}>
          <a className="btn pri" href={'tel:' + PROFILE.phoneTel} tabIndex={open ? 0 : -1}>
            Call {PROFILE.phoneLocal}
          </a>
          <a className="btn" href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="big-wrap" aria-hidden="true">
          <div className="big-mark">{PROFILE.name}</div>
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
