export function initCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run = el => {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    const target = Number(el.dataset.countTo);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    if (reduced || !Number.isFinite(target)) { el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`; return; }
    const start = performance.now(), duration = 1400;
    const step = now => {
      const t = Math.min(1,(now-start)/duration);
      const eased = 1-Math.pow(1-t,4);
      const value = target*eased;
      el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      if (t<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){run(e.target);io.unobserve(e.target)}}),{threshold:.4});
  counters.forEach(c => io.observe(c));
}
