const S=[...document.querySelectorAll('.slide')];let i=0;
const bar=document.getElementById('bar'),num=document.getElementById('num'),hint=document.getElementById('hint');
function go(n){
  i=Math.max(0,Math.min(S.length-1,n));
  S.forEach((s,k)=>s.classList.toggle('on',k===i));
  bar.style.width=((i+1)/S.length*100)+'%';
  num.textContent=(i+1)+'/'+S.length;
  hint.style.opacity=i===0?1:0;
}
/* Zoom propio: Cmd/Ctrl + y − agrandan, Cmd/Ctrl 0 vuelve al 100 %. */
let z=1;try{z=parseFloat(localStorage.getItem('deck-zoom'))||1}catch(e){}
function zoom(n,show){
  z=Math.round(Math.max(.6,Math.min(2,n))*20)/20;
  document.documentElement.style.setProperty('--z',z);
  try{localStorage.setItem('deck-zoom',z)}catch(e){}
  if(show){num.textContent=Math.round(z*100)+' %';clearTimeout(zoom.t);zoom.t=setTimeout(()=>go(i),1200)}
}
/* Escribiendo en una nota o tocando un botón, el deck no navega. */
const typing=e=>e.target.closest&&e.target.closest('textarea,input,button,.chk,a');
addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey){
    if(['=','+'].includes(e.key)){e.preventDefault();zoom(z+.1,1)}
    else if(['-','_'].includes(e.key)){e.preventDefault();zoom(z-.1,1)}
    else if(e.key==='0'){e.preventDefault();zoom(1,1)}
    return;
  }
  if(typing(e)){if(e.key==='Escape')e.target.blur();return}
  if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();go(i+1)}
  if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();go(i-1)}
  if(e.key==='Home')go(0); if(e.key==='End')go(S.length-1);
  if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}
});
addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();zoom(z-e.deltaY*.01,1)}},{passive:false});
addEventListener('click',e=>{
  if(typing(e)||e.target.closest('.notes,.chk'))return;
  go(e.clientX<innerWidth*0.25?i-1:i+1)
});

/* ---------- Notas de la clase: se guardan en este navegador ---------- */
const KEY='taf-clase01-';
const get=k=>{try{return localStorage.getItem(KEY+k)||''}catch(e){return ''}};
const put=(k,v)=>{try{localStorage.setItem(KEY+k,v)}catch(e){}};
document.querySelectorAll('textarea[data-k]').forEach(t=>{
  t.value=get(t.dataset.k);
  t.addEventListener('input',()=>put(t.dataset.k,t.value));
});
/* Supuestos de Ariel: Sí / Ajustar / No */
document.querySelectorAll('.chk').forEach(g=>{
  const k=g.dataset.k,v=get(k);
  g.querySelectorAll('button').forEach(b=>{
    if(b.dataset.v===v)b.classList.add('sel');
    b.addEventListener('click',()=>{
      g.querySelectorAll('button').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel');put(k,b.dataset.v);
    });
  });
});
/* Exportar todo a Markdown */
const exp=document.getElementById('export');
if(exp)exp.addEventListener('click',()=>{
  let md='# TAF · Kit Asesor — Clase 1 · Relevamiento\n\n';
  S.forEach(s=>{
    const tas=s.querySelectorAll('textarea[data-k]'),chs=s.querySelectorAll('.chk');
    if(!tas.length&&!chs.length)return;
    const h=s.querySelector('h2');md+='## '+(h?h.innerText.replace(/\n/g,' '):'')+'\n\n';
    s.querySelectorAll('ol.q li').forEach(li=>md+='- '+li.innerText.replace(/\n/g,' ')+'\n');
    chs.forEach(g=>md+='- **'+g.dataset.label+'** → '+(get(g.dataset.k)||'sin definir')+'\n');
    tas.forEach(t=>md+='\n**Notas:**\n\n'+(t.value.trim()||'_(sin notas)_')+'\n');
    md+='\n';
  });
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));
  a.download='notas-clase-01-relevamiento.md';a.click();
});
zoom(z);go(0);
