import assert from 'node:assert/strict';
import {step,wrap,smooth} from '../dist/gallery-math.js';
for(let i=-100;i<=100;i+=.13){const w=wrap(i,11);assert(w>=-5.5&&w<5.5);assert(Math.abs(w-wrap(i+11,11))<1e-12);}
const advance=(fps)=>{let p=0;for(let i=0;i<fps;i++)p=step(p,4,1/fps).phase;return p;};
assert(Math.abs(advance(60)-advance(120))<1e-10);
assert.deepEqual(step(0,4,2),step(0,4,.05));
let settled={phase:0,speed:1};for(let i=0;i<400;i++)settled=step(settled.phase,3,1/60);assert.deepEqual(settled,{phase:3,speed:0});
assert.equal(smooth(.1,.9,0),0);assert.equal(smooth(.1,.9,1),1);
assert.equal(step(3,3,0).speed,0);
console.log('PASS: cyclic wrapping, 60/120 Hz equivalence, dt clamp, exact settling and zero flex speed.');
