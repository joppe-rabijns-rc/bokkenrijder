(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Dates ---------- */
  const parse = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
  const today = (() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); })();
  const daysUntil = (d) => Math.round((d - today) / 864e5);
  const fmt = (d, opts) => new Intl.DateTimeFormat('nl-BE', opts).format(d);
  const fmtLong = (d) => fmt(d, { weekday: 'long', day: 'numeric', month: 'long' });
  const fmtRange = (ev) => {
    const s = parse(ev.date);
    if (!ev.end) return fmtLong(s);
    const e = parse(ev.end);
    return `${fmt(s, { weekday: 'short', day: 'numeric' })} – ${fmt(e, { weekday: 'short', day: 'numeric', month: 'long' })}`;
  };

  /* ---------- Small stuff ---------- */
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  const header = $('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // The goat in the logo hops when clicked. Rare action → can afford delight.
  $$('.brand').forEach((b) => b.addEventListener('click', () => {
    const img = $('img', b);
    if (!img || reduceMotion) return;
    img.animate([
      { transform: 'translateY(0) rotate(0)' },
      { transform: 'translateY(-9px) rotate(-14deg)', offset: 0.4 },
      { transform: 'translateY(0) rotate(4deg)', offset: 0.75 },
      { transform: 'translateY(0) rotate(0)' },
    ], { duration: 520, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  }));

  /* ---------- Spinning stickers ----------
     Text is fitted exactly to the circle (textLength) so it never overlaps itself.
     Spin runs via WAAPI so we can change speed without the rotation jumping:
     hover eases it up, a click gives it a whirl that settles back down. */
  let stickerId = 0;
  function initSticker(el) {
    const ring = el.dataset.ring || '';
    const id = `ring-${++stickerId}`;
    const r = 44, c = 2 * Math.PI * r;
    el.insertAdjacentHTML('afterbegin',
      `<svg class="sticker__ring" viewBox="0 0 116 116" aria-hidden="true"><defs><path id="${id}" d="M58,58 m-${r},0 a${r},${r} 0 1,1 ${2 * r},0 a${r},${r} 0 1,1 -${2 * r},0"/></defs>` +
      `<text textLength="${c.toFixed(1)}" lengthAdjust="spacing"><textPath href="#${id}">${esc(ring)}</textPath></text></svg>`);
    if (reduceMotion) return;
    const svg = $('.sticker__ring', el);
    const spin = svg.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 20000, iterations: Infinity });
    let rate = 1, target = 1, raf = 0;
    const tick = () => {
      rate += (target - rate) * 0.08;
      spin.updatePlaybackRate(rate);
      if (Math.abs(target - rate) > 0.01) raf = requestAnimationFrame(tick); else { spin.updatePlaybackRate(target); raf = 0; }
    };
    const go = (t) => { target = t; if (!raf) raf = requestAnimationFrame(tick); };
    if (finePointer) {
      el.addEventListener('pointerenter', () => go(4));
      el.addEventListener('pointerleave', () => go(1));
    }
    el.addEventListener('click', () => {
      rate = 22; go(el.matches(':hover') && finePointer ? 4 : 1);
      el.animate([
        { scale: '1' }, { scale: '0.92', offset: 0.25 }, { scale: '1.04', offset: 0.6 }, { scale: '1' },
      ], { duration: 450, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    });
  }
  const initStickers = (root = document) => $$('.sticker[data-ring]:not([data-ready])', root).forEach((el) => { el.dataset.ready = ''; initSticker(el); });

  /* ---------- FAQ ---------- */
  $$('.qa').forEach((qa) => {
    const summary = $('summary', qa);
    let closeTimer;
    summary.addEventListener('click', (ev) => {
      ev.preventDefault();
      clearTimeout(closeTimer);
      if (qa.classList.contains('is-open')) {
        qa.classList.remove('is-open');
        closeTimer = setTimeout(() => { qa.open = false; }, 280);
      } else {
        qa.open = true;
        requestAnimationFrame(() => requestAnimationFrame(() => qa.classList.add('is-open')));
      }
    });
    qa.addEventListener('toggle', () => { if (qa.open) qa.classList.add('is-open'); });
  });

  /* ---------- Structured data (JSON-LD) ---------- */
  const addJsonLd = (data) => {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(data);
    document.head.append(el);
  };

  /* ---------- Agenda ---------- */
  const events = (window.EVENTS || [])
    .filter((e) => daysUntil(parse(e.end || e.date)) >= 0)
    .sort((a, b) => parse(a.date) - parse(b.date));

  if (events.length && $('[data-next]')) {
    addJsonLd({
      '@context': 'https://schema.org',
      '@graph': events.map((ev) => ({
        '@type': 'Event',
        name: `Het Bokkenrijdertje op ${ev.title}`,
        startDate: ev.date,
        endDate: ev.end || ev.date,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        description: ev.note || `Ambachtelijke bokkenpootjes uit de bokmobiel, op ${ev.title} in ${ev.town}.`,
        image: new URL('img/og.jpg', location.href).href,
        location: {
          '@type': 'Place',
          name: ev.place || ev.title,
          address: { '@type': 'PostalAddress', addressLocality: ev.town, addressCountry: 'BE' },
        },
        organizer: { '@type': 'Organization', name: 'Het Bokkenrijdertje', url: new URL('./', location.href).href },
      })),
    });
  }

  const mapsUrl = (ev) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([ev.title, ev.place, ev.town].filter(Boolean).join(', '))}`;
  const whereText = (ev) => [ev.place, ev.town].filter(Boolean).join(', ');

  function icsFor(ev) {
    const pad = (n) => String(n).padStart(2, '0');
    const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const start = parse(ev.date);
    const last = parse(ev.end || ev.date);
    const after = new Date(last); after.setDate(after.getDate() + 1);
    const m = (ev.time || '').match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/);
    const when = m && !ev.end
      ? `DTSTART:${ymd(start)}T${pad(m[1])}${m[2]}00\r\nDTEND:${ymd(start)}T${pad(m[3])}${m[4]}00`
      : `DTSTART;VALUE=DATE:${ymd(start)}\r\nDTEND;VALUE=DATE:${ymd(after)}`;
    const clean = (s) => String(s || '').replace(/[,;\\]/g, (c) => '\\' + c);
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Het Bokkenrijdertje//NL',
      'BEGIN:VEVENT', `UID:${ev.date}-${ev.town}@hetbokkenrijdertje`, `DTSTAMP:${ymd(new Date())}T000000Z`, when,
      `SUMMARY:${clean('Het Bokkenrijdertje @ ' + ev.title)}`, `LOCATION:${clean(whereText(ev))}`,
      `DESCRIPTION:${clean('Bokkenpootjes halen bij de bokmobiel! ' + (ev.note || ''))}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
  }
  function downloadIcs(ev) {
    const url = URL.createObjectURL(new Blob([icsFor(ev)], { type: 'text/calendar' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `bokkenrijdertje-${ev.date}.ics` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Confirm "Zet in agenda": the download itself is invisible, so the button says it worked.
  const checkSvg = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 9.5l3.2 3.2L14 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function confirmAdded(btn, label) {
    if (btn.dataset.busy) return;
    btn.dataset.busy = '1';
    const before = btn.innerHTML;
    const swap = (html) => {
      btn.classList.add('is-swapping');
      setTimeout(() => { btn.innerHTML = html; btn.classList.remove('is-swapping'); }, reduceMotion ? 0 : 120);
    };
    swap(label ? `${checkSvg}<span>${label}</span>` : checkSvg);
    btn.classList.add('is-done');
    setTimeout(() => { swap(before); btn.classList.remove('is-done'); delete btn.dataset.busy; }, 2400);
  }

  const nextEl = $('[data-next]');
  if (nextEl) {
    const [next, ...rest] = events;
    if (next) {
      const d = parse(next.date);
      const n = daysUntil(d);
      const ongoing = n < 0;
      $('[data-next-date]').textContent = fmtRange(next);
      $('[data-next-title]').textContent = next.title;
      $('[data-next-where]').textContent = [whereText(next), next.time].filter(Boolean).join(' · ');
      if (next.note) { const note = $('[data-next-note]'); note.textContent = next.note; note.hidden = false; }
      const route = $('[data-next-route]');
      route.href = next.link || mapsUrl(next);
      $('[data-next-ics]').addEventListener('click', (e) => { downloadIcs(next); confirmAdded(e.currentTarget, 'Staat erin'); });
      const label = ongoing || n === 0 ? 'Vandaag!' : n === 1 ? 'Morgen!' : `nog<b>${n}</b>dagen`;
      $('[data-countdown]').innerHTML = label;
      $('.sticker--next').setAttribute('aria-label', ongoing || n === 0 ? 'Vandaag' : n === 1 ? 'Morgen' : `Nog ${n} dagen`);
      nextEl.hidden = false;

      const chip = $('[data-next-chip]');
      if (chip) {
        $('[data-next-chip-text]', chip).innerHTML = `Volgende stop: <b>${esc(fmt(d, { weekday: 'short', day: 'numeric', month: 'short' }))} · ${esc(next.town)}</b>`;
        chip.hidden = false;
      }
    }

    const list = $('[data-upcoming]');
    list.innerHTML = rest.map((ev, i) => {
      const d = parse(ev.date);
      return `<li class="ev" style="--i:${i}">
        <div class="ev__date"><b>${d.getDate()}</b><span>${esc(fmt(d, { month: 'short' }).replace('.', ''))}</span></div>
        <div class="ev__body">
          <h4>${esc(ev.title)}</h4>
          <p>${esc([ev.end ? fmtRange(ev) : fmt(d, { weekday: 'long' }), whereText(ev), ev.time].filter(Boolean).join(' · '))}</p>
        </div>
        <div class="ev__actions">
          <button class="ev__btn" type="button" data-ics="${i}" aria-label="Zet ${esc(ev.title)} in je agenda" title="Zet in agenda">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2.5" y="3.5" width="13" height="12" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M2.5 7.5h13M6 2v3M12 2v3M9 9.5v4M7 11.5h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
          <a class="ev__btn ev__btn--text" href="${esc(ev.link || mapsUrl(ev))}" target="_blank" rel="noopener">Meer info</a>
        </div>
      </li>`;
    }).join('');
    $$('[data-ics]', list).forEach((b) => b.addEventListener('click', () => { downloadIcs(rest[+b.dataset.ics]); confirmAdded(b); }));
    if (!rest.length) $('[data-upcoming-empty]').hidden = false;
    if (!next) {
      $('[data-upcoming-empty]').hidden = false;
      $('.upcoming__title').textContent = 'Geen evenementen gepland';
    }
  }

  /* ---------- Blog ----------
     Overview lives on the homepage; each post opens on blog.html?post=<slug>. */
  const posts = (window.POSTS || []).slice().sort((a, b) => parse(b.date) - parse(a.date));
  const arrow = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const postUrl = (p) => `blog.html?post=${encodeURIComponent(p.slug)}`;
  const postDate = (p) => `<time datetime="${esc(p.date)}">${esc(fmt(parse(p.date), { day: 'numeric', month: 'long', year: 'numeric' }))}</time>`;

  const featured = (p) => `
    <a class="post-feature" href="${postUrl(p)}">
      <div class="post-feature__img"><img src="${esc(p.cover)}" alt="" loading="lazy"></div>
      <div class="post-feature__text">
        <div class="post-meta"><span class="post-meta__tag">${esc(p.tag)}</span>${postDate(p)}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.excerpt)}</p>
        <span class="link-arrow">Lees verder ${arrow}</span>
      </div>
    </a>`;
  const rows = (list) => list.length ? `<ul class="post-list">${list.map((p) => `
    <li><a class="post-row" href="${postUrl(p)}">
      ${postDate(p)}
      <span class="post-row__title">${esc(p.title)}</span>
      <span class="post-row__tag">${esc(p.tag)}</span>
      ${arrow}
    </a></li>`).join('')}</ul>` : '';

  const blogEl = $('[data-posts]');
  if (blogEl) {
    blogEl.innerHTML = posts.length ? featured(posts[0]) + rows(posts.slice(1)) : '<p>Nog geen berichten.</p>';
  }

  const article = $('[data-article]');
  if (article) {
    const slug = new URLSearchParams(location.search).get('post');
    const p = posts.find((x) => x.slug === slug);
    if (!p) { location.replace('index.html#blog'); return; }
    document.title = `${p.title} — Het Bokkenrijdertje`;
    const setMeta = (sel, val) => { const m = document.querySelector(sel); if (m) m.setAttribute('content', val); };
    setMeta('meta[name="description"]', p.excerpt);
    setMeta('meta[property="og:title"]', p.title);
    setMeta('meta[property="og:description"]', p.excerpt);
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      datePublished: p.date,
      image: new URL(p.cover, location.href).href,
      mainEntityOfPage: location.href,
      inLanguage: 'nl-BE',
      author: { '@type': 'Person', name: 'Ferre Vandael' },
      publisher: { '@type': 'Organization', name: 'Het Bokkenrijdertje', logo: { '@type': 'ImageObject', url: new URL('img/apple-touch-icon.png', location.href).href } },
    });
    const more = posts.filter((x) => x !== p);
    article.innerHTML = `
      <a class="back" href="index.html#blog"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 8H3m0 0l4-4M3 8l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Alle berichten</a>
      <header class="article__head intro">
        <div class="post-meta"><span class="post-meta__tag">${esc(p.tag)}</span>${postDate(p)}</div>
        <h1>${esc(p.title)}</h1>
        <p class="lead">${esc(p.excerpt)}</p>
      </header>
      <div class="article__cover"><img src="${esc(p.cover)}" alt=""></div>
      <div class="prose">${p.body}</div>
      <div class="article__sign">
        <img src="img/ferre.webp" alt="">
        <div><b>Ferre Vandael</b><small>Het Bokkenrijdertje</small></div>
      </div>
      ${more.length ? `<div class="article__more"><h2>Meer berichten</h2>${rows(more)}</div>` : ''}`;
  }

  initStickers();
})();
