const S=[...document.querySelectorAll('.slide')];let i=0;
const bar=document.getElementById('bar'),num=document.getElementById('num'),hint=document.getElementById('hint');
function go(n){
  i=Math.max(0,Math.min(S.length-1,n));
  S.forEach((s,k)=>s.classList.toggle('on',k===i));
  bar.style.width=((i+1)/S.length*100)+'%';
  num.textContent=(i+1)+'/'+S.length;
  hint.style.opacity=i===0?1:0;
}
/* Zoom propio. El deck se ajusta a la pantalla con vh/vw, así que el zoom del navegador
   no agranda nada (y en pantallas angostas hasta achica). Cmd/Ctrl + y − agrandan o achican
   el contenido de la slide; Cmd/Ctrl 0 vuelve al 100 %. Pellizcar el trackpad también. */
let z=1;try{z=parseFloat(localStorage.getItem('deck-zoom'))||1}catch(e){}
function zoom(n,show){
  z=Math.round(Math.max(.6,Math.min(2,n))*20)/20;
  document.documentElement.style.setProperty('--z',z);
  try{localStorage.setItem('deck-zoom',z)}catch(e){}
  if(show){num.textContent=Math.round(z*100)+' %';clearTimeout(zoom.t);zoom.t=setTimeout(()=>go(i),1200)}
}
addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey){
    if(['=','+'].includes(e.key)){e.preventDefault();zoom(z+.1,1)}
    else if(['-','_'].includes(e.key)){e.preventDefault();zoom(z-.1,1)}
    else if(e.key==='0'){e.preventDefault();zoom(1,1)}
    return;
  }
  if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();go(i+1)}
  if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();go(i-1)}
  if(e.key==='Home')go(0); if(e.key==='End')go(S.length-1);
  if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}
});
addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();zoom(z-e.deltaY*.01,1)}},{passive:false});
addEventListener('click',e=>go(e.clientX<innerWidth*0.25?i-1:i+1));
zoom(z);go(0);
