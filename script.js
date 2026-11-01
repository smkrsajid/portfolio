/* CREATIVO - Vanilla JavaScript. Works directly from index.html, including file://. */
(() => {
  'use strict';
  const content = window.CREATIVO_CONTENT;
  if (!content) {
    console.error('Creativo: content.js is missing. Keep it beside index.html.');
    return;
  }
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const projects = Array.isArray(content.projects) ? content.projects : [];
  const dialog = $('#project-dialog');
  const media = $('#dialog-media');
  let activeCategory = 'All work';
  let currentProject = -1;
  let lastTrigger = null;
  let draftText = '';
  let toastTimer;
  let heroInView = false;
  let ambientUserPaused = false;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function setText(selector, text) {
    if (typeof text === 'string') $(selector).textContent = text;
  }
  // Never inject editable strings as HTML. Only permit expected URL schemes.
  function externalUrl(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  }
  function assetUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    // Optional asset map used by the single-file distribution.
    if (window.CREATIVO_EMBEDDED_ASSETS && window.CREATIVO_EMBEDDED_ASSETS[value]) return window.CREATIVO_EMBEDDED_ASSETS[value];
    if (value.startsWith('data:image/') || value.startsWith('data:video/') || value.startsWith('data:text/vtt')) return value;
    try {
      const url = new URL(value, document.baseURI);
      return ['http:', 'https:', 'file:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  }
  function validEmail(value) {
    return typeof value === 'string' && value.length <= 254 && /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(value);
  }
  function notify(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
  }

  // ----- Brand and editable copy -----
  const name = String(content.name || 'Creativo');
  $$('[data-brand]').forEach(node => { node.textContent = name.toLowerCase(); });
  $$('[data-brand-title]').forEach(node => { node.textContent = name; });
  $$('.wordmark').forEach(node => node.setAttribute('aria-label', `${name} home`));
  document.title = `${name} - Video editing & motion design`;
  setText('#hero-description', content.heroDescription);
  setText('#about-lead', content.aboutLead);
  setText('#about-body', content.aboutBody);
  setText('#year', String(new Date().getFullYear()));
  (content.tools || []).forEach(tool => $('#tool-list').append(element('span', '', tool)));

  // ----- Social proof placeholders -----
  const proof = content.socialProof || {};
  setText('#proof-intro', proof.intro);
  (Array.isArray(proof.stats) ? proof.stats : []).forEach(item => {
    const card = element('div', 'proof-stat');
    card.append(element('strong', '', item.value || ''), element('span', '', item.label || ''));
    $('#proof-stats')?.append(card);
  });
  const clientItems = Array.isArray(proof.clients) ? proof.clients : [];
  const logoStrip = $('#client-logos');
  if (logoStrip && clientItems.length) {
    // Two identical tracks create a seamless right-to-left marquee.
    // The duplicate is hidden from assistive technology to avoid repeated announcements.
    [false, true].forEach(isDuplicate => {
      const track = element('div', 'logo-track');
      if (isDuplicate) track.setAttribute('aria-hidden', 'true');
      if (!isDuplicate) track.setAttribute('role', 'list');
      clientItems.forEach(item => {
        const label = String(item?.name || '').trim() || 'YOUR LOGO';
        const logo = element('div', `client-logo logo-${item?.style || 'caps'}`);
        if (!isDuplicate) logo.setAttribute('role', 'listitem');
        logo.append(element('span', '', label));
        track.append(logo);
      });
      logoStrip.append(track);
    });
  }
  (Array.isArray(proof.testimonials) ? proof.testimonials : []).forEach((item, index) => {
    const card = element('figure', 'testimonial-card');
    const mark = element('span', 'quote-mark', '\u201c');
    mark.setAttribute('aria-hidden', 'true');
    const quote = element('blockquote', '', item.quote || 'Replace this with a real client testimonial.');
    const caption = element('figcaption');
    caption.append(element('strong', '', item.name || 'Client Name'), element('span', '', item.role || 'Role · Company'));
    const sample = element('span', 'sample-pill', `SAMPLE ${String(index + 1).padStart(2, '0')}`);
    card.append(mark, quote, caption, sample);
    $('#testimonials')?.append(card);
  });

  // ----- Navigation -----
  const menuToggle = $('.menu-toggle');
  const navigation = $('#site-nav');
  function closeMenu() {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
  menuToggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  $$('a', navigation).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); }, { passive: true });
  const syncHeader = () => $('.site-header').classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  // ----- Gallery and accessible filter buttons -----
  const categories = ['All work', ...new Set(projects.map(project => project.category || 'Other'))];
  categories.forEach(category => {
    const button = element('button', 'filter', category);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(category === activeCategory));
    button.addEventListener('click', () => {
      activeCategory = category;
      $$('.filter').forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
      renderProjects();
    });
    $('#project-filters').append(button);
  });
  function visibleProjects() {
    return projects.filter(project => activeCategory === 'All work' || (project.category || 'Other') === activeCategory);
  }
  function renderProjects() {
    const grid = $('#project-grid');
    grid.replaceChildren();
    const filtered = visibleProjects();
    $('#project-count').textContent = `${String(filtered.length).padStart(2, '0')} project${filtered.length === 1 ? '' : 's'}`;
    if (!filtered.length) grid.append(element('p', 'empty-state', 'New work is on its way. Check back soon.'));
    filtered.forEach((project, index) => {
      const card = element('article', 'project-card');
      card.style.animationDelay = `${Math.min(index * 45, 180)}ms`;
      const trigger = element('button', 'project-trigger');
      trigger.type = 'button';
      trigger.setAttribute('aria-label', `View ${project.title}`);
      trigger.setAttribute('aria-haspopup', 'dialog');
      const cover = element('div', 'project-cover');
      const image = element('img');
      const coverSrc = assetUrl(project.cover);
      if (coverSrc) image.src = coverSrc;
      image.alt = project.coverAlt || project.title || 'Project artwork';
      image.loading = 'lazy';
      image.width = 800;
      image.height = 600;
      image.addEventListener('error', () => {
        image.remove();
        cover.append(element('span', 'cover-fallback', project.title || 'Project preview'));
      }, { once: true });
      cover.append(image);
      cover.append(element('span', 'project-index', `${String(projects.indexOf(project) + 1).padStart(2, '0')} / ${project.isDemo ? 'CONCEPT' : 'PROJECT'}`));
      const arrow = element('span', 'project-arrow', '\u2197');
      arrow.setAttribute('aria-hidden', 'true');
      cover.append(arrow);
      const caption = element('div', 'project-caption');
      const labels = element('div');
      labels.append(element('h3', '', project.title), element('p', '', project.type || project.category));
      caption.append(labels, element('span', '', project.year || ''));
      trigger.append(cover, caption);
      trigger.addEventListener('click', () => openProject(projects.indexOf(project), trigger));
      card.append(trigger);
      grid.append(card);
    });
    $('.demo-note').hidden = !projects.some(project => project.isDemo);
  }
  renderProjects();

  // ----- Video support: local MP4/WebM, YouTube, and Vimeo -----
  // Supply full YouTube/Vimeo URLs or the video ID, and an explicit type in content.js.
  function embedUrl(video) {
    const src = String(video.src || '').trim();
    if (video.type === 'youtube') {
      let id = src;
      try {
        const url = new URL(src);
        const host = url.hostname.toLowerCase();
        if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
        else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
          id = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop() || '';
        } else return '';
      } catch { /* A plain ID is accepted below. */ }
      if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return '';
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
    }
    if (video.type === 'vimeo') {
      let id = src;
      let hash = '';
      try {
        const url = new URL(src);
        if (!['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname.toLowerCase())) return '';
        const parts = url.pathname.split('/').filter(Boolean);
        const idIndex = parts.findIndex(part => /^\d+$/.test(part));
        id = idIndex >= 0 ? parts[idIndex] : '';
        hash = url.searchParams.get('h') || parts[idIndex + 1] || '';
      } catch { /* A plain ID is accepted below. */ }
      if (!/^\d+$/.test(id)) return '';
      return `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1${/^[a-zA-Z0-9]+$/.test(hash) ? `&h=${hash}` : ''}`;
    }
    return '';
  }
  function stopMedia() {
    $$('video', media).forEach(video => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    });
    $$('iframe', media).forEach(frame => { frame.src = 'about:blank'; });
    media.replaceChildren();
    media.classList.remove('paused');
  }
  function mediaError(message, url) {
    if ($('.media-error', media)) return;
    const panel = element('div', 'media-error');
    panel.setAttribute('role', 'status');
    panel.append(element('p', '', message));
    const safe = externalUrl(url);
    if (safe) {
      const link = element('a', 'text-link', 'Open the video in a new tab \u2197');
      link.href = safe;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      panel.append(link);
    }
    media.append(panel);
  }
  function mountMedia(video = {}, poster, title, isDemo) {
    stopMedia();
    if (video.src) {
      if (!video.type || video.type === 'file') {
        const src = assetUrl(video.src);
        if (!src) { mediaError('The video path is invalid. Update it in content.js.'); return; }
        const player = element('video');
        player.controls = true;
        player.playsInline = true;
        player.preload = 'metadata';
        player.setAttribute('aria-label', title || 'Project video');
        const posterSrc = assetUrl(poster);
        if (posterSrc) player.poster = posterSrc;
        player.src = src;
        if (video.captions && assetUrl(video.captions)) {
          const track = element('track');
          track.kind = 'captions';
          track.src = assetUrl(video.captions);
          track.srclang = 'en';
          track.label = 'English';
          player.append(track);
        }
        player.addEventListener('error', () => mediaError('This video could not be loaded. Check its file path, format, or network connection.', video.src), { once: true });
        media.append(player);
        player.play().catch(() => { /* Native controls remain available when autoplay is blocked. */ });
      } else {
        const url = embedUrl(video);
        if (!url) { mediaError('This video link is invalid. Check its type and URL in content.js.', video.src); return; }
        const frame = element('iframe');
        frame.src = url;
        frame.title = `${title || 'Project'} video player`;
        frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
        frame.allowFullscreen = true;
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        media.append(frame);
      }
      return;
    }
    const image = element('img');
    const posterSrc = assetUrl(poster);
    if (posterSrc) image.src = posterSrc;
    image.alt = `${title || 'Project'} concept artwork`;
    media.append(image);
    const label = element('div', 'concept-label');
    label.append(element('span', '', isDemo ? 'CONCEPT PREVIEW / Add your project video in content.js' : 'PROJECT ARTWORK / Video coming soon'));
    const toggle = element('button', '', motionPreference.matches ? 'Play motion' : 'Pause motion');
    toggle.type = 'button';
    toggle.setAttribute('aria-pressed', String(motionPreference.matches));
    media.classList.toggle('paused', motionPreference.matches);
    if (motionPreference.matches) toggle.hidden = true;
    toggle.addEventListener('click', () => {
      const paused = media.classList.toggle('paused');
      toggle.textContent = paused ? 'Play motion' : 'Pause motion';
      toggle.setAttribute('aria-pressed', String(paused));
    });
    label.append(toggle);
    media.append(label);
  }
  function openDialog(trigger) {
    if (!dialog.open) {
      lastTrigger = trigger || document.activeElement;
      document.body.classList.add('dialog-open');
      dialog.showModal();
    }
    dialog.scrollTop = 0;
    syncAmbient();
    $('#dialog-close').focus({ preventScroll: true });
  }
  function metaItem(label, value) {
    const item = element('div');
    item.append(element('span', '', label), document.createTextNode(value || '-'));
    return item;
  }
  function openProject(index, trigger) {
    const project = projects[index];
    if (!project) return;
    currentProject = index;
    setText('#dialog-title', project.title || 'Project');
    setText('#dialog-category', `${project.category || 'Project'}${project.isDemo ? ' / EDITABLE CONCEPT' : ''}`);
    setText('#dialog-year', project.year || '');
    setText('#dialog-description', project.description || '');
    $('#dialog-meta').replaceChildren(metaItem('Role', project.role), metaItem('Tools', project.tools));
    $('#dialog-meta').hidden = false;
    const url = externalUrl(project.projectUrl);
    $('#project-external').hidden = !url;
    if (url) $('#project-external').href = url;
    else $('#project-external').removeAttribute('href');
    $('#next-project').hidden = visibleProjects().length < 2;
    mountMedia(project.video, project.cover, project.title, project.isDemo);
    openDialog(trigger);
  }
  $('#next-project').addEventListener('click', () => {
    const list = visibleProjects();
    const position = list.indexOf(projects[currentProject]);
    const next = list[(position + 1) % list.length];
    if (next) openProject(projects.indexOf(next));
  });
  $('#open-showreel').addEventListener('click', event => {
    const reel = content.showreel || {};
    currentProject = -1;
    setText('#dialog-title', reel.title || `${name} showreel`);
    setText('#dialog-category', reel.isDemo ? 'SHOWREEL / ORIGINAL DESIGN DEMO' : 'SHOWREEL');
    setText('#dialog-year', reel.isDemo ? '00:12' : '');
    setText('#dialog-description', reel.description || '');
    $('#dialog-meta').hidden = true;
    $('#project-external').hidden = true;
    $('#next-project').hidden = true;
    mountMedia(reel, reel.poster, reel.title, reel.isDemo);
    openDialog(event.currentTarget);
  });
  $('#dialog-close').addEventListener('click', () => dialog.close());
  let pointerBeganOutside = false;
  dialog.addEventListener('pointerdown', event => { pointerBeganOutside = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (event.target === dialog && pointerBeganOutside) dialog.close();
    pointerBeganOutside = false;
  });
  dialog.addEventListener('close', () => {
    stopMedia();
    document.body.classList.remove('dialog-open');
    if (lastTrigger && lastTrigger.isConnected) lastTrigger.focus({ preventScroll: true });
    syncAmbient();
  });

  // ----- Silent hero preview; respects reduced motion, data saver, and visibility -----
  const heroVideo = $('#hero-video');
  const ambientControl = $('#ambient-control');
  const backgroundSrc = assetUrl(content.showreel && content.showreel.backgroundSrc);
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const reelPoster = assetUrl(content.showreel && content.showreel.poster);
  if (reelPoster) { $('#reel-poster').src = reelPoster; heroVideo.poster = reelPoster; }
  if (content.showreel && content.showreel.badge) setText('#reel-badge', content.showreel.badge);
  function syncAmbient() {
    const allowed = backgroundSrc && !motionPreference.matches && !saveData;
    ambientControl.hidden = !allowed;
    const shouldPlay = allowed && !ambientUserPaused && heroInView && !document.hidden && !dialog.open;
    if (shouldPlay) {
      if (!heroVideo.getAttribute('src')) heroVideo.src = backgroundSrc;
      heroVideo.play().catch(() => {
        $('#showreel').classList.remove('is-playing');
        // The poster remains visible; the primary showreel player still works.
      });
    } else heroVideo.pause();
    if (motionPreference.matches) $('#showreel').classList.remove('is-playing');
    ambientControl.setAttribute('aria-pressed', String(ambientUserPaused));
    ambientControl.setAttribute('aria-label', ambientUserPaused ? 'Play background animation' : 'Pause background animation');
    $('span', ambientControl).textContent = ambientUserPaused ? 'Play motion' : 'Pause motion';
  }
  heroVideo.addEventListener('playing', () => $('#showreel').classList.add('is-playing'));
  heroVideo.addEventListener('error', () => { $('#showreel').classList.remove('is-playing'); ambientControl.hidden = true; });
  ambientControl.addEventListener('click', () => { ambientUserPaused = !ambientUserPaused; syncAmbient(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { heroInView = entries[0].isIntersecting; syncAmbient(); }, { threshold: 0.05 }).observe($('#showreel'));
  } else { heroInView = true; syncAmbient(); }
  document.addEventListener('visibilitychange', syncAmbient);
  if (typeof motionPreference.addEventListener === 'function') motionPreference.addEventListener('change', syncAmbient);
  else if (typeof motionPreference.addListener === 'function') motionPreference.addListener(syncAmbient);

  // ----- Services: native keyboard-accessible accordions -----
  const services = Array.isArray(content.services) ? content.services : [];
  // Keep the contact dropdown in sync with the editable services list.
  const serviceSelect = $('#contact-service');
  if (serviceSelect) {
    const placeholder = serviceSelect.options[0]?.cloneNode(true) || element('option', '', 'Select a service');
    placeholder.value = '';
    serviceSelect.replaceChildren(placeholder);
    services.forEach(service => {
      if (!service || !service.title) return;
      const option = element('option', '', service.title);
      option.value = service.title;
      serviceSelect.append(option);
    });
    const everything = element('option', '', 'A little bit of everything');
    everything.value = 'A little bit of everything';
    serviceSelect.append(everything);
  }
  services.forEach((service, index) => {
    const detail = element('details', 'service-item');
    const summary = element('summary');
    summary.append(element('span', 'service-number', String(index + 1).padStart(2, '0')));
    summary.append(element('h3', '', service.title));
    summary.append(element('span', 'service-summary', service.description));
    const expand = element('span', 'service-expand', '+');
    expand.setAttribute('aria-hidden', 'true');
    summary.append(expand);
    const body = element('div', 'service-detail');
    body.dataset.description = service.description;
    const tags = element('div', 'service-tags');
    (service.tags || []).forEach(tag => tags.append(element('span', '', tag)));
    const action = element('a', 'text-link', `Let's talk ${service.title.toLowerCase()} \u2197`);
    action.href = '#contact';
    action.addEventListener('click', () => {
      const select = $('#contact-service');
      const option = Array.from(select.options).find(item => item.value === service.title);
      if (option) select.value = option.value;
    });
    body.append(tags, action);
    detail.append(summary, body);
    $('#services-list').append(detail);
  });

  // ----- Contact: honest client-side draft + configurable mailto handoff -----
  const contact = content.contact || {};
  const recipient = String(contact.email || '').trim();
  const emailConfigured = validEmail(recipient);
  if (emailConfigured) {
    $('#contact-email').textContent = `${recipient} \u2197`;
    $('#contact-email').href = `mailto:${encodeURIComponent(recipient)}`;
    setText('#submit-label', 'Open email app');
    setText('#form-disclaimer', 'Opens your email app with a draft. Nothing is sent automatically or stored on this website.');
  }
  (contact.socials || []).forEach(social => {
    const url = externalUrl(social.url);
    if (!url) return;
    const link = element('a', '', `${social.label} \u2197`);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${social.label} (opens in a new tab)`);
    $('#social-links').append(link);
  });
  const fields = [
    { input: $('#contact-name'), error: $('#name-error'), check: value => value.trim().length > 0, message: 'Please enter your name.' },
    { input: $('#contact-address'), error: $('#email-error'), check: validEmail, message: 'Please enter a valid email address.' },
    { input: $('#contact-message'), error: $('#message-error'), check: value => value.trim().length >= 10, message: 'Please tell me a little more (at least 10 characters).' }
  ];
  fields.forEach(field => field.input.addEventListener('input', () => {
    if (field.input.getAttribute('aria-invalid') === 'true' && field.check(field.input.value.trim())) {
      field.input.removeAttribute('aria-invalid');
      field.error.textContent = '';
    }
  }));
  $('#enquiry-form').addEventListener('submit', event => {
    event.preventDefault();
    let firstInvalid;
    fields.forEach(field => {
      const valid = field.check(field.input.value.trim());
      field.input.setAttribute('aria-invalid', String(!valid));
      field.error.textContent = valid ? '' : field.message;
      if (!valid && !firstInvalid) firstInvalid = field.input;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }
    const person = $('#contact-name').value.trim();
    const email = $('#contact-address').value.trim();
    const service = $('#contact-service').value || 'A new creative project';
    const message = $('#contact-message').value.trim();
    const subject = `${name} enquiry - ${service}`;
    const body = `Hi ${name},\n\n${message}\n\nProject type: ${service}\n\nFrom: ${person}\nEmail: ${email}`;
    draftText = `Subject: ${subject}\n\n${body}`;
    $('#enquiry-draft').textContent = draftText;
    $('#form-result').hidden = false;
    setText('#form-result-title', 'Your enquiry draft');
    if (emailConfigured) {
      const mailto = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const fallback = $('#email-fallback');
      fallback.href = mailto;
      fallback.hidden = false;
      setText('#form-status', 'Your draft is ready. Complete and send it in your email app. If the app does not open, use the link below or copy the draft.');
      // A mail client may not be installed; the visible copyable draft is the fallback.
      window.location.href = mailto;
    } else {
      $('#email-fallback').hidden = true;
      setText('#form-status', 'Demo mode: no message has been sent. The site owner can add contact.email in content.js to enable the email handoff. You can copy this draft below.');
    }
    $('#form-result').focus({ preventScroll: true });
    $('#form-result').scrollIntoView({ behavior: motionPreference.matches ? 'auto' : 'smooth', block: 'nearest' });
  });
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch { /* Fall back on file:// and restricted clipboard contexts. */ }
    }
    const textarea = element('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.append(textarea);
    textarea.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Manual selection remains possible. */ }
    textarea.remove();
    return copied;
  }
  $('#copy-enquiry').addEventListener('click', async () => {
    const copied = await copyText(draftText);
    if (copied) notify('Enquiry draft copied.');
    else {
      const range = document.createRange();
      range.selectNodeContents($('#enquiry-draft'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      notify('Draft selected. Press Ctrl+C or Command+C to copy.');
    }
    $('#copy-enquiry').focus({ preventScroll: true });
  });

  // ----- Progressive, reduced-motion-aware scroll reveals -----
  if ('IntersectionObserver' in window && !motionPreference.matches) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    $$('.reveal').forEach(node => observer.observe(node));
  }
})();
