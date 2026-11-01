'use client';

import { useEffect, useState } from 'react';
import { PROFILE } from '../data';
import { copyText, glow, toast } from '../util';
import { makeBrief } from './Pricing';

export function Contact({ picked }) {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [msg, setMsg] = useState('');
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Dhaka',
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const body = () =>
    'Hi Shafkat,\n\n' +
    (msg.trim() || '') +
    '\n\n' +
    (picked.length ? makeBrief(picked) + '\n\n' : '') +
    '— ' +
    (name.trim() || 'Your name') +
    (mail.trim() ? ' (' + mail.trim() + ')' : '');

  const guard = (e) => {
    if (!msg.trim()) {
      e.preventDefault();
      toast('Write a short message first');
    }
  };

  const waHref = PROFILE.whatsapp + '?text=' + encodeURIComponent(body());
  const mailHref =
    'mailto:' + PROFILE.email + '?subject=' + encodeURIComponent('Project enquiry') + '&body=' + encodeURIComponent(body());

  return (
    <section id="contact" className="contact" style={{ paddingBottom: 40 }}>
      <div className="wrap">
        <div className="kicker mono">Contact</div>
        <h2 className="rv big-h">
          Got a product <em>in mind?</em>
        </h2>

        <div className="acts">
          <a className="act mag rv" href={'tel:' + PROFILE.phoneTel} onPointerMove={glow} data-cursor="Call">
            <span className="mono">Call</span>
            <b>{PROFILE.phoneDisplay}</b>
            <i>↗</i>
          </a>
          <a
            className="act mag rv"
            style={{ '--d': '.08s' }}
            href={PROFILE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onPointerMove={glow}
            data-cursor="WhatsApp"
          >
            <span className="mono">WhatsApp</span>
            <b>{PROFILE.phoneLocal}</b>
            <i>↗</i>
          </a>
          <a
            className="act mag rv"
            style={{ '--d': '.16s' }}
            href={'mailto:' + PROFILE.email}
            onPointerMove={glow}
            data-cursor="Email"
          >
            <span className="mono">Email</span>
            <b className="sm">{PROFILE.email}</b>
            <i>↗</i>
          </a>
        </div>
        <div className="copyrow">
          <button className="btn" type="button" onClick={() => copyText(PROFILE.phoneDisplay, 'Number copied')}>
            Copy number
          </button>
          <button className="btn" type="button" onClick={() => copyText(PROFILE.email, 'Email copied')}>
            Copy email
          </button>
        </div>

        <div className="contact-grid">
          <form onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="field">
              <label htmlFor="fn">Your name</label>
              <input id="fn" autoComplete="name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="fe">Your email</label>
              <input id="fe" type="email" autoComplete="email" placeholder="jane@company.com" value={mail} onChange={(e) => setMail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="fm">Message</label>
              <textarea
                id="fm"
                maxLength={600}
                placeholder="What are you building, and by when?"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <div className="count">{msg.length} / 600</div>
            </div>
            <div className="send">
              <a className="btn pri mag" href={waHref} target="_blank" rel="noopener noreferrer" onClick={guard}>
                Send on WhatsApp
              </a>
              <a className="btn mag" href={mailHref} onClick={guard}>
                Send by email
              </a>
              <button
                className="btn"
                type="button"
                onClick={() => (msg.trim() ? copyText(body(), 'Message copied') : toast('Write a short message first'))}
              >
                Copy message
              </button>
            </div>
            {picked.length > 0 && <p className="note">Your project brief from the pricing section is added to the message.</p>}
          </form>

          <div className="side">
            <div className="box" onPointerMove={glow}>
              <span className="mono">Dhaka time</span>
              <b>{time}</b>
              <span className="note" style={{ display: 'block', marginTop: 6 }}>
                {PROFILE.location} · remote worldwide
              </span>
            </div>
            <div className="box" onPointerMove={glow}>
              <span className="mono">Elsewhere</span>
              <div className="links">
                <a href={PROFILE.behance} target="_blank" rel="noopener noreferrer" data-cursor="Behance">
                  Behance <span>↗</span>
                </a>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="LinkedIn">
                  LinkedIn <span>↗</span>
                </a>
                <a href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer" data-cursor="WhatsApp">
                  WhatsApp <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
