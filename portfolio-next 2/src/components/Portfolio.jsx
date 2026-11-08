'use client';

import { useEffect, useState } from 'react';
import { Aurora, Cursor, Footer, Header, Preloader, ProgressBar, Toast } from './Chrome';
import { Hero, Ticker } from './Hero';
import { About, Experience, Services, Testimonials, Work } from './Sections';
import { Process } from './Process';
import { Pricing } from './Pricing';
import { Contact } from './Contact';

export default function Portfolio() {
  // Services picked in the pricing builder, shared with the contact form.
  const [picked, setPicked] = useState([]);

  // Scroll reveal: every .rv element eases in once it enters the viewport.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.rv, .wr'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Magnetic buttons: .mag elements lean toward the pointer.
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const cleanups = [];
    document.querySelectorAll('.mag').forEach((el) => {
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
        el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      };
      const leave = () => {
        el.style.transform = '';
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <Preloader />
      <Aurora />
      <Cursor />
      <ProgressBar />
      <Header />
      <main id="top">
        <Hero />
        <Ticker />
        <About />
        <Experience />
        <Work />
        <Services />
        <Process />
        <Testimonials />
        <Pricing picked={picked} setPicked={setPicked} />
        <Contact picked={picked} />
      </main>
      <Footer />
      <Toast />
    </>
  );
}
