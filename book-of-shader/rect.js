// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 drawRect(vec2 st,vec2 pos, vec2 size,vec3 color){
    vec2 bl = floor(st/max(pos,0.0001));
    vec2 r = min(vec2(0.99999),pos+size);
    vec2 tr = floor((1.-st)/(vec2(1.)-r));
    float pct = sign(bl.x*bl.y*tr.x*tr.y);
    color *= pct;
    return color;
}
void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 colorSum = vec3(0);
    vec2 pos = vec2(0.190,0.290);
    vec2 size = vec2(0.5);
    vec3 color = vec3(1,0,0);
    vec3 color1 = drawRect(st,pos,size,color);
    colorSum =color1;
    pos = vec2(0.100,0.340);
    size = vec2(0.630,0.370);
    color = vec3(0.586,1.000,0.943);
    color1 = drawRect(st,pos,size,color);
    colorSum = dot(color1,color1)>0.?color1:color1+colorSum;
    gl_FragColor = vec4(colorSum,1.0);
}
