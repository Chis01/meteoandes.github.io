import {initReveal} from "./reveal-on-scroll.js";
import {initCounters} from "./counters.js";
import {initTransect} from "./transect.js";
import {initGalleryFilter} from "./gallery-filter.js";
import {initAlbedoSliders} from "./albedo-slider.js";
import {initReadingProgress} from "./reading-progress.js";
import {initForestPlots} from "./forest-plot.js";
import {initLanguage} from "./language.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (/\/(metodos|methods)\//.test(location.pathname)) document.body.classList.add("ma-method-page");
  await initLanguage();
  initReveal();
  initCounters();
  initTransect();
  initGalleryFilter();
  initAlbedoSliders();
  initReadingProgress();
  initForestPlots();

  const nav=document.querySelector(".navbar");
  let ticking=false;
  const compact=()=>{
    nav?.classList.toggle("ma-compact",scrollY>96);
    ticking=false;
  };
  addEventListener("scroll",()=>{
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(compact);
  },{passive:true});
  compact();

  document.querySelectorAll('a[href]').forEach(link=>{
    const href=link.getAttribute("href");
    if(!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http") || link.target==="_blank") return;
    link.addEventListener("click",event=>{
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      document.body.classList.add("ma-page-transition");
    });
  });
});
