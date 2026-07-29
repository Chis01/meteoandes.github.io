export function initReadingProgress(){
  const bar=document.getElementById('ma-reading-progress'); if(!bar)return;
  let scheduled=false;
  const update=()=>{const h=document.documentElement;const max=h.scrollHeight-h.clientHeight;bar.style.width=`${max?Math.min(100,h.scrollTop/max*100):0}%`;scheduled=false};
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});update();
}
