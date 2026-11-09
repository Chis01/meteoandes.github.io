export function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('is-revealed'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Math.min(Number(entry.target.dataset.revealDelay || 0), 400);
      setTimeout(() => entry.target.classList.add('is-revealed'), delay);
      io.unobserve(entry.target);
    });
  }, {rootMargin:'0px 0px -10% 0px', threshold:.12});
  els.forEach(el => io.observe(el));
}
