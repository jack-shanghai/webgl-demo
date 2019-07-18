import {mat4, initShaders,initTextures, getMvpMatrix, initVertexBuffers} from './utils/index.js'
import {createSphereModel} from './utils/geometry/index.js';

const VSHADER_SOURCE =`
  attribute vec4 a_Position; 
  attribute vec4 a_Normal;
  attribute vec2 a_TexCoord;

  uniform mat4 u_MvpMatrix; 
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  
  varying vec2 v_TexCoord;
  varying vec3 v_Normal; 
  varying vec3 v_Position; 
  void main() { 
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
    gl_Position = u_MvpMatrix * a_Position; 
    v_Position = vec3(u_ModelMatrix * a_Position); 
    v_TexCoord = a_TexCoord;
    v_Normal = normalize(vec3(u_ModelMatrix * a_Normal)); 
  }
`
  
const FSHADER_SOURCE =`
  precision mediump float; 
  uniform vec3 u_LightColor;
  uniform vec3 u_LightPosition;
  uniform vec3 u_AmbientLight;
  uniform sampler2D u_Sampler0;

  varying vec2 v_TexCoord;
  varying vec3 v_Normal; 
  varying vec3 v_Position; 

  void main() { 
    vec3 normal = normalize(v_Normal); 
    vec3 lightDirection = normalize(u_LightPosition - v_Position);
    float nDotL = max(dot(lightDirection, normal),0.0);
    vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
    vec3 diffuse = u_LightColor * color0.rgb * nDotL; 
    vec3 ambient = u_AmbientLight * color0.rgb; 
    gl_FragColor = vec4(diffuse+ambient, color0.a);
  }
`
  
const canvas = document.getElementById('webgl');
const gl = canvas.getContext('webgl');

initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
const n = initVertexBuffers(gl, createSphereModel(100));

gl.clearColor(0.0, 0.0, 0.5, 1.0);
gl.enable(gl.DEPTH_TEST);

const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
const u_EyePosition = gl.getUniformLocation(gl.program,'u_EyePosition');
const eyePosition = [0,0,4]

gl.uniform3f(u_LightColor, 1, 1, 1);
gl.uniform3f(u_LightPosition, 10, 0, 10);
gl.uniform3f(u_AmbientLight, 0.1, 0.1, 0.1);
gl.uniform3fv(u_EyePosition,eyePosition);

const modelMatrix = mat4.create();  // Model matrix
const normalMatrix = mat4.create(); // Transformation matrix for normals
const viewMatrix = mat4.create();
const perspectiveMatrix = mat4.create();

mat4.perspective(perspectiveMatrix,0.2*Math.PI,canvas.width/canvas.height,0.1,1000)

mat4.lookAt(viewMatrix,eyePosition,[0,0,0],[0,1,0]);
let mvpMatrix = getMvpMatrix(perspectiveMatrix,viewMatrix);

gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix);
gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix);
gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix);

const url0 = 'https://st-gdx.dancf.com/gaodingx/745312490/design/20190524-134937-1aa3.jpg'
mat4.rotate(modelMatrix,modelMatrix,-23.66*Math.PI/180,[0,0,1]);
initTextures(gl, [url0]).then(() => {
  draw()
})
  
function draw(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat4.rotate(modelMatrix,modelMatrix,Math.PI/360,[0,1,0]);
  gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, getMvpMatrix(perspectiveMatrix,viewMatrix, modelMatrix));
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
  window.requestAnimationFrame(draw);
}

