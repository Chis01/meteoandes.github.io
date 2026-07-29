function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

export function initCounters() {
  const nodes = [...document.querySelectorAll("[data-count-to]")];
  if (!nodes.length) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const english = document.documentElement.lang.startsWith("en");
  const format = (value, decimals) => {
    if (english) return new Intl.NumberFormat("en-US", {minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: true}).format(value);
    const negative = value < 0;
    const fixed = Math.abs(value).toFixed(decimals);
    const [integer, fraction] = fixed.split(".");
    const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
    return `${negative ? "−" : ""}${grouped}${fraction ? "," + fraction : ""}`;
  };

  const render = (node, value, final = false) => {
    const decimals = Number(node.dataset.decimals || 0);
    const finalValue = Number(node.dataset.countTo);
    const animateIntegerOnly = node.dataset.animateInteger === "true";
    const shown = animateIntegerOnly && !final ? Math.trunc(value) : value;
    const shownDecimals = final ? decimals : (animateIntegerOnly ? 0 : decimals);
    node.textContent = format(shown, shownDecimals);
    node.setAttribute("aria-label", format(finalValue, decimals));
  };

  const animate = node => {
    const target = Number(node.dataset.countTo);
    const duration = 1200;
    const startTime = performance.now();
    const step = now => {
      const t = Math.min(1, (now - startTime) / duration);
      render(node, target * easeOutCubic(t), t === 1);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (reduced || !("IntersectionObserver" in window)) {
    nodes.forEach(node => render(node, Number(node.dataset.countTo), true));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => animate(entry.target), index * 120);
      observer.unobserve(entry.target);
    });
  }, {threshold: .45});

  nodes.forEach(node => observer.observe(node));
}
