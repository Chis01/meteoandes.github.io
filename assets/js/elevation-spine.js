export function initElevationSpine() {
  const host = document.getElementById('ma-elevation-spine');
  const sections = [...document.querySelectorAll('[data-elevation]')];
  if (!host || !sections.length) return;
  const min=4700,max=5700;
  const ticks=[];
  for(let z=min;z<=max;z+=100){ const y=100-(z-min)/(max-min)*100; ticks.push(`<line x1="34" y1="${y}%" x2="${z%200===0?58:48}" y2="${y}%"/><text x="30" y="${y}%">${z%200===0?z:''}</text>`); }
  host.innerHTML=`<svg viewBox="0 0 62 600" preserveAspectRatio="none"><g class="ticks">${ticks.join('')}</g><line class="axis" x1="34" y1="0" x2="34" y2="600"/><circle class="indicator" cx="34" cy="300" r="5"/></svg>`;
  const indicator=host.querySelector('.indicator');
  const set=z=>{ const y=(1-(z-min)/(max-min))*600; indicator.setAttribute('cy',String(Math.max(0,Math.min(600,y)))); };
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)set(Number(e.target.dataset.elevation))}),{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(s=>io.observe(s));
}
