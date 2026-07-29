function number(value, decimals = 0) {
  const english = document.documentElement.lang.startsWith("en");
  if (english) return new Intl.NumberFormat("en-US", {minimumFractionDigits: decimals, maximumFractionDigits: decimals}).format(value);
  const fixed = Math.abs(value).toFixed(decimals);
  const [integer, fraction] = fixed.split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  return `${value < 0 ? "−" : ""}${grouped}${fraction ? "," + fraction : ""}`;
}

export function initAlbedoSliders() {
  document.querySelectorAll("[data-albedo]").forEach(root => {
    const range = root.querySelector('input[type="range"]');
    const clean = root.querySelector("[data-albedo-clean]");
    const divider = root.querySelector("[data-albedo-divider]");
    const albedoOut = root.parentElement.querySelector("[data-albedo-value]");
    const absorbedOut = root.parentElement.querySelector("[data-absorbed-value]");
    const extraOut = root.parentElement.querySelector("[data-extra-value]");
    if (!range || !clean || !divider) return;

    const update = () => {
      const p = Number(range.value);
      clean.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      divider.style.left = `${p}%`;
      const darkAlpha = .45;
      const cleanAlpha = .80;
      const alpha = darkAlpha + (cleanAlpha - darkAlpha) * p / 100;
      const absorbed = 600 * (1 - alpha);
      const extra = absorbed - 600 * (1 - cleanAlpha);
      if (albedoOut) albedoOut.textContent = number(alpha, 2);
      if (absorbedOut) absorbedOut.textContent = `${number(absorbed, 0)} W m⁻²`;
      if (extraOut) extraOut.textContent = `${number(extra, 0)} W m⁻²`;
      range.setAttribute("aria-valuetext", `${number(p, 0)} %`);
    };
    range.addEventListener("input", update);
    update();
  });
}
