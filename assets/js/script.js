// ===================================================================
// WP SLACK CANADA — JavaScript
// ===================================================================

// :::SECTION:Scroll Animations:::
const animatedElements = document.querySelectorAll('.animate-on-scroll');

if (animatedElements.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// :::SECTION:Smooth Scrolling:::
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// :::SECTION:FAQ Accordion:::
// Smooth open/close for details elements
document.querySelectorAll('.faq-item').forEach(item => {
  const summary = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  if (!summary || !answer) return;

  // Set up initial styles for animation
  answer.style.overflow = 'hidden';
  answer.style.transition = 'max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease';

  summary.addEventListener('click', function (e) {
    e.preventDefault();

    if (item.open) {
      // Closing
      answer.style.maxHeight = answer.scrollHeight + 'px';
      answer.style.opacity = '1';
      requestAnimationFrame(() => {
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
      });
      setTimeout(() => {
        item.open = false;
      }, 400);
    } else {
      // Opening
      item.open = true;
      const height = answer.scrollHeight;
      answer.style.maxHeight = '0';
      answer.style.opacity = '0';
      requestAnimationFrame(() => {
        answer.style.maxHeight = height + 'px';
        answer.style.opacity = '1';
      });
      // Remove maxHeight after animation so content can reflow
      setTimeout(() => {
        answer.style.maxHeight = 'none';
      }, 400);
    }
  });
});

// :::SECTION:Counter Animation:::
// Animate stat numbers when they come into view
function animateCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length === 0) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();

        // Only animate pure numbers
        const match = text.match(/^([\d,]+)(\+?)$/);
        if (match) {
          const target = parseInt(match[1].replace(/,/g, ''), 10);
          const suffix = match[2];
          const duration = 1500;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);

            el.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
              requestAnimationFrame(update);
            }
          }

          requestAnimationFrame(update);
        }

        counterObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(el => counterObserver.observe(el));
}

animateCounters();

// :::SECTION:Province Card Hover Effect:::
document.querySelectorAll('.province-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.willChange = 'transform';
  });

  card.addEventListener('mouseleave', function () {
    this.style.willChange = 'auto';
  });
});

// :::SECTION:Parallax Subtle Effect:::
// Subtle parallax on the final CTA background
function initParallax() {
  const finalCta = document.querySelector('.final-cta');
  if (!finalCta) return;

  // Only on desktop
  if (window.innerWidth < 768) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = finalCta.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
          const scrolled = (windowHeight - rect.top) / (windowHeight + rect.height);
          const yOffset = (scrolled - 0.5) * 40;
          finalCta.style.backgroundPositionY = `calc(50% + ${yOffset}px)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

initParallax();

// :::SECTION:Active Nav Highlighting:::
// Highlight active nav link based on scroll position
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.hero-nav-links a, .footer-list a[href^="#"]');

  if (sections.length === 0 || navLinks.length === 0) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let current = '';

        sections.forEach(section => {
          const sectionTop = section.offsetTop - 200;
          if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + current) {
            link.style.color = '';
            link.classList.add('is-active-link');
          } else {
            link.classList.remove('is-active-link');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

initActiveNav();
