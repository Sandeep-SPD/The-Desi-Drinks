/**
 * ============================================================
 *  The Desi Drink — script.js
 *  All interactive features, comments explain each section
 * ============================================================
 */


/* ══════════════════════════════════════════════
   1. DARK MODE TOGGLE — with localStorage
   ══════════════════════════════════════════════ */

const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

// On page load, read saved theme from localStorage
function initTheme() {
  const saved = localStorage.getItem('brunTheme') || 'light';
  html.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

// Swap icon depending on current theme
function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-sun';   // show sun icon in dark mode
  } else {
    themeIcon.className = 'fas fa-moon';  // show moon icon in light mode
  }
}

// Toggle between dark and light
themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('brunTheme', next);
  updateThemeIcon(next);
});

initTheme(); // run on page load


/* ══════════════════════════════════════════════
   2. STICKY NAVBAR — changes style on scroll
   ══════════════════════════════════════════════ */

const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });


/* ══════════════════════════════════════════════
   3. ACTIVE NAV LINK on scroll
   ══════════════════════════════════════════════ */

const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.scrollY + 120; // offset so link activates slightly before section

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });


/* ══════════════════════════════════════════════
   4. MOBILE HAMBURGER MENU
   ══════════════════════════════════════════════ */

const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMobileMenu() {
  hamburger.classList.add('active');
  navLinksEl.classList.add('open');
  navOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeMobileMenu() {
  hamburger.classList.remove('active');
  navLinksEl.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = ''; // restore scroll
}

hamburger.addEventListener('click', () => {
  if (hamburger.classList.contains('active')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Close when overlay is tapped
navOverlay.addEventListener('click', closeMobileMenu);

// Close when a nav link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});


/* ══════════════════════════════════════════════
   5. SCROLL TO TOP BUTTON
   ══════════════════════════════════════════════ */

const scrollTopBtn = document.getElementById('scrollTop');

function handleScrollTopVisibility() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });


/* ══════════════════════════════════════════════
   6. ANIMATED STATS — count up when in view
   ══════════════════════════════════════════════ */

const statNums  = document.querySelectorAll('.stat-num');
let   statsAnimated = false;  // only run once

function animateStats() {
  statNums.forEach(el => {
    const target   = parseFloat(el.getAttribute('data-target'));
    const isFloat  = !Number.isInteger(target);    // e.g. 4.9
    const duration = 1800; // ms
    const steps    = 60;
    const increment = target / steps;
    let   current  = 0;
    let   step     = 0;

    const timer = setInterval(() => {
      step++;
      current = increment * step;
      if (step >= steps) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isFloat ? current.toFixed(1) : Math.round(current).toLocaleString();
    }, duration / steps);
  });
}

// Use IntersectionObserver to trigger when stats section is visible
const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateStats();
        statsObserver.disconnect(); // stop observing after first trigger
      }
    });
  }, { threshold: 0.4 });

  statsObserver.observe(statsSection);
}


/* ══════════════════════════════════════════════
   7. MENU ACCORDION
   ══════════════════════════════════════════════ */

const accItems = document.querySelectorAll('.acc-item');

accItems.forEach(item => {
  const trigger = item.querySelector('.acc-trigger');

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all open panels first (only one open at a time)
    accItems.forEach(i => i.classList.remove('open'));

    // If it wasn't open, open it; if it was already open, it stays closed
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});


/* ══════════════════════════════════════════════
   8. CONTACT DETAILS REVEAL
   ══════════════════════════════════════════════ */

const showContactBtn = document.getElementById('showContactBtn');
const hiddenContact  = document.getElementById('hiddenContact');

if (showContactBtn && hiddenContact) {
  let contactVisible = false;

  showContactBtn.addEventListener('click', () => {
    contactVisible = !contactVisible;

    if (contactVisible) {
      hiddenContact.classList.add('visible');
      showContactBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Contact Details';
    } else {
      hiddenContact.classList.remove('visible');
      showContactBtn.innerHTML = '<i class="fas fa-address-card"></i> Show Contact Details';
    }
  });
}


/* ══════════════════════════════════════════════
   9. REVIEW MODAL POPUP
   ══════════════════════════════════════════════ */

