function csvRows(text) {
  const [head, ...rows] = text.trim().split(/\r?\n/);
  const keys = head.split(",");
  return rows.filter(Boolean).map(row => {
    const values = row.split(",");
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  });
}
function localized(value, digits=3) {
  const english = document.documentElement.lang.startsWith("en");
  if (english) return new Intl.NumberFormat("en-US",{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);
  const fixed=Math.abs(value).toFixed(digits);
  const [integer,fraction]=fixed.split(".");
  const grouped=integer.replace(/\B(?=(\d{3})+(?!\d))/g,"\u202f");
  return `${value<0?"−":""}${grouped}${fraction?","+fraction:""}`;
}
function el(name, attrs={}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([k,v]) => node.setAttribute(k,String(v)));
  return node;
}
export async function initForestPlots() {
  for (const root of document.querySelectorAll("[data-forest-plot]")) {
    try {
      const english=document.documentElement.lang.startsWith("en");
      const response = await fetch(root.dataset.source);
      const raw = csvRows(await response.text());
      const data=raw.map(row=>({
        label:row.estimador ?? row.estimator,
        slope:Number(row.pendiente_m_anio ?? row.slope_m_yr),
        lo:Number(row.limite_inferior ?? row.lower_limit),
        hi:Number(row.limite_superior ?? row.upper_limit),
        evidence:row.nivel ?? row.evidence
      }));
      const w=720,h=390,left=220,right=32,top=38,bottom=56,min=-2.6,max=.2;
      const x=value=>left+(Number(value)-min)/(max-min)*(w-left-right);
      const rowH=(h-top-bottom)/data.length;
      const svg=el("svg",{viewBox:`0 0 ${w} ${h}`,role:"img","aria-labelledby":"forest-title forest-desc"});
      const title=el("title",{id:"forest-title"}); title.textContent=english?"Five estimates of glacier surface elevation change":"Cinco estimadores del cambio de elevación superficial";
      const desc=el("desc",{id:"forest-desc"}); desc.textContent=english?"All estimates are negative and overlap in magnitude.":"Todos los estimadores son negativos y se superponen en magnitud.";
      svg.append(title,desc,el("line",{x1:x(0),x2:x(0),y1:top-10,y2:h-bottom+8,class:"ma-forest__zero"}));
      for(let tick=-2.5;tick<=0.01;tick+=.5){
        const line=el("line",{x1:x(tick),x2:x(tick),y1:h-bottom,y2:h-bottom+6,stroke:"currentColor"});
        const text=el("text",{x:x(tick),y:h-bottom+24,"text-anchor":"middle",class:"ma-forest__axis"});
        text.textContent=localized(tick,1); svg.append(line,text);
      }
      const axis=el("text",{x:(left+w-right)/2,y:h-8,"text-anchor":"middle",class:"ma-forest__axis"});
      axis.textContent=english?"Surface-elevation trend (m yr⁻¹)":"Tendencia de elevación superficial (m año⁻¹)"; svg.append(axis);
      const tooltip=document.createElement("div"); tooltip.className="ma-forest__tooltip"; root.append(tooltip);
      data.forEach((row,i)=>{
        const y=top+rowH*(i+.5);
        const label=el("text",{x:left-12,y:y+4,"text-anchor":"end",class:"ma-forest__label"}); label.textContent=row.label;
        const interval=el("line",{x1:x(row.lo),x2:x(row.hi),y1:y,y2:y,class:"ma-forest__interval",pathLength:"1",tabindex:"0"}); interval.style.animationDelay=`${i*120}ms`;
        const point=el("circle",{cx:x(row.slope),cy:y,r:7,class:"ma-forest__point",tabindex:"0"}); point.style.animationDelay=`${900+i*120}ms`;
        const show=evt=>{ tooltip.innerHTML=`<strong>${row.label}</strong><br>${english?"Estimate":"Estimación"}: ${localized(row.slope)}<br>${english?"Interval":"Intervalo"}: ${localized(row.lo)} ${english?"to":"a"} ${localized(row.hi)}<br>${english?"Evidence":"Evidencia"}: ${row.evidence}`; const rect=root.getBoundingClientRect(); const cx=evt.clientX||rect.left+x(row.slope); const cy=evt.clientY||rect.top+y; tooltip.style.left=`${Math.min(root.clientWidth-310,Math.max(8,cx-rect.left+12))}px`; tooltip.style.top=`${Math.max(8,cy-rect.top-28)}px`; tooltip.classList.add("is-visible"); };
        const hide=()=>tooltip.classList.remove("is-visible");
        [interval,point].forEach(node=>{node.addEventListener("mouseenter",show);node.addEventListener("mouseleave",hide);node.addEventListener("focus",show);node.addEventListener("blur",hide);});
        svg.append(label,interval,point);
      });
      root.prepend(svg);
      const animate=()=>svg.querySelectorAll(".ma-forest__interval,.ma-forest__point").forEach(node=>node.classList.add("is-drawn"));
      if(matchMedia("(prefers-reduced-motion: reduce)").matches) animate();
      else { const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){animate();observer.disconnect();}},{threshold:.35}); observer.observe(root); }
    } catch(error) { root.classList.add("ma-forest--fallback"); console.warn("MeteoAndes forest plot:",error); }
  }
}
