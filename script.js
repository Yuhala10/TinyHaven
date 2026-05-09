/* ═══════════════════════════════════════════════════
   TINY HOMES — script.js
   Cinematic · Smooth · Alive
═══════════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────────
// 1. PRELOADER
// ─────────────────────────────────────────────────
(function initPreloader() {
  const loader = document.getElementById('preloader');
  const fill   = document.querySelector('.pre-fill');
  if (!loader || !fill) return;

  document.body.style.overflow = 'hidden';
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('done');
        document.body.style.overflow = '';
        initCounters();
      }, 500);
    }
    fill.style.width = progress + '%';
  }, 100);
})();


// ─────────────────────────────────────────────────
// 2. CUSTOM CURSOR
// ─────────────────────────────────────────────────
(function initCursor() {
  const dot    = document.getElementById('cursorDot');
  const circle = document.getElementById('cursorCircle');
  if (!dot || !circle || window.innerWidth < 768) return;

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animCircle() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    circle.style.left = cx + 'px';
    circle.style.top  = cy + 'px';
    requestAnimationFrame(animCircle);
  })();

  document.addEventListener('mousedown', () => {
    dot.style.transform    = 'translate(-50%,-50%) scale(2.5)';
    circle.style.transform = 'translate(-50%,-50%) scale(0.7)';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform    = 'translate(-50%,-50%) scale(1)';
    circle.style.transform = 'translate(-50%,-50%) scale(1)';
  });
})();


// ─────────────────────────────────────────────────
// 3. NAVBAR SCROLL EFFECT
// ─────────────────────────────────────────────────
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    if (backTop) backTop.classList.toggle('show', y > 400);
  }, { passive: true });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        closeNav();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();


// ─────────────────────────────────────────────────
// 4. HAMBURGER / MOBILE NAV
// ─────────────────────────────────────────────────
let navOpen = false;

function toggleNav() {
  navOpen = !navOpen;
  document.getElementById('hamburger').classList.toggle('open', navOpen);
  document.getElementById('mobileNav').classList.toggle('open', navOpen);
  document.body.style.overflow = navOpen ? 'hidden' : '';
}

function closeNav() {
  navOpen = false;
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}

window.toggleNav = toggleNav;
window.closeNav  = closeNav;


// ─────────────────────────────────────────────────
// 5. HERO PARALLAX
// ─────────────────────────────────────────────────
(function initParallax() {
  const heroBg = document.querySelector('.hero-img');
  if (!heroBg || window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `scale(1.08) translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
})();


// ─────────────────────────────────────────────────
// 6. SCROLL REVEAL
// ─────────────────────────────────────────────────
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();


// ─────────────────────────────────────────────────
// 7. COUNTER ANIMATION
// ─────────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const dur    = 2000;
        const start  = performance.now();

        function tick(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / dur, 1);
          // easeOutExpo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


// ─────────────────────────────────────────────────
// 8. GALLERY FILTER
// ─────────────────────────────────────────────────
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.grid-item');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach((item, i) => {
        const cat = item.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.classList.remove('hidden');
          item.style.animationDelay = (i * 0.06) + 's';
          item.classList.add('fade-in');
          setTimeout(() => item.classList.remove('fade-in'), 600);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();


// ─────────────────────────────────────────────────
// 9. STYLE PICKER
// ─────────────────────────────────────────────────
function pickStyle(el) {
  document.querySelectorAll('.style-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('fstyle').value = el.getAttribute('data-val');

  // Ripple
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position:absolute; border-radius:50%;
    background:rgba(255,255,255,0.25);
    width:80px; height:80px;
    top:50%; left:50%;
    transform:translate(-50%,-50%) scale(0);
    animation:ripple 0.5s ease-out forwards;
    pointer-events:none;
  `;
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}
window.pickStyle = pickStyle;

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple { to { transform:translate(-50%,-50%) scale(2); opacity:0; } }`;
document.head.appendChild(rippleStyle);


// ─────────────────────────────────────────────────
// 10. ORDER FORM SUBMIT
// ─────────────────────────────────────────────────
function submitDream(e) {
  e.preventDefault();

  const fname    = document.getElementById('fname')?.value.trim();
  const femail   = document.getElementById('femail')?.value.trim();
  const fphone   = document.getElementById('fphone')?.value.trim();
  const fsize    = document.getElementById('fsize')?.value.trim();
  const fstyle   = document.getElementById('fstyle')?.value;
  const floc     = document.getElementById('flocation')?.value.trim();
  const ftl      = document.getElementById('ftimeline')?.value;
  const fbudget  = document.getElementById('fbudget')?.value;
  const fdesc    = document.getElementById('fdesc')?.value.trim();

  if (!fname || !femail || !fphone) {
    showToast('Please fill in your name, email and phone number.', 'error');
    return;
  }

  // Collect grid
  const selectedGrid = document.querySelector('input[name="grid"]:checked')?.value || 'Not specified';

  // Collect checkboxes
  const features = [...document.querySelectorAll('.check-opt input:checked')]
    .map(c => c.value).join(', ') || 'None specified';

  const subject = encodeURIComponent('Tiny Homes Inquiry - Purchase Request');
  const body = encodeURIComponent(
`Hello Tiny Homes Team,

I'm interested in purchasing a tiny home!

━━━━━━━━━━━━━━━━━━━━━━━
CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━
Name:    ${fname}
Email:   ${femail}
Phone:   ${fphone}

━━━━━━━━━━━━━━━━━━━━━━━
BUILD SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━
Size:      ${fsize || 'Not specified'}
Style:     ${fstyle || 'Not specified'}
Location:  ${floc || 'Not specified'}
Utilities: ${selectedGrid}
Features:  ${features}
Timeline:  ${ftl || 'Not specified'}
Budget:    ${fbudget || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━
MY DREAM HOME
━━━━━━━━━━━━━━━━━━━━━━━
${fdesc || 'No additional details provided.'}

Sent from tinyhomes.com`
  );

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.classList.add('loading');
  submitBtn.querySelector('span').textContent = 'Sending...';

  setTimeout(() => {
    window.location.href = `mailto:michealtinyhomesforsale@gmail.com?subject=${subject}&body=${body}`;
    submitBtn.classList.remove('loading');
    submitBtn.querySelector('span').textContent = 'Get Your Home';
    showToast('✨ Opening your email client...', 'success');
    document.getElementById('dreamForm').reset();
    document.querySelectorAll('.style-opt').forEach(o => o.classList.remove('selected'));
  }, 600);
}
window.submitDream = submitDream;


// ─────────────────────────────────────────────────
// 11. TESTIMONIALS CAROUSEL
// ─────────────────────────────────────────────────
let currentSlide = 0;
let autoSlideTimer;

function goSlide(n) {
  const slides = document.querySelectorAll('.testi-slide');
  const dots   = document.querySelectorAll('.tdot');
  if (!slides.length) return;

  slides[currentSlide].classList.remove('active');
  slides[currentSlide].classList.add('exit');
  setTimeout(() => slides[currentSlide - 0]?.classList.remove('exit'), 600);

  currentSlide = (n + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));

  resetAutoSlide();
}

function nextSlide() { goSlide(currentSlide + 1); }
function prevSlide() { goSlide(currentSlide - 1); }

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(() => goSlide(currentSlide + 1), 6000);
}

window.goSlide   = goSlide;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;

resetAutoSlide();

// Swipe support for testimonials
(function initSwipe() {
  const carousel = document.getElementById('testiCarousel');
  if (!carousel) return;
  let startX = 0;

  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  });
})();


// ─────────────────────────────────────────────────
// 12. NEWSLETTER
// ─────────────────────────────────────────────────
function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  if (!input) return;
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }
  showToast('🌿 You\'re on the list! Stay inspired.', 'success');
  input.value = '';
}
window.subscribeNewsletter = subscribeNewsletter;


// ─────────────────────────────────────────────────
// 13. TOAST NOTIFICATION
// ─────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.th-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'th-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed; bottom:2rem; left:50%;
    transform:translateX(-50%) translateY(20px);
    background:${type === 'success' ? 'var(--forest)' : '#8B2500'};
    color:white; padding:14px 28px;
    border-radius:50px; font-size:0.88rem;
    font-family:'Jost',sans-serif; font-weight:500;
    letter-spacing:0.5px;
    box-shadow:0 10px 40px rgba(0,0,0,0.2);
    z-index:9999; opacity:0;
    transition:all 0.5s cubic-bezier(0.34,1.56,0.64,1);
    pointer-events:none;
    white-space:nowrap;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }));

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-10px)';
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}


// ─────────────────────────────────────────────────
// 14. FORM INPUT FOCUS ANIMATIONS
// ─────────────────────────────────────────────────
(function initFormAnimations() {
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.querySelector('label')?.style.setProperty('color', 'var(--wood)');
    });
    input.addEventListener('blur', () => {
      input.parentElement.querySelector('label')?.style.setProperty('color', '');
    });
  });
})();


// ─────────────────────────────────────────────────
// 15. MARQUEE PAUSE ON HOVER
// ─────────────────────────────────────────────────
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();


// ─────────────────────────────────────────────────
// 16. ACTIVE NAV LINK ON SCROLL
// ─────────────────────────────────────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--wood)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


// ─────────────────────────────────────────────────
// 17. SMOOTH IMAGE LOADING
// ─────────────────────────────────────────────────
(function initImageLoad() {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    if (img.complete) img.style.opacity = '1';
  });
})();


// ─────────────────────────────────────────────────
// 18. GRID ITEM TILT EFFECT
// ─────────────────────────────────────────────────
(function initTilt() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      item.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.transition = 'transform 0.6s ease';
    });
    item.addEventListener('mouseenter', () => {
      item.style.transition = 'transform 0.15s ease';
    });
  });
})();


// ─────────────────────────────────────────────────
// 19. KEYBOARD ACCESSIBILITY
// ─────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNav();
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});


// ─────────────────────────────────────────────────
// 20. PAGE LOAD — hero entrance stagger
// ─────────────────────────────────────────────────
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal-up, .hero .reveal-fade').forEach(el => {
    el.style.animationPlayState = 'running';
    el.classList.add('visible');
  });
});