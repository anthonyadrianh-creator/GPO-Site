/* ============================================================
   GOLDPORT CORPORATION — Site Script
   ============================================================ */

// ---- Sticky header on scroll ------------------------------
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---- Mobile nav -------------------------------------------
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
const spans = navToggle.querySelectorAll('span');

navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
  navToggle.setAttribute('aria-expanded', open);
  if (open) {
    spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
    spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
    spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-expanded', 'false');
    spans.forEach(s => s.style.cssText = '');
  });
});

// ---- Scroll animations ------------------------------------
const animSelectors = [
  '.thesis-card', '.pf-card', '.team-card',
  '.news-card', '.cat-item', '.ci-block',
  '.resource-block', '.tl-item', '.g-bullet',
  '.section-header', '.hero-content', '.guyana-text',
  '.project-visual', '.price-inner', '.contact-form',
];

animSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-up');
    const d = i % 4;
    if (d === 1) el.classList.add('d1');
    if (d === 2) el.classList.add('d2');
    if (d === 3) el.classList.add('d3');
  });
});

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}

// ---- Active nav based on current page --------------------
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ---- Smooth scrolling with header offset ------------------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const id = this.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 20;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- Contact form -----------------------------------------
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Message Sent';
      btn.style.background = '#40916c';
      btn.style.borderColor = '#40916c';
      form.reset();
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

// ---- Animated number counter on hero stats ---------------
function animateCount(el, target, isDecimal = false, suffix = '') {
  const start = 0;
  const duration = 1800;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = start + (target - start) * ease;
    el.textContent = isDecimal ? val.toFixed(2) + suffix : Math.round(val).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = (isDecimal ? target.toFixed(2) : target.toLocaleString()) + suffix;
  }
  requestAnimationFrame(update);
}

// Observe hero stats for counter animation
const heroStats = document.querySelector('.hero-stats');
if (heroStats && 'IntersectionObserver' in window) {
  let animated = false;
  const heroIO = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !animated) {
      animated = true;
      heroIO.disconnect();
    }
  }, { threshold: 0.5 });
  heroIO.observe(heroStats);
}

// ---- Image lightbox modal --------------------------------
document.querySelectorAll('.clickable-image').forEach(img => {
  img.addEventListener('click', function() {
    const modalId = this.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  });
});

// Close modal on background click or close button
document.querySelectorAll('.modal').forEach(modal => {
  const closeBtn = modal.querySelector('.modal-close');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
});
