export function initAlbedoSliders(){
  document.querySelectorAll('[data-albedo-slider]').forEach(root=>{
    const after=root.querySelector('.ma-albedo__after'),handle=root.querySelector('.ma-albedo__handle'),knob=root.querySelector('.ma-albedo__knob');
    if(!after||!handle||!knob)return;
    let value=50;
    const set=v=>{value=Math.max(0,Math.min(100,v));after.style.clipPath=`inset(0 ${100-value}% 0 0)`;handle.style.left=`${value}%`;knob.style.left=`${value}%`;knob.setAttribute('aria-valuenow',String(Math.round(value)))};
    const fromEvent=e=>{const r=root.getBoundingClientRect();set((e.clientX-r.left)/r.width*100)};
    let dragging=false;
    knob.addEventListener('pointerdown',e=>{dragging=true;knob.setPointerCapture(e.pointerId)});
    knob.addEventListener('pointermove',e=>{if(dragging)fromEvent(e)});
    knob.addEventListener('pointerup',()=>dragging=false);
    root.addEventListener('click',e=>{if(e.target!==knob)fromEvent(e)});
    knob.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')set(value-5);if(e.key==='ArrowRight')set(value+5);if(e.key==='Home')set(0);if(e.key==='End')set(100)});
    set(50);
  });
}
