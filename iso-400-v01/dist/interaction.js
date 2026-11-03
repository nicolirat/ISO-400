// Marca volumétrica: capas del isotipo original, sin sustituir el puntero del sistema.
(()=>{const fine=matchMedia('(pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
for(const holder of document.querySelectorAll('.sign-sculpture')){for(let i=0;i<16;i++){const face=document.createElement('span');face.className='sign-face';face.style.setProperty('--z',i+'px');face.style.setProperty('--tone',i===15?'linear-gradient(var(--light,135deg),#faf9f2 0%,#aaa99f 28%,#f8f7ee 43%,#64645f 68%,#d5d3c7 100%)':`rgb(${47+i*5},${47+i*5},${44+i*5})`);holder.append(face)}}
const enabled=()=>fine.matches&&!reduced.matches&&!document.body.classList.contains('paused');
for(const target of document.querySelectorAll('.sign-object')){
 const area=target.classList.contains('hero-object')?document.querySelector('.metallic-hero'):target;
 area.addEventListener('pointermove',e=>{if(!enabled())return;const r=area.getBoundingClientRect(),nx=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1)),ny=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));target.style.setProperty('--rx',(-ny*16-8)+'deg');target.style.setProperty('--ry',(nx*28)+'deg');target.style.setProperty('--light',(135+nx*30)+'deg')},{passive:true});
 area.addEventListener('pointerleave',()=>{target.style.removeProperty('--rx');target.style.removeProperty('--ry');target.style.removeProperty('--light')});
}
})();