// const openReviewBtn    = document.getElementById('openReviewBtn');
// const reviewModal      = document.getElementById('reviewModal');
// const closeReviewModal = document.getElementById('closeReviewModal');

// // Open modal
// openReviewBtn.addEventListener('click', () => {
//   reviewModal.classList.add('open');
//   document.body.style.overflow = 'hidden';
// });

// // Close modal with X button
// closeReviewModal.addEventListener('click', () => {
//   reviewModal.classList.remove('open');
//   document.body.style.overflow = '';
// });

// // Close modal if user clicks outside the box
// reviewModal.addEventListener('click', (e) => {
//   if (e.target === reviewModal) {
//     reviewModal.classList.remove('open');
//     document.body.style.overflow = '';
//   }
// });

// // Close modal with Escape key
// document.addEventListener('keydown', (e) => {
//   if (e.key === 'Escape' && reviewModal.classList.contains('open')) {
//     reviewModal.classList.remove('open');
//     document.body.style.overflow = '';
//   }
// });


/* ══════════════════════════════════════════════
   10. STAR PICKER in Review Modal
   ══════════════════════════════════════════════ */

const starPicker = document.getElementById('starPicker');
if (starPicker) {
  const stars = starPicker.querySelectorAll('span');

  stars.forEach((star, i) => {
    // Fill stars on hover
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, j) => {
        s.textContent = j <= i ? '★' : '☆';
        s.classList.toggle('active', j <= i);
      });
    });

    // Reset to selected value on mouse leave
    star.addEventListener('click', () => {
      star.setAttribute('data-selected', 'true');
      stars.forEach((s, j) => {
        s.setAttribute('data-chosen', j <= i ? '1' : '0');
      });
    });
  });

  // Reset to chosen value when mouse leaves picker
  starPicker.addEventListener('mouseleave', () => {
    stars.forEach(s => {
      const chosen = s.getAttribute('data-chosen');
      s.textContent = chosen === '1' ? '★' : '☆';
      s.classList.toggle('active', chosen === '1');
    });
  });
}


/* ══════════════════════════════════════════════
   11. SWIPER — Gallery
   ══════════════════════════════════════════════ */

new Swiper('.gallery-swiper', {
  slidesPerView: 1.2,        // show a peek of the next slide
  spaceBetween: 20,
  centeredSlides: true,
  loop: true,
  autoplay: {
    delay: 3200,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: {
    el: '.gallery-pagination',
    clickable: true,
  },
  navigation: {
    prevEl: '.gallery-prev',
    nextEl: '.gallery-next',
  },
  breakpoints: {
    540: { slidesPerView: 1.8, spaceBetween: 24 },
    768: { slidesPerView: 2.4, spaceBetween: 28 },
    1024: { slidesPerView: 3.2, spaceBetween: 32 },
  },
});


/* ══════════════════════════════════════════════
   12. SWIPER — Reviews
   ══════════════════════════════════════════════ */

new Swiper('.reviews-swiper', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 4500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: {
    el: '.reviews-pagination',
    clickable: true,
  },
  breakpoints: {
    620: { slidesPerView: 1.5, spaceBetween: 20 },
    900: { slidesPerView: 2,   spaceBetween: 24 },
    1100: { slidesPerView: 2.5, spaceBetween: 28 },
  },
});


/* ══════════════════════════════════════════════
   13. AOS — Animate On Scroll init
   ══════════════════════════════════════════════ */

AOS.init({
  duration: 700,         // animation duration in ms
  easing: 'ease-out-cubic',
  once: true,            // animate only once per element
  offset: 80,            // px from bottom of viewport before animating
  disable: 'phone',      // disable on very small devices for performance
});


/* ══════════════════════════════════════════════
   14. SMOOTH SCROLL for anchor links
      (CSS scroll-behavior handles most of it;
       this JS handles cases with offsets)
   ══════════════════════════════════════════════ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


/* ══════════════════════════════════════════════
   15. PERFORMANCE: combine all scroll listeners
   ══════════════════════════════════════════════ */

// (Already attached individually above with passive:true for best performance)

console.log('☕ Brūn Café — script loaded.');
