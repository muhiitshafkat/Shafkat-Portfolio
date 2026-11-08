export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function toast(msg) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: msg }));
  }
}

export async function copyText(text, ok) {
  try {
    await navigator.clipboard.writeText(text);
    toast(ok);
    return;
  } catch (e) {
    /* fall through to the older method */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const done = document.execCommand('copy');
    document.body.removeChild(ta);
    toast(done ? ok : 'Select the text and copy it manually');
  } catch (e) {
    toast('Select the text and copy it manually');
  }
}

// Moves a soft light inside a card to follow the pointer (reads --gx / --gy in CSS).
export function glow(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--gx', e.clientX - r.left + 'px');
  e.currentTarget.style.setProperty('--gy', e.clientY - r.top + 'px');
}
