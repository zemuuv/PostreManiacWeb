/* ═══════════════════════════════════════════
   POSTREMANIAC — Landing Page Scripts
   ═══════════════════════════════════════════ */

/**
 * 1. SCROLL ANIMATIONS
 *    Uses IntersectionObserver to trigger .fade-up elements as they enter the viewport.
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once only
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}

/**
 * 2. NAVIGATION SHADOW ON SCROLL
 *    Adds a subtle shadow to the nav bar when the user scrolls past 40px.
 */
function initNavShadow() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const handleScroll = () => {
    nav.style.boxShadow =
      window.scrollY > 40
        ? '0 4px 30px rgba(0, 0, 0, 0.08)'
        : 'none';
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * 3. SMOOTH SCROLL FOR NAV CTA BUTTON
 *    The "Contactar" button in the nav scrolls to the #cta section.
 */
function initNavCTA() {
  const navCTA = document.querySelector('.nav-cta');
  if (!navCTA) return;

  navCTA.addEventListener('click', () => {
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/**
 * 4. ACTIVE NAV LINK HIGHLIGHT
 *    Highlights the nav link corresponding to the section currently in view.
 */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.style.color = '#EC4899'; // var(--rose-deep)
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * 5. METRICS COUNTER ANIMATION
 *    Animates the hero metric numbers counting up when they enter the viewport.
 */
function animateCounter(el, target, suffix, duration = 1400) {
  let start = null;
  const isFloat = target % 1 !== 0;

  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isFloat
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function initMetricsAnimation() {
  const metricEls = document.querySelectorAll('.metric-val');
  if (!metricEls.length) return;

  // Map each metric to its numeric value and suffix
  const metricsData = [
    { value: 4.2, suffix: 'B' },  // $4.2B  (prefix handled in HTML)
    { value: 3,   suffix: ' min' },
    { value: 92,  suffix: '%' },
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          metricEls.forEach((el, index) => {
            const data = metricsData[index];
            if (!data) return;
            // Preserve the prefix (e.g. "$") from data attribute if set
            const prefix = el.dataset.prefix || '';
            animateCounter(el, data.value, data.suffix);
            observer.unobserve(entry.target);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  // Observe the metrics container
  const metricsContainer = document.querySelector('.hero-metrics');
  if (metricsContainer) observer.observe(metricsContainer);
}

/**
 * 6. MOBILE MENU TOGGLE
 *    On mobile, tapping the logo area toggles a compact nav menu.
 *    (Nav links are hidden on mobile via CSS — this adds a basic open/close.)
 */
function initMobileMenu() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // Only activate on small screens
  const mediaQuery = window.matchMedia('(max-width: 900px)');

  // Create hamburger button dynamically
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label', 'Abrir menú');
  hamburger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  // Create mobile dropdown
  const mobileMenu = document.createElement('ul');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.innerHTML = `
    <li><a href="#pain">El Problema</a></li>
    <li><a href="#solution">Solución</a></li>
    <li><a href="#tech">Tecnología</a></li>
    <li><a href="#opportunity">Inversión</a></li>
    <li><a href="#cta" class="mobile-cta">Danos tu opinion →</a></li>
  `;

  // Inject hamburger styles
  const style = document.createElement('style');
  style.textContent = `
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }

  .hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: #3D1A2E;
    border-radius: 2px;
    transition: transform 0.25s, opacity 0.25s;
  }

  .hamburger.open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .hamburger.open span:nth-child(2) {
    opacity: 0;
  }
  .hamburger.open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .mobile-menu {
    display: none;
    position: fixed;
    top: var(--nav-height);
    left: 0;
    width: 100%;
    
    background: rgba(255, 248, 242, 0.98);
    backdrop-filter: blur(14px);

    list-style: none;
    padding: 1.5rem 2rem;

    flex-direction: column;
    gap: 1.2rem;

    border-bottom: 1px solid rgba(244, 114, 182, 0.15);
    z-index: 99;
  }

  .mobile-menu.open {
    display: flex;
  }

  .mobile-menu a {
    text-decoration: none;
    font-size: 0.9rem;     /* igual que .nav-links a */
    font-weight: 500;      /* igual que .nav-links a */
    color: var(--muted);
    transition: color 0.2s;
  }

  .mobile-menu a:hover {
    color: var(--rose-deep);
  }

  /* BOTÓN EN MÓVIL */
  .mobile-menu .mobile-cta {
    margin-top: 0.5rem;
    background: var(--rose-deep);
    color: #fff;
    padding: 0.6rem 1.4rem;
    border-radius: 100px;
    text-align: center;
    font-size: 0.88rem;
    font-weight: 600;
  }

  @media (max-width: 900px) {
    .hamburger {
      display: flex;
    }
  }
`;

  document.head.appendChild(style);

  nav.appendChild(hamburger);
  nav.after(mobileMenu);

  // Toggle menu
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

/**
 * 8. SCREENSHOTS SLIDER
 *    Handles prev/next navigation, dot indicators, and touch/drag swipe.
 */
function initScreenshotsSlider() {
  const track    = document.getElementById('screenshotsTrack');
  const dotsEl   = document.getElementById('screenshotsDots');
  const prevBtn  = document.querySelector('.slider-prev');
  const nextBtn  = document.querySelector('.slider-next');
  if (!track || !dotsEl || !prevBtn || !nextBtn) return;

  const slides     = track.querySelectorAll('.screenshot-slide');
  const dots       = dotsEl.querySelectorAll('.dot');
  const totalSlides = slides.length;

  // How many slides are visible at once depends on viewport width
  function visibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  let current = 0; // index of leftmost visible slide

  function maxIndex() {
    return Math.max(0, totalSlides - visibleCount());
  }

  function getSlideWidth() {
    const gap = 32; // 2rem gap
    const wrapperWidth = track.parentElement.offsetWidth;
    const visible = visibleCount();
    return (wrapperWidth - gap * (visible - 1)) / visible + gap;
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;

    // Update dots — highlight the dot nearest to center-visible slide
    const centerSlide = Math.min(current + Math.floor(visibleCount() / 2), totalSlides - 1);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === centerSlide));

    // Disable buttons at edges
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Dot clicks
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.dataset.index, 10);
      // Map dot index to a valid slide start index
      const slideIndex = Math.min(target, maxIndex());
      goTo(slideIndex);
    });
  });

  // Touch / drag swipe
  let touchStartX = 0;
  let touchDragging = false;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!touchDragging) return;
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      goTo(delta > 0 ? current + 1 : current - 1);
    }
    touchDragging = false;
  }, { passive: true });

  // Mouse drag (desktop)
  let mouseStartX = 0;
  let mouseDragging = false;

  track.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    mouseDragging = true;
    track.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', (e) => {
    if (!mouseDragging) return;
    const delta = mouseStartX - e.clientX;
    if (Math.abs(delta) > 50) {
      goTo(delta > 0 ? current + 1 : current - 1);
    }
    mouseDragging = false;
    track.style.cursor = 'grab';
  });

  // Recalculate on resize
  window.addEventListener('resize', () => goTo(current), { passive: true });

  // Set initial cursor & state
  track.style.cursor = 'grab';
  goTo(0);
}

