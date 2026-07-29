function getParam() {
  const url = new URL(location.href);
  return {filter: url.searchParams.get("f") || "all", q: url.searchParams.get("q") || ""};
}
function setParam(filter, q) {
  const url = new URL(location.href);
  if (filter === "all") url.searchParams.delete("f"); else url.searchParams.set("f", filter);
  if (!q) url.searchParams.delete("q"); else url.searchParams.set("q", q);
  history.replaceState({}, "", url);
}

export function initGalleryFilter() {
  document.querySelectorAll("[data-gallery]").forEach(gallery => {
    const cards = [...gallery.querySelectorAll("[data-site-card], [data-glacier-card]")];
    const scope = gallery.closest("[data-gallery-scope]") || document;
    const chips = [...scope.querySelectorAll("[data-filter]")];
    const search = scope.querySelector("[data-gallery-search]");
    const status = scope.querySelector("[data-gallery-status]");
    const empty = scope.querySelector("[data-gallery-empty]");
    if (!cards.length) return;
    let {filter, q} = getParam();
    if (search) search.value = q;
    chips.forEach(chip => chip.setAttribute("aria-pressed", chip.dataset.filter === filter ? "true" : "false"));

    const apply = () => {
      let visible = 0;
      cards.forEach(card => {
        const tags = (card.dataset.tags || "").toLowerCase().split(/\s+/);
        const haystack = (card.dataset.search || card.textContent).toLowerCase();
        const okFilter = filter === "all" || tags.includes(filter);
        const okQuery = !q || haystack.includes(q.toLowerCase());
        const show = okFilter && okQuery;
        card.classList.toggle("is-filtered", !show);
        card.setAttribute("aria-hidden", show ? "false" : "true");
        if (show) visible++;
      });
      const isEnglish = document.documentElement.lang.startsWith("en");
      if (status) status.textContent = isEnglish ? `${visible} visible sites` : `${visible} sitios visibles`;
      if (empty) empty.classList.toggle("is-visible", visible === 0);
      setParam(filter, q);
    };

    chips.forEach(chip => chip.addEventListener("click", () => {
      filter = chip.dataset.filter || "all";
      chips.forEach(item => item.setAttribute("aria-pressed", item === chip ? "true" : "false"));
      apply();
    }));
    search?.addEventListener("input", () => { q = search.value.trim(); apply(); });
    apply();
  });
}
