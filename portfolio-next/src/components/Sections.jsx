'use client';

import { useEffect, useRef, useState } from 'react';
import { EDUCATION, EXPERIENCE, FILTERS, PROJECTS, QUOTES, SERVICES, SKILL_ROW } from '../data';
import { clamp, glow } from '../util';

function Count({ to, suffix = '' }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);

  useEffect(() => {
    let raf = 0;
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t) => {
          const p = clamp((t - t0) / 1000, 0, 1);
          setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    const failsafe = setTimeout(() => setV(to), 3500);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
    };
  }, [to]);

  return (
    <b ref={ref}>
      {v}
      {v === to ? suffix : ''}
    </b>
  );
}

export function About() {
  return (
    <section id="about" className="about">
      <div className="wrap about-grid">
        <div>
          <div className="kicker mono">About</div>
          <h2 className="rv">A UI/UX designer from Dhaka, working with teams worldwide.</h2>
        </div>
        <div className="rv" style={{ '--d': '.1s' }}>
          <p>
            I design web and mobile interfaces that are clear, good looking and easy for developers to build. I mix
            creativity, problem solving and AI-assisted workflows to move quickly without lowering the bar.
          </p>
          <p className="sm">
            I work remotely from Uttara, Dhaka with clients in Bangladesh, Canada and the US. My daily tools are Figma,
            Adobe Illustrator and Adobe Photoshop, and I stay close to developers so what I design is what ships.
          </p>
          <div className="facts">
            <div>
              <Count to={4} suffix="+" />
              <span className="mono">Years in UI/UX</span>
            </div>
            <div>
              <Count to={3} />
              <span className="mono">Markets</span>
            </div>
            <div>
              <Count to={11} />
              <span className="mono">Projects shown</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const tl = useRef(null);

  useEffect(() => {
    const on = () => {
      const node = tl.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const p = clamp((innerHeight * 0.65 - r.top) / r.height, 0, 1);
      node.style.setProperty('--p', p.toFixed(3));
      node.querySelectorAll('.xp-row').forEach((row) => {
        row.classList.toggle('lit', row.getBoundingClientRect().top < innerHeight * 0.68);
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  return (
    <section id="experience" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="kicker mono">Experience</div>
        <h2 className="rv" style={{ marginBottom: 40 }}>
          Where I&apos;ve worked.
        </h2>
        <div className="tl" ref={tl}>
          <div className="tl-fill" />
          {EXPERIENCE.map((x) => (
            <div className={'xp-row rv' + (x.now ? ' now' : '')} key={x.company}>
              <span className="mono">{x.when}</span>
              <h3>
                {x.company}
                <small>{x.meta}</small>
              </h3>
              <p>{x.text}</p>
            </div>
          ))}
        </div>
        <div className="edu">
          {EDUCATION.map((e) => (
            <div key={e.title} className="rv" onPointerMove={glow}>
              <span className="mono">{e.label}</span>
              <b>{e.title}</b>
              {e.where}
            </div>
          ))}
        </div>
        <div className="skills" aria-label="Skills and tools">
          <div className="skills-track">
            {[...SKILL_ROW, ...SKILL_ROW, ...SKILL_ROW].map((s, k) => (
              <span key={k} className={k % SKILL_ROW.length < 3 ? 'k' : ''}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Work() {
  const [filter, setFilter] = useState('All');
  const preview = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const [pv, setPv] = useState(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    const loop = () => {
      if (preview.current) {
        preview.current.style.transform =
          'translate(' + (pos.current.x + 24) + 'px,' + (pos.current.y - 80) + 'px)';
      }
      raf.current = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const grad = ['g1', 'g2', 'g3', 'g4'];

  return (
    <section id="work" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="kicker mono">Selected work</div>
        <h2 className="rv" style={{ marginBottom: 26 }}>
          Selected projects.
        </h2>
        <div className="filters rv" role="tablist" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={'chip-f' + (filter === f ? ' on' : '')}
              onClick={() => setFilter(f)}
              data-cursor="Filter"
            >
              {f}
              <span>{f === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.cat === f).length}</span>
            </button>
          ))}
        </div>
        <div className="work-list">
          {PROJECTS.map((p, i) => {
            const out = filter !== 'All' && p.cat !== filter;
            return (
              <div className={'wr' + (out ? ' out' : '')} key={p.name} aria-hidden={out}>
                <div>
                  <a
                    className="work-row"
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={out ? -1 : 0}
                    data-cursor="Open project"
                    onMouseEnter={() => setPv({ ...p, g: grad[i % 4] })}
                    onMouseLeave={() => setPv(null)}
                  >
                    <div
                      className={'th ' + grad[i % 4]}
                      style={p.image ? { backgroundImage: 'url(' + p.image + ')' } : undefined}
                    />
                    <div>
                      <h3>{p.name}</h3>
                      <p>{p.desc}</p>
                    </div>
                    <span className="mono yr">{p.host}</span>
                    <span className="arrow">↗</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        <p className="note">Each project opens in a new tab.</p>
      </div>
      <div
        ref={preview}
        className={'preview ' + (pv ? pv.g + ' on' : '')}
        style={pv && pv.image ? { backgroundImage: 'url(' + pv.image + ')', backgroundSize: 'cover' } : undefined}
        aria-hidden="true"
      >
        {pv ? pv.name : ''}
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="kicker mono">Services</div>
        <h2 className="rv" style={{ marginBottom: 34 }}>
          What I can take off your plate.
        </h2>
        <div className="svc">
          {SERVICES.map((s, k) => (
            <details key={s.title} open={k === 0} className="rv" style={{ '--d': k * 0.08 + 's' }} onPointerMove={glow}>
              <summary>{s.title}</summary>
              <p>{s.text}</p>
              <ul>
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const rail = useRef(null);
  const st = useRef({ down: false, x: 0, l: 0 });

  useEffect(() => {
    const move = (e) => {
      if (!st.current.down) return;
      const dx = e.clientX - st.current.x;
      if (Math.abs(dx) > 4) rail.current.classList.add('drag');
      rail.current.scrollLeft = st.current.l - dx;
    };
    const up = () => {
      if (st.current.down) {
        st.current.down = false;
        rail.current.classList.remove('drag');
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  const avatar = ['g1', 'g2', 'g3', 'g4'];

  return (
    <section id="kind-words" style={{ paddingTop: 'clamp(40px,6vw,80px)' }}>
      <div className="wrap">
        <div className="kicker mono">Kind words</div>
        <h2 className="rv" style={{ marginBottom: 26 }}>
          What clients say.
        </h2>
      </div>
      <div className="wrap" style={{ maxWidth: 'none' }}>
        <div
          className="rail"
          ref={rail}
          data-cursor="Drag ↔"
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse') return;
            st.current = { down: true, x: e.clientX, l: rail.current.scrollLeft };
          }}
        >
          {QUOTES.map((q, k) => (
            <article className="quote" key={k} onPointerMove={glow}>
              <p>&ldquo;{q.text}&rdquo;</p>
              <div className="who">
                <div className={'av ' + avatar[k % 4]}>DC</div>
                <div>
                  {q.who}
                  <span>{q.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
