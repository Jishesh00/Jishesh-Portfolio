// ── MEGA MENU (desktop click-toggle, closes on outside click) ──
document.querySelectorAll('.nav-item.has-mega').forEach(item => {
  const trigger = item.querySelector('.nav-mega-trigger');
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains('mega-open');
    document.querySelectorAll('.nav-item.has-mega').forEach(i => i.classList.remove('mega-open'));
    if (!isOpen) item.classList.add('mega-open');
  });
});
document.addEventListener('click', () => document.querySelectorAll('.nav-item.has-mega').forEach(i => i.classList.remove('mega-open')));

// ── MOBILE SERVICES ACCORDION ──
const mobileMegaToggle = document.querySelector('.mobile-mega-toggle');
if (mobileMegaToggle) {
  mobileMegaToggle.addEventListener('click', () => {
    mobileMegaToggle.classList.toggle('open');
    document.querySelector('.mobile-mega').classList.toggle('open');
  });
}

// ── NAV ──
const nav = document.getElementById('mainNav');
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));
hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); navMobile.classList.toggle('open'); });
navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { hamburger.classList.remove('open'); navMobile.classList.remove('open'); }));

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
sections.forEach(s => new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id)); });
}, { rootMargin: '-40% 0px -55% 0px' }).observe(s));

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── COUNT-UP STATS ──
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count, 10);
    let cur = 0;
    const step = Math.max(1, Math.round(target / 40));
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur;
    }, 30);
    statObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObs.observe(el));

// ── HERO RANK COUNTER LOOP ──
const rankNum = document.getElementById('rankNum');
const sparkLine = document.getElementById('sparkLine');
if (rankNum) {
  const sequence = [47, 38, 29, 21, 14, 8, 4, 1];
  let i = 0;
  function tick() {
    rankNum.textContent = sequence[i];
    i = (i + 1) % sequence.length;
    if (i === 0) {
      sparkLine.style.animation = 'none';
      void sparkLine.offsetWidth;
      sparkLine.style.animation = 'drawLine 2.4s ease forwards';
    }
  }
  setInterval(tick, 1400);
}

// ── FORMSPREE SHARED SUBMIT ──
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mlgyzzrq";
function submitToFormspree(form) {
  return fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    body: new FormData(form),
    headers: { "Accept": "application/json" }
  }).then(response => {
    if (!response.ok) throw new Error("Form submission failed");
    return true;
  });
}

// ── AUDIT REQUEST FORM ──
function handleAuditSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.audit-submit');
  const original = btn.textContent;
  const success = form.nextElementSibling;
  btn.disabled = true; btn.textContent = 'Sending…';
  submitToFormspree(form)
    .then(() => {
      btn.disabled = false; btn.textContent = original;
      if (success) success.classList.add('show');
      form.reset();
      const t = document.getElementById('toast');
      if (t) {
        t.textContent = "✅ Got it. I'll send your free SEO audit within 24 hours.";
        t.classList.add('show');
        setTimeout(() => { t.classList.remove('show'); if (success) success.classList.remove('show'); }, 4500);
      }
    })
    .catch(() => {
      btn.disabled = false; btn.textContent = original;
      const t = document.getElementById('toast');
      if (t) {
        t.textContent = "⚠️ Something went wrong. Please try again or WhatsApp me directly.";
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 4500);
      }
    });
  return false;
}

// ── LIGHTBOX ──
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
  if (e) e.stopPropagation();
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = 'auto';
}
const lightboxImg = document.getElementById('lightbox-img');
if (lightboxImg) {
  lightboxImg.addEventListener('click', e => e.stopPropagation());
  document.querySelector('.lightbox .close').addEventListener('click', closeLightbox);
}

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type=submit]');
    const originalHTML = btn.innerHTML;
    const success = document.getElementById('formSuccess');
    btn.disabled = true; btn.innerHTML = 'Sending…';
    submitToFormspree(this)
      .then(() => {
        btn.disabled = false; btn.innerHTML = originalHTML;
        success.classList.add('show');
        this.reset();
        const t = document.getElementById('toast');
        t.textContent = "✅ Message sent. I'll reply within 24 hours.";
        t.classList.add('show');
        setTimeout(() => { t.classList.remove('show'); success.classList.remove('show'); }, 4500);
      })
      .catch(() => {
        btn.disabled = false; btn.innerHTML = originalHTML;
        const t = document.getElementById('toast');
        t.textContent = "⚠️ Something went wrong. Please try again or WhatsApp me directly.";
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 4500);
      });
  });
}
