import {mountProjectDialog} from './project-dialog.js';
const root=document.querySelector('#iso400-portfolio');
import projects from './projects.js';
const detail=mountProjectDialog(root,projects);
const stage=root.querySelector('.iso-stage'),canvas=stage.querySelector('canvas');
const fallback=stage.querySelector('.iso-fallback'),status=root.querySelector('#iso-status');
const abort=new AbortController(),opts={signal:abort.signal};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const preview=new URLSearchParams(location.search).has('gallery');
import {clamp,wrap,smooth,step} from './gallery-math.js';
let renderer,scene,camera,track,geometry,THREE,raf=0,phase=0,target=0,speed=0,lastTime=0,lastInput=-Infinity;
let visible=true,admitted=window.parent===window,modal=false,disposed=false,ready=false,failed=false;
let pointer=null,dragY=0,downX=0,downY=0,moved=false,selected=-1;
let heartbeat=0,snapTimer=0;
const cards=[],textures=[];
const active=()=>ready&&!failed&&!disposed&&!document.hidden&&visible&&admitted&&!modal;
function announce(){const index=((Math.round(phase)%projects.length)+projects.length)%projects.length;if(index!==selected){selected=index;status.textContent=`${projects[index].name}. ${index+1} de ${projects.length}. Enter para abrir.`;}}
function request(){if(active()&&!raf){lastTime=performance.now();raf=requestAnimationFrame(frame);}}
function pause(){cancelAnimationFrame(raf);raf=0;lastTime=0;speed=0;}
function sync(){if(active())request();else {if(pointer!==null){const id=pointer;pointer=null;moved=true;if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);target=Math.round(target);}pause();}}
function place(){for(let i=0;i<cards.length;i++){const {mesh,pivot}=cards[i];const relative=wrap(phase-i,projects.length),d=Math.abs(relative);const shift=relative+Math.sign(relative)*7*smooth(.1,.9,d);const weight=smooth(0,1,1-smooth(0,.8,d));pivot.position.set(4.492/2,0,0);pivot.rotation.set(-.06681*weight,.36331*weight,-.51318*weight,'ZYX');mesh.position.set(shift-4.492/2,0,-4.492/2-1);mesh.rotation.y=Math.PI/2;mesh.material.uniforms.speed.value=reduced.matches?0:speed;mesh.visible=d<3.2;}scene.updateMatrixWorld(true);}
function frame(now){raf=0;if(!active())return;const dt=clamp((now-lastTime)/1000,0,.05);lastTime=now;
if(preview&&!reduced.matches&&now-lastInput>2500)target+=dt*.07;
({phase,speed}=step(phase,target,dt));
place();renderer.render(scene,camera);announce();
stage.dataset.phase=phase.toFixed(5);stage.dataset.speed=speed.toFixed(5);
if(Math.abs(target-phase)>0||preview&&!reduced.matches)raf=requestAnimationFrame(frame);
}
function resize(){if(!renderer||disposed||failed)return;const {width,height}=stage.getBoundingClientRect();if(!width||!height)return;const h=width<600?12.5:10.8;camera.left=-h*width/height/2;camera.right=-camera.left;camera.top=h/2;camera.bottom=-h/2;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,preview?.75:1.5));renderer.setSize(width,height,false);request();}
function input(){lastInput=performance.now();clearTimeout(snapTimer);snapTimer=setTimeout(()=>{if(pointer===null){target=Math.round(target);request();}},160);request();}
function pointerEnd(e){if(pointer!==e.pointerId)return;const id=pointer;pointer=null;if(canvas.hasPointerCapture(id))canvas.releasePointerCapture(id);input();}
function clickProject(e){if(!active()||moved||preview)return;const rect=canvas.getBoundingClientRect();const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);const hit=ray.intersectObjects(cards.filter(c=>c.mesh.visible).map(c=>c.mesh))[0];if(hit)detail.open(projects[hit.object.userData.index].key,canvas);}
canvas.addEventListener('wheel',e=>{if(!active()||preview)return;e.preventDefault();target+=clamp(e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?stage.clientHeight:1),-120,120)*.0025;input();},{...opts,passive:false});
canvas.addEventListener('pointerdown',e=>{if(!active()||preview||e.button!==0||pointer!==null)return;pointer=e.pointerId;dragY=downY=e.clientY;downX=e.clientX;moved=false;clearTimeout(snapTimer);canvas.setPointerCapture(pointer);canvas.focus({preventScroll:true});},opts);
canvas.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;const dy=dragY-e.clientY;dragY=e.clientY;moved ||= Math.hypot(e.clientX-downX,e.clientY-downY)>6;target+=clamp(dy,-100,100)*.006;input();},opts);
canvas.addEventListener('pointerup',e=>{if(pointer!==e.pointerId)return;pointerEnd(e);clickProject(e);},opts);
canvas.addEventListener('pointercancel',e=>{moved=true;pointerEnd(e);},opts);
canvas.addEventListener('lostpointercapture',e=>{if(pointer===e.pointerId){moved=true;pointerEnd(e);}},opts);
canvas.addEventListener('keydown',e=>{if(!active()||preview)return;let handled=true;switch(e.key){case 'ArrowDown':case 'ArrowRight':target=Math.round(target)+1;break;case 'ArrowUp':case 'ArrowLeft':target=Math.round(target)-1;break;case 'Home':target=0;break;case 'Enter':detail.open(projects[((Math.round(phase)%projects.length)+projects.length)%projects.length].key,canvas);break;default:handled=false;}if(handled){e.preventDefault();input();}},opts);
root.addEventListener('iso400:dialog',e=>{modal=e.detail.open;sync();},opts);
const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.01});intersection.observe(stage);
const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
document.addEventListener('visibilitychange',sync,opts);
reduced.addEventListener('change',()=>{speed=0;request();},opts);
window.addEventListener('message',e=>{if(window.parent===window||e.source!==window.parent||e.origin!==location.origin||!e.data||typeof e.data!=='object')return;if(e.data.type==='still-active'&&typeof e.data.active==='boolean'){admitted=e.data.active;sync();}},opts);
function fallbackView(){if(disposed)return;failed=true;pause();canvas.hidden=true;stage.querySelector('.iso-hint').hidden=true;fallback.hidden=false;fallback.replaceChildren();for(const project of projects){const button=document.createElement('button'),img=new Image(),label=document.createElement('span');img.src=project.cover.poster||project.cover.src;img.alt=project.name;img.loading='lazy';label.textContent=project.name;button.append(img,label);if(preview)button.disabled=true;else button.addEventListener('click',()=>detail.open(project.key,button),opts);fallback.append(button);}stage.dataset.fallback='true';}
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallbackView();},opts);
async function init(){try{THREE=await import('./vendor/three.module.js');if(disposed)return;renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0xededeb);scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,1000);camera.position.set(20,12.1,16.6);camera.lookAt(-7,-2.1,1.3);track=new THREE.Group();track.position.set(4.3,2.1,5.1);track.rotation.set(-.0215,2.2884,.2884);scene.add(track);geometry=new THREE.PlaneGeometry(4.492,4.492/1.6,12,32);
const loader=new THREE.TextureLoader();for(let i=0;i<projects.length;i++){const p=projects[i];const texture=await loader.loadAsync(p.cover.poster||p.cover.src);if(disposed||failed){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;textures.push(texture);const material=new THREE.ShaderMaterial({side:THREE.DoubleSide,uniforms:{cover:{value:texture},speed:{value:0},aspect:{value:texture.image.width/texture.image.height}},vertexShader:`varying vec2 vUv;uniform float speed;void main(){vUv=uv;vec3 p=position;p.z+=-sin(uv.y*2.)*.4*clamp(speed*2.,-2.,2.)*2.25;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`uniform sampler2D cover;uniform float aspect;varying vec2 vUv;void main(){vec2 uv=vec2(1.-vUv.x,vUv.y);vec2 fit=vec2(min(1.,aspect/1.6),min(1.,1.6/aspect));uv=(uv-.5)/fit+.5;vec3 paper=vec3(.846873);gl_FragColor=any(lessThan(uv,vec2(0.)))||any(greaterThan(uv,vec2(1.)))?vec4(paper,1.):texture2D(cover,uv);\n#include <colorspace_fragment>\n}`});const mesh=new THREE.Mesh(geometry,material),pivot=new THREE.Group();mesh.userData.index=i;pivot.add(mesh);track.add(pivot);cards.push({mesh,pivot});}
ready=true;stage.dataset.ready='true';resize();announce();window.parent.postMessage({type:'website-ready'},location.origin);heartbeat=setInterval(()=>{if(!document.hidden)window.parent.postMessage({type:'still-active',active:active()},location.origin);},2000);sync();}catch(error){console.warn('ISO 400: galería estática activada.',error);fallbackView();}}
function destroy(){if(disposed)return;disposed=true;pause();clearTimeout(snapTimer);clearInterval(heartbeat);abort.abort();intersection.disconnect();resizeObserver.disconnect();detail.destroy();geometry?.dispose();for(const {mesh} of cards)mesh.material.dispose();for(const texture of textures)texture.dispose();renderer?.dispose();renderer?.forceContextLoss();stage.dataset.disposed='true';}
window.addEventListener('pagehide',e=>{if(e.persisted)pause();else destroy();},opts);
window.addEventListener('pageshow',sync,opts);
root.addEventListener('iso400:destroy',destroy,opts);
init();
