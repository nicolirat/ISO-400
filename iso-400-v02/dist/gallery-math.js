export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const wrap=(v,n)=>((v+n/2)%n+n)%n-n/2;
export const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
export function step(phase,target,dt){dt=clamp(dt,0,.05);const next=phase+(target-phase)*(1-Math.pow(1-.047,dt*60));return Math.abs(target-next)<.0001?{phase:target,speed:0}:{phase:next,speed:dt?(next-phase)/(dt*60):0};}
