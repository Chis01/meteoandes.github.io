function normalizedPath(pathname = location.pathname) {
  let path = pathname.replace(/\/+/g, "/");
  if (path.endsWith("/") && path !== "/") path += "index.html";
  return path;
}
function navKey(href) {
  if (/glaciares|glaciers/.test(href) && /index/.test(href)) return "glaciers";
  if (/investigacion\/index|research\/index/.test(href)) return "overview";
  if (/cambio-elevacion|elevation-change/.test(href)) return "elevation";
  if (/investigacion\/insar|research\/insar/.test(href)) return "insar";
  if (/meteorologia-glaciar|glacier-meteorology/.test(href)) return "meteo";
  if (/carbono-negro|black-carbon/.test(href)) return "blackcarbon";
  if (/albedo-energia|albedo-energy/.test(href)) return "albedo";
  if (/sentinel5p/.test(href)) return "sentinel";
  if (/metodos|methods/.test(href)) return "methods";
  if (/datos|\/data\//.test(href)) return "data";
  if (/publicaciones|publications/.test(href)) return "publications";
  if (/bitacora|field-log/.test(href)) return "fieldlog";
  return null;
}
function hrefPath(link) {
  try { return normalizedPath(new URL(link.href, location.origin).pathname); }
  catch { return null; }
}
export async function initLanguage() {
  const english = document.documentElement.lang.startsWith("en") || location.pathname.startsWith("/en/");
  const locale = english ? "en" : "es";
  const [strings, routes] = await Promise.all([
    fetch(`/assets/i18n/${locale}.json`).then(r=>r.json()),
    fetch("/assets/data/routes.json").then(r=>r.json())
  ]).catch(()=>[null,null]);
  const reverse = routes ? Object.fromEntries(Object.entries(routes).map(([es,en])=>[en,es])) : {};

  if (!document.querySelector(".skip-link")) {
    const skip=document.createElement("a");
    skip.className="skip-link";
    skip.href="#quarto-content";
    skip.textContent=strings?.skip || (english?"Skip to content":"Ir al contenido");
    document.body.prepend(skip);
  }

  if (strings) {
    document.querySelectorAll(".navbar a, .nav-footer a").forEach(link=>{
      const path=hrefPath(link);
      const key=navKey(path || link.getAttribute("href") || "");
      if(key && strings.nav[key]) link.textContent=strings.nav[key];
      if(english && path && routes?.[path]) link.href=routes[path];
      if(!english && path && reverse[path]) link.href=reverse[path];
    });
    const footer=document.querySelector(".nav-footer-right");
    if(footer) footer.textContent=strings.footer;
  }

  const candidates=[...document.querySelectorAll(".navbar a")];
  const switcher=candidates.find(a=>["EN","ES"].includes(a.textContent.trim()) || /versión|version|language/i.test(a.getAttribute("aria-label")||""));
  if (!switcher || !routes) return;
  const path=normalizedPath();
  const target=english ? reverse[path] : routes[path];
  switcher.textContent=english?"ES":"EN";
  switcher.setAttribute("hreflang",english?"es":"en");
  switcher.setAttribute("lang",english?"es":"en");
  switcher.setAttribute("aria-label",strings?.language || (english?"Switch to Spanish":"Cambiar a inglés"));
  if(target){
    switcher.href=target;
    switcher.classList.remove("ma-language-disabled");
    switcher.removeAttribute("aria-disabled");
  }else{
    switcher.href="#";
    switcher.classList.add("ma-language-disabled");
    switcher.setAttribute("aria-disabled","true");
    switcher.title=english?"Spanish translation not available":"Traducción al inglés aún no disponible";
  }
  switcher.addEventListener("click",()=>localStorage.setItem("meteoandes-language",english?"es":"en"));
}