/**
 * 9. LIGHTBOX
 *    Opens a full-screen zoomed view when a .zoomable image is clicked.
 *    Supports keyboard (Esc / arrows), prev/next navigation, and swipe.
 */
function initLightbox() {
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightboxImg');
  const lbCaption    = document.getElementById('lightboxCaption');
  const lbClose      = document.getElementById('lightboxClose');
  const lbPrev       = document.getElementById('lightboxPrev');
  const lbNext       = document.getElementById('lightboxNext');
  if (!lightbox || !lbImg) return;

  // Build counter badge dynamically
  const counter = document.createElement('div');
  counter.className = 'lightbox-counter';
  counter.id = 'lightboxCounter';
  lightbox.appendChild(counter);

  // Collect all zoomable images (in DOM order)
  const images = Array.from(document.querySelectorAll('.screen-img.zoomable'));
  let currentIndex = 0;

  function openAt(index) {
    currentIndex = index;
    const img = images[currentIndex];
    lbImg.src        = img.src;
    lbImg.alt        = img.alt;
    lbCaption.textContent = img.dataset.caption || img.alt;
    counter.textContent   = `${currentIndex + 1} / ${images.length}`;
    lbPrev.disabled  = currentIndex === 0;
    lbNext.disabled  = currentIndex === images.length - 1;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prev() { if (currentIndex > 0) openAt(currentIndex - 1); }
  function next() { if (currentIndex < images.length - 1) openAt(currentIndex + 1); }

  // Click on any zoomable image
  images.forEach((img, i) => {
    img.addEventListener('click', () => openAt(i));
  });

  // Controls
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  // Click backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  // Touch swipe inside lightbox
  let swipeStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    swipeStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const delta = swipeStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
    }
  }, { passive: true });
}

/**
 * 7. INIT ALL
 *    Entry point: runs all modules once the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavShadow();
  initNavCTA();
  initActiveNavLinks();
  initMetricsAnimation();
  initMobileMenu();
  initScreenshotsSlider();
  initLightbox();
});
