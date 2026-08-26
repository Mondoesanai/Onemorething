document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    const photoFrame = heroVisual.querySelector('.hero-photo-frame');
    if (photoFrame) {
      heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        photoFrame.style.transform = `translate(${px * -10}px, ${py * -10}px) scale(1.03)`;
      });
      heroVisual.addEventListener('mouseleave', () => {
        photoFrame.style.transform = '';
      });
    }
  }

  const floatingReviewBtn = document.querySelector('.floating-review-btn');
  const reviewBand = document.getElementById('leave-a-review');
  if (floatingReviewBtn && reviewBand && 'IntersectionObserver' in window) {
    const reviewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          floatingReviewBtn.classList.toggle('is-hidden', entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    reviewObserver.observe(reviewBand);
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }
});
