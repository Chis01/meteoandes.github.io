import {initReveal} from './reveal-on-scroll.js';
import {initCounters} from './counters.js';
import {initElevationSpine} from './elevation-spine.js';
import {initGalleryFilter} from './gallery-filter.js';
import {initAlbedoSliders} from './albedo-slider.js';
import {initReadingProgress} from './reading-progress.js';

document.addEventListener('DOMContentLoaded',()=>{
  initReveal(); initCounters(); initElevationSpine(); initGalleryFilter(); initAlbedoSliders(); initReadingProgress();
  if (!document.querySelector('.skip-link')) { const skip=document.createElement('a'); skip.className='skip-link'; skip.href='#quarto-content'; skip.textContent=document.documentElement.lang.startsWith('en')?'Skip to content':'Ir al contenido'; document.body.prepend(skip); }
  const enLink=[...document.querySelectorAll('.navbar a')].find(a=>a.textContent.trim()==='EN');
  if(enLink){ const path=location.pathname; const map={'/glaciares/vilcanota.html':'/en/glaciers/vilcanota.html','/glaciares/quelccaya.html':'/en/glaciers/quelccaya.html','/glaciares/huaytapallana.html':'/en/glaciers/huaytapallana.html','/glaciares/tunshu.html':'/en/glaciers/tunshu.html','/glaciares/mateo.html':'/en/glaciers/mateo.html','/datos/index.html':'/en/data/index.html','/publicaciones/index.html':'/en/publications/index.html','/sobre/contacto.html':'/en/about/contact.html'}; if(path.startsWith('/en/')){enLink.textContent='ES'; const reverse=Object.fromEntries(Object.entries(map).map(([a,b])=>[b,a])); enLink.href=reverse[path]||'/';} else {enLink.href=map[path]||'/en/';}}
  const nav=document.querySelector('.navbar');
  const compact=()=>nav?.classList.toggle('ma-compact',scrollY>80);
  addEventListener('scroll',compact,{passive:true});compact();
});
