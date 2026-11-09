export function initGalleryFilter() {
  const gallery=document.querySelector('[data-glacier-gallery]');
  if(!gallery)return;
  const cards=[...gallery.querySelectorAll('[data-glacier-card]')];
  const search=document.querySelector('[data-gallery-search]');
  const chips=[...document.querySelectorAll('[data-filter-value]')];
  const status=document.querySelector('[data-gallery-status]');
  const empty=document.querySelector('[data-gallery-empty]');
  const clear=document.querySelector('[data-gallery-clear]');
  let filter='all';
  const apply=()=>{
    const q=(search?.value||'').trim().toLowerCase(); let shown=0;
    cards.forEach(card=>{
      const hay=(card.dataset.search||'').toLowerCase();
      const tags=(card.dataset.tags||'').split(' ');
      const ok=(filter==='all'||tags.includes(filter))&&(!q||hay.includes(q));
      card.classList.toggle('is-filtered',!ok); if(ok)shown++;
    });
    if(status)status.textContent=`Mostrando ${shown} de ${cards.length} sitios`;
    empty?.classList.toggle('is-visible',shown===0);
    const url=new URL(location.href); filter==='all'?url.searchParams.delete('filtro'):url.searchParams.set('filtro',filter); q?url.searchParams.set('q',q):url.searchParams.delete('q'); history.replaceState({},'',url);
  };
  chips.forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.filterValue;chips.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));apply()}));
  search?.addEventListener('input',apply);
  clear?.addEventListener('click',()=>{filter='all';if(search)search.value='';chips.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filterValue==='all')));apply()});
  const params=new URLSearchParams(location.search); const f=params.get('filtro'); const q=params.get('q');
  if(f&&chips.some(b=>b.dataset.filterValue===f)){filter=f;chips.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filterValue===f)))}
  if(q&&search)search.value=q; apply();
}
