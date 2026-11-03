export function mountProjectDialog(root, projects) {
const PROJECTS=projects, dialog=root.querySelector('dialog');
let lang='es',soundEnabled=false,activeProject=null,lastTrigger=null;
const capture=false,idx=()=>lang==='es'?0:1;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const abort=new AbortController(), options={signal:abort.signal};
const videoObserver=new IntersectionObserver(entries=>entries.forEach(({target:v,isIntersecting})=>{
v.muted=!(soundEnabled&&v.id==='project-video');
if(isIntersecting&&dialog.open&&!document.hidden&&!reduced.matches)v.play().catch(()=>{});
else v.pause();
}),{root:dialog,threshold:.05});
function observe(){videoObserver.disconnect();root.querySelectorAll('video').forEach(v=>videoObserver.observe(v));}
function media(m,name,cls=''){return m.type==='video'?`<video class="${cls}" muted loop playsinline controls preload="metadata" poster="${m.poster}" aria-label="${name}"><source src="${m.src}" type="video/mp4"></video>`:`<img class="${cls}" src="${m.src}" alt="${name}" loading="lazy">`;}
const emphasis={"brain":["cerebro digital","digital brain"],"arrivu":["claro, cercano y flexible","clear, approachable and flexible"],"cauye":["reflejo, naturaleza y un espíritu indómito","reflection, nature and an untamed spirit"],"ainwater":["inteligencia del agua","intelligence of water"],"macaix":["color, la textura y el detalle","colour, texture and detail"],"gota":["Tipografía, materia y agua","Typography, material and water"],"drysafe":["aventura","adventure"],"lt":["recorrer arquitectura","exploring architecture"],"udd":["pieza audiovisual","audiovisual piece"],"il-fuogo":["fuego a la mesa","fire to the table"],"liquid":["ritmo y dinamismo","rhythm and movement"]};
function intro(p){const text=p.intro[idx()],phrase=emphasis[p.key]?.[idx()];return phrase?text.replace(phrase,'<strong>'+phrase+'</strong>'):text;}
function renderProject(key){root.querySelectorAll("video").forEach(v=>v.pause());soundEnabled=false;activeProject=key;const p=PROJECTS.find(p=>p.key===key),next=PROJECTS[(PROJECTS.indexOf(p)+1)%PROJECTS.length];root.querySelector('#project-content').innerHTML=`<span class="eyebrow">ISO 400 / ${p.category[idx()]}</span><h2 class="detail-title" data-project-key="${p.key}" id="detail-heading">${p.name}</h2><div class="detail-lede"><span>${p.category[idx()]}<br>${lang==='es'?'Proyecto seleccionado':'Selected project'}</span><p>${intro(p)}</p></div><div class="detail-hero-media">${media(p.cover,p.name)}</div>${p.sections.map(sec=>`<section class="project-section"><h3>${sec.title[idx()]}</h3>${sec.text?`<p>${sec.text[idx()]}</p>`:''}${sec.colors?`<div class="swatches">${sec.colors.map(c=>`<span class="swatch" style="background:${c};color:${['#0D0D0D','#5F49F2'].includes(c)?'white':'#111'}">${c}</span>`).join('')}</div>`:''}<div class="detail-gallery">${sec.media.map(m=>`<figure class="${m.width/m.height>1.35?'landscape':''}">${media(m,m.caption||p.name)}${m.caption?`<figcaption>${m.caption}</figcaption>`:''}</figure>`).join('')}</div></section>`).join('')}<button class="detail-next">${lang==='es'?'Siguiente proyecto':'Next project'}: ${next.name} <svg class="project-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" aria-hidden="true" focusable="false" style="display:inline-block;vertical-align:-.12em;margin-left:.2em"><path d="M5 19 19 5M5 5h14v14"/></svg></button>`;root.querySelector('.detail-next').onclick=()=>{renderProject(next.key);dialog.scrollTop=0};setupProjectSound(p);observe()}

function setupProjectSound(project){
 root.querySelector('.project-sound')?.remove();
 const actions=root.querySelector('.project-actions')||(()=>{const a=document.createElement('div');a.className='project-actions';const close=root.querySelector('.close');close.before(a);a.append(close);return a})();
 if(!project.sound)return;
 const video=root.querySelector('.detail-hero-media video');video.id='project-video';
 const button=document.createElement('button');button.type='button';button.className='project-sound';button.setAttribute('aria-controls','project-video');
 const update=()=>{const label=lang==='es'?(soundEnabled?'Silenciar video':'Activar sonido del video'):(soundEnabled?'Mute video':'Enable video sound');button.setAttribute('aria-label',label);button.title=label;button.setAttribute('aria-pressed',String(soundEnabled));button.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" aria-hidden="true" focusable="false"><path d="M11 5 6 9H3v6h3l5 4V5Z"/>${soundEnabled?'<path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>':'<path d="m16 9 6 6m0-6-6 6"/>'}</svg>`};

 button.onclick=()=>{soundEnabled=!soundEnabled;video.muted=!soundEnabled;update()};
 actions.append(button);update();
}

function openProject(key,trigger){lastTrigger=trigger;renderProject(key);dialog.showModal();dialog.scrollTop=0;root.dispatchEvent(new CustomEvent('iso400:dialog',{detail:{open:true}}));}
root.querySelector('.close').addEventListener('click',()=>dialog.close(),options);
dialog.addEventListener('close',()=>{videoObserver.disconnect();root.querySelectorAll('video').forEach(v=>v.pause());soundEnabled=false;activeProject=null;lastTrigger?.focus({preventScroll:true});root.dispatchEvent(new CustomEvent('iso400:dialog',{detail:{open:false}}));},options);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}},options);
root.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;root.querySelectorAll('[data-lang]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));root.querySelector('.close').textContent=lang==='es'?'Cerrar ×':'Close ×';root.querySelector('.close').setAttribute('aria-label',lang==='es'?'Cerrar proyecto':'Close project');dialog.lang=lang;if(activeProject)renderProject(activeProject);},options));
document.addEventListener('visibilitychange',()=>{if(document.hidden)root.querySelectorAll('video').forEach(v=>v.pause());else if(dialog.open)observe();},options);
reduced.addEventListener('change',()=>{if(dialog.open)observe();},options);
return {open:openProject,destroy(){abort.abort();videoObserver.disconnect();root.querySelectorAll('video').forEach(v=>v.pause());dialog.close();root.querySelector('#project-content').replaceChildren();}};
}

