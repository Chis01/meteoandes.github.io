const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function initTransect() {
  const root = document.querySelector("[data-transect]");
  if (!root) return;
  const track = root.querySelector("[data-transect-track]");
  const progress = root.querySelector("[data-transect-progress]");
  const elev = root.querySelector("[data-transect-elevation]");
  const lat = root.querySelector("[data-transect-lat]");
  const lon = root.querySelector("[data-transect-lon]");
  const site = root.querySelector("[data-transect-site]");
  const markers = [...root.querySelectorAll("[data-transect-marker]")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(max-width: 899px)").matches;
  if (reduced || mobile || !track) return;

  const panels = [...track.children].length;
  const startElev = Number(root.dataset.startElev || 4700);
  const endElev = Number(root.dataset.endElev || 5700);
  const startLat = Number(root.dataset.startLat || -13.9000);
  const endLat = Number(root.dataset.endLat || -13.9310);
  const startLon = Number(root.dataset.startLon || -70.9000);
  const endLon = Number(root.dataset.endLon || -70.8250);
  const sites = (root.dataset.sites || "").split("|");

  let ticking = false;
  const update = () => {
    const rect = root.getBoundingClientRect();
    const scrollable = root.offsetHeight - innerHeight;
    const passed = clamp(-rect.top, 0, scrollable);
    const p = scrollable > 0 ? passed / scrollable : 0;
    track.style.transform = `translate3d(${-p * (panels - 1) * 100}vw,0,0)`;
    if (progress) progress.style.width = `${p * 100}%`;
    const z = Math.round((startElev + (endElev - startElev) * p) / 10) * 10;
    const english=document.documentElement.lang.startsWith("en");
    if (elev) elev.textContent = english ? new Intl.NumberFormat("en-US").format(z) : String(z).replace(/\B(?=(\d{3})+(?!\d))/g,"\u202f");
    const latValue=(startLat + (endLat - startLat) * p).toFixed(4);
    const lonValue=(startLon + (endLon - startLon) * p).toFixed(4);
    if (lat) lat.textContent = english ? latValue : latValue.replace(".",",");
    if (lon) lon.textContent = english ? lonValue : lonValue.replace(".",",");
    if (site && sites.length) site.textContent = sites[Math.min(sites.length - 1, Math.floor(p * sites.length))];
    markers.forEach(marker => {
      const mp = Number(marker.dataset.position || 0);
      marker.classList.toggle("is-visible", Math.abs(p - mp) < .095);
    });
    ticking = false;
  };

  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, {passive: true});
  addEventListener("resize", update, {passive: true});
  update();
}
